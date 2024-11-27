import dayjs from "dayjs";
import { AppDataSourceMysql } from "../infrastructure/db/source.orm";
import { TicketsEntity } from "../infrastructure/entities/tickets.entity";
import { PasajeroReservaRepository } from "../infrastructure/repositories/pasajero_reserva.repository";
import { ReservaRepository } from "../infrastructure/repositories/reserva.repository";
import { TicketsRepository } from "../infrastructure/repositories/tickets.respository";
import { generateFlightTicket } from "../infrastructure/service/impresionPDF";
import { PasajeroRepository } from "../infrastructure/repositories/pasajero.repository";
import { AsientoRepository } from "../infrastructure/repositories/asiento.repository";
import { enviarCorreo } from "../infrastructure/service/notificacion";
import { pasajeroReservaEntity } from "../infrastructure/entities/pasajero_reserva.entity";
import { VueloRepository } from "../infrastructure/repositories/vuelo.repository";


export class TicketsController {

  private ticketsRepository: TicketsRepository;
  private reservaRepository: ReservaRepository;
  private vueloRepository : VueloRepository;
  private pasajeroRepository : PasajeroRepository;
  private asientoRepository : AsientoRepository;
  private pasajeroReservaRepository: PasajeroReservaRepository;

  constructor() {
    this.ticketsRepository = new TicketsRepository();
    this.reservaRepository = new ReservaRepository();
    this.pasajeroReservaRepository = new PasajeroReservaRepository();
    this.vueloRepository =  new VueloRepository();
    this.pasajeroRepository =  new PasajeroRepository();
    this.asientoRepository =  new AsientoRepository();
  }

  //  procesos de check-in 
  async check(data : { id_reserva: number} ) {

    const reserva = await this.reservaRepository.obtenerPorId(Number(data.id_reserva));
    if (!reserva || reserva.length === 0) {
      throw new Error("Reserva no encontrada");
    }

    const pasajeroReserva = await this.pasajeroReservaRepository.obtenerPorReserva(Number(data.id_reserva));
    if (!pasajeroReserva || pasajeroReserva.length === 0) {
      throw new Error("No se encontraron pasajeros asociados a la reserva");
    }

    const reservaConVuelo = await this.reservaRepository.obtenerReservaConVuelo(Number(data.id_reserva));
     
    const FechaDeSalidad = reservaConVuelo?.vuelo.fecha_salida;
    const result =  await this.validarHoras(FechaDeSalidad);
    const horaFomateada = dayjs(FechaDeSalidad).format("DD/MM/YYYY HH:mm")


      if (result) {

        const result = await this.crearTicket( reserva , pasajeroReserva , data.id_reserva);
        await this.generaPDF( reserva , pasajeroReserva , data.id_reserva);

        const ticketConPasajero = await this.ticketsRepository.obtenerProIdReservaEntickes(Number(data.id_reserva));

        //envio por correo eletronico a todo los pasajero 
        for (let i = 0; i < ticketConPasajero.length; i++) {
          const buscarPasajero  =  await this.pasajeroRepository.obtenerPorId(ticketConPasajero[i].id_pasajero); 
          const Email = buscarPasajero?.email;
          const boardingPassPath = `./pdf/${buscarPasajero?.nombre} ${buscarPasajero?.apellido}.pdf` 
          enviarCorreo(Email, buscarPasajero, boardingPassPath );
        }
        return {
          ok : true ,
          mensaje : "Su  proceso de check-in  a hacido completado" ,
          fecha :  horaFomateada,
          recuerde : "Revise su correo "
        }
      } else {
          return { 
          mensaje : "El check-in no está disponible." ,
          fecha :  horaFomateada,
          recuerde : "Recueda el proceso de chek-in es 24 horas antes del vuelo y se cierra 1 hora antes"
        } ;
      }
  }
 
  // Generar el pdf de los pasajero o ticke
  async generaPDF(reserva  : any, pasajeroReserva :any , id_reserva : number){
  
    const id_vuelo = reserva[0].id_vuelo;
    const vuelo = await this.vueloRepository.obtenerPorId(Number(id_vuelo));
    const ticketConPasajero = await this.ticketsRepository.obtenerProIdReservaEntickes(Number(id_reserva));
    const asiento = await this.pasajeroReservaRepository.obtenerPorReserva(id_reserva);

    const FechaDeSalidad = vuelo?.fecha_salida;
    const result =  await this.validarHoras(FechaDeSalidad);
    const FechaSalidadFomateada = dayjs(FechaDeSalidad).format("DD/MM/YYYY HH:mm")
    
    const FechaDeLlegada = vuelo?.fecha_llegada;
    const result1 =  await this.validarHoras(FechaDeLlegada);
    const FechaLlegadaFomateada = dayjs(FechaDeLlegada).format("DD/MM/YYYY HH:mm")


    for (let i = 0; i < ticketConPasajero.length; i++) {
      const Asiento = await this.asientoRepository.obtenerAsientoPorId(asiento[i].id_asiento);
      const buscarPasajero =  await this.pasajeroRepository.obtenerPorId(ticketConPasajero[i].id_pasajero); 
       //Ejemplo de uso
       generateFlightTicket(
        {
          passengerName: buscarPasajero?.nombre && buscarPasajero?.apellido 
            ? `${buscarPasajero?.nombre} ${buscarPasajero?.apellido}` 
            : "Pasajero desconocido",
          flightNumber: vuelo?.cod_vuelo != null ? String(vuelo.cod_vuelo) : "No disponible",
          seat: Asiento?.numero_asiento != null ? Asiento?.numero_asiento : "No disponible",
          departureDate: FechaSalidadFomateada != null ? FechaSalidadFomateada.toString() : "Fecha no disponible",
          departureTime: FechaLlegadaFomateada != null ? FechaLlegadaFomateada.toString() : "6:30 a.m",
          departureAirport: vuelo?.origen_aeropuerto != null ? vuelo.origen_aeropuerto : "Medellín (José María Córdova)",
          arrivalAirport: vuelo?.destino_aeropuerto != null ? vuelo.destino_aeropuerto : "Cancún (Terminal 2)",
          duration: vuelo?.duracion != null ? String(vuelo.duracion) : "3h 19min",
          reservationCode: vuelo?.cod_vuelo != null ? String(vuelo.cod_vuelo) : "YWOPMZ",
          boardingGroup: "C", // Valor fijo
        },
        "./pdf/"
      );
  }}

  //validar las horas 
  async validarHoras( horaDeVuelo : any ) {
   const fechaSalida = horaDeVuelo;
    if (!fechaSalida) {
      throw new Error("La fecha de salida no está disponible.");
    }
    const ahora = new Date(); // Obtén la hora actual
    const aperturaCheckIn = new Date(fechaSalida); // Copia la fecha de salida
    aperturaCheckIn.setHours(aperturaCheckIn.getHours() - 24);
    const cierreCheckIn = new Date(fechaSalida); // Copia la fecha de salida
    cierreCheckIn.setHours(cierreCheckIn.getHours() - 1); // Resta 1 hora
    return ahora >= aperturaCheckIn && ahora <= cierreCheckIn;
  }

  // insercion a la base de datos en la tabla ticke
  async crearTicket( reserva : any , pasajeroReserva : any  , id_reserva : number) {
    const ticket_Repository = AppDataSourceMysql.getRepository(TicketsEntity);

    let crearTickets = null ;
    for (let i = 0; i < pasajeroReserva.length; i++) {
      const ticket = ticket_Repository.create({
        id_reserva: id_reserva,
        id_vuelo: reserva[0].id_vuelo,
        id_pasajero: pasajeroReserva[i].id_pasajero,
        fecha_emision: new Date(),
        estado_ticket: "check-in",
      });
      crearTickets = await this.ticketsRepository.agregar(ticket);
    }

     if (crearTickets?.id_reserva == id_reserva) {
      await this.reservaRepository.cambioEstado(Number(id_reserva));
      return true
     }else{
      return false
     }
  }

  async agregar(tickets: TicketsEntity) {
    const result = await this.ticketsRepository.agregar(tickets);
    if (result != null) {
      return { ok: true, id: result.id_ticket };
    } else {
      return { ok: false, messaje: "Error al guardar la reserva  " };
    }
  }

  async obtener() {
    const result = await this.ticketsRepository.obtener();
    return result;
  }

  async actualizar(tickets: TicketsEntity) {
    const result = await this.ticketsRepository.actualizar(tickets);
    if (result != null) {
      return { ok: true, id: result };
    } else {
      return { ok: false, id: result };
    }
  }

  async obtenerById(id: number) {
    try {
      const result = await this.ticketsRepository.obtenerById(id);
      if (result) {
        return result;
      } else {
        return "El Id del ticket no se encuentra";
      }
    } catch (error) {
      console.log("Ha ocurrido un error al consultar el id de la reserva.");
      return error;
    }
  }

  async eliminar(id: number) {
    const result = await this.ticketsRepository.eliminar(id);
    return result;
  }
}
