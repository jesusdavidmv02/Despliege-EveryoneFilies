import { AppDataSourceMysql } from "../db/source.orm";
import { ReservaEntity } from "../entities/reserva.entity";
import{Repository} from "typeorm"
export class ReservaRepository {
  repository: Repository<ReservaEntity>;

  constructor() {
      this.repository = AppDataSourceMysql.getRepository(ReservaEntity)
  }

  agregar(reserva: ReservaEntity) {
      return this.repository.save(reserva)
  }

  obtener(){
      return this.repository.find({relations: ['pasajeroReservas', 'vuelo', 'pasajeroReservas.asiento']})
  }
  
  obtenerById(id: number){
      return this.repository.findOne({
        select:{
          id_reserva: true,
          id_vuelo: true,
          fecha_reserva: true,
          estado_reserva:true,
          cantidad_pasajeros:true,
        },
          where: {
              id_reserva:id
          },
          relations: ['pasajeroReservas', 'vuelo', 'pasajeroReservas.asiento'], // Esto asegura que cargue la relación
      })
  }

  eliminar(id_reserva: number) {
      return this.repository.delete({id_reserva})
  }

  actualizar(reserva: ReservaEntity) {
      return this.repository.update(reserva.id_reserva, {
       
        id_vuelo: reserva.id_vuelo,
        fecha_reserva: reserva.fecha_reserva,
        estado_reserva: reserva.estado_reserva,
        cantidad_pasajeros: reserva.cantidad_pasajeros
      })
  }


  cambioEstado(id_reserva: number) {
    return this.repository.update(id_reserva, {
      estado_reserva: "Pagado",
    })
}


  obtenerPorId(id_reserva: number){
      return this.repository.find({
          where: {
              id_reserva: id_reserva
          }
      })
  }

  reservaExistente(id_reserva: number) {
    return this.repository.findOne({
        where: { id_reserva: id_reserva },
        relations: ['pasajeroReservas', 'vuelo', 'pasajeroReservas.asiento'], // Esto asegura que cargue la relación
      });
  }

  
  

  async obtenerReservaConVuelo(id_reserva: number) {
     
    const reservaConVuelo = await this.repository
      .createQueryBuilder("reserva") // Alias para la tabla 'reserva'
      .innerJoinAndSelect("reserva.vuelo", "vuelo") // Alias para la relación con 'vuelos'
      .where("reserva.id_reserva = :id_reserva", { id_reserva }) // Filtro por id_reserva
      .select([
      "reserva.id_reserva",
      "reserva.fecha_reserva",
      "reserva.estado_reserva",
      "reserva.cantidad_pasajeros",
      "reserva.precio_total",
      "vuelo.id_vuelo",
      "vuelo.aerolinea",
      "vuelo.origen_aeropuerto",
      "vuelo.destino_aeropuerto",
      "vuelo.fecha_salida",
      "vuelo.fecha_llegada",
      "vuelo.duracion",
      "vuelo.total_asientos",
      "vuelo.asientos_disponibles",
      "vuelo.estado_vuelo",
      ]) // Especifica qué columnas quieres seleccionar
      .getOne();
  
    return reservaConVuelo;
  }


}