import { ReservaEntity } from "../infrastructure/entities/reserva.entity";
import { pasajeroReservaEntity } from "../infrastructure/entities/pasajero_reserva.entity";
import { ReservaRepository } from "../infrastructure/repositories/reserva.repository";
import { VueloRepository } from "../infrastructure/repositories/vuelo.repository";
import { PasajeroRepository } from "../infrastructure/repositories/pasajero.repository";
import { PasajeroEntity } from "../infrastructure/entities/pasajero.entity";
import { PasajeroReservaRepository } from "../infrastructure/repositories/pasajero_reserva.repository";
import { AsientoRepository } from "../infrastructure/repositories/asiento.repository";
import { CategoriaRepository } from "../infrastructure/repositories/categoria.repository";
// import { AppDataSource } from "../infrastructure/repositories/config/data-source-orm";
import { AppDataSourceMysql } from "../infrastructure/db/source.orm";
import { SeleccionarCategoriaController } from "./seleccionar_categoria-controller";


export class ReservaController {

  private repository: ReservaRepository ;
  private vueloRepository: VueloRepository;
  private pasajeroRepository: PasajeroRepository;
  private asientoRepository: AsientoRepository;
  private categoriaRepository: CategoriaRepository;
  private pasajeroReservaRepository: PasajeroReservaRepository;
  private seleccionarCategoriaController: SeleccionarCategoriaController;

  constructor() {
    this.repository = new ReservaRepository();
    this.vueloRepository = new VueloRepository();
    this.pasajeroRepository = new PasajeroRepository();
    this.asientoRepository = new AsientoRepository();
    this.categoriaRepository = new CategoriaRepository();
    this.pasajeroReservaRepository = new PasajeroReservaRepository();
    this.seleccionarCategoriaController = new SeleccionarCategoriaController();
  }

  // Crear una nueva reserva
  async crearReserva(data: { 
    id_vuelo: string; 
    ids_asientos: number[]; 
    datos_pasajeros: Array<{ nombre: string; apellido: string, email: string, telefono: string, nacionalidad: string, id_pasaporte: string }>
  }) {
    const reservaRepository = AppDataSourceMysql.getRepository(ReservaEntity);
    const pasajeroRepository = AppDataSourceMysql.getRepository(PasajeroEntity);

    // Verificar si el vuelo existe
    const id_vuelo = data.id_vuelo;
    let n_id_vuelo = Number(id_vuelo)

    const vuelo = await this.vueloRepository.obtenerPorId(Number(id_vuelo));
    console.log('vuelo', vuelo);
    
    if (!vuelo) {
      return "Vuelo no encontrado";
    }

    // Verificar disponibilidad de asientos
    const ids_asientos = data.ids_asientos;
    if (ids_asientos.length === 0) {
      return "Debe seleccionar al menos un asiento";
    }

    const asientosSeleccionados = await this.asientoRepository.obtenerAsientosPorIds(ids_asientos);
    console.log('asientosSeleccionados', asientosSeleccionados);
    
    if (asientosSeleccionados.length !== ids_asientos.length) {
      return "Uno o más asientos seleccionados no existen";
    }


    // Validar que los asientos estén disponibles y pertenezcan al vuelo
    for (const asiento of asientosSeleccionados) {

      console.log(!asiento.disponible || asiento.id_vuelo !== n_id_vuelo)
      console.log("----" +  asiento.disponible)
      console.log("----" +  asiento.id_vuelo)
      console.log("----" +  n_id_vuelo)




      if (!asiento.disponible || asiento.id_vuelo !== n_id_vuelo) {

        return `El asiento ${asiento.id_asiento} no está disponible para este vuelo`;
      }
    }

    // Verificar que los datos de pasajeros coincidan con los asientos seleccionados
    if (data.datos_pasajeros.length !== ids_asientos.length) {
      return "La cantidad de pasajeros no coincide con los asientos seleccionados";
    }

    // Insertar los pasajeros en la tabla pasajero y obtener sus IDs
    const pasajerosInsertados = [];
    for (const pasajeroData of data.datos_pasajeros) {
      const pasajero = pasajeroRepository.create(pasajeroData); // Crear un objeto pasajero con los datos recibidos
      await this.pasajeroRepository.agregar(pasajero); // Guardar el pasajero en la base de datos
      pasajerosInsertados.push(pasajero); // Guardar el pasajero insertado para asociarlo con la reserva
    }

    console.log("Pasajeros insertados", pasajerosInsertados);

    // Calcular precio total considerando categorías de asientos
    let precio_total = 0;
    for (const asiento of asientosSeleccionados) {
      let categoria = await this.categoriaRepository.obtenerCategoriaPorId(Number(asiento.id_categoria))

      const precioAsiento = await this.seleccionarCategoriaController.seleccionarCategoriaYCalcularPrecio({
        id_vuelo: n_id_vuelo,
        categoria: String(categoria?.nombre_categoria),
      });
      precio_total += precioAsiento.precio;
    }

    // Crear la reserva
    const reserva = reservaRepository.create({
      id_vuelo,
      cantidad_pasajeros: ids_asientos.length,
      precio_total,
      fecha_reserva: new Date(),
    });

    const nuevaReserva = await this.repository.agregar(reserva);

    console.log("---------nueva reserva-----------", nuevaReserva);

    // Asociar asientos y pasajeros a la reserva
    for (let i = 0; i < ids_asientos.length; i++) {
      
      const pasajero = data.datos_pasajeros[i];
      const asiento = asientosSeleccionados[i];
      const pasajero_insertado = pasajerosInsertados[i];
      
      let categoria = await this.categoriaRepository.obtenerCategoriaPorId(Number(asiento.id_categoria))
      const pasajeroReserva = new pasajeroReservaEntity();
      pasajeroReserva.id_reserva = nuevaReserva.id_reserva;
      pasajeroReserva.id_pasajero = pasajero_insertado.id_pasajero;
      pasajeroReserva.id_asiento = asiento.id_asiento;

      // Obtener el precio del asiento según su categoría
      const precioAsiento = await this.seleccionarCategoriaController.seleccionarCategoriaYCalcularPrecio({
        id_vuelo: n_id_vuelo,
        categoria: String(categoria?.nombre_categoria),
      });

      pasajeroReserva.precio_subtotal = Number(precioAsiento.precio);

      await this.pasajeroReservaRepository.agregar(pasajeroReserva);

      console.log("--------pasajeroReserva---------", pasajeroReserva);

      // Marcar el asiento como ocupado
      asiento.disponible = false;
      const asiento_ocupado = await this.asientoRepository.actualizarAsiento(asiento);
      console.log('------asiento-------', asiento_ocupado);
    }

    // Actualizar asientos disponibles en el vuelo
    vuelo.asientos_disponibles -= ids_asientos.length;
    const vuelo_asiento = await this.vueloRepository.actualizar(vuelo);
    console.log('------asiento-------', vuelo_asiento);
    return { ok: true, id: nuevaReserva.id_reserva };
  }

  //Metodo para cancelar reserva
  async cancelarReserva(id_reserva: number) {
    // Verificar si la reserva existe
    const reservaExistente = await this.repository.reservaExistente(id_reserva);
  
    if (!reservaExistente) {
      return "Reserva no encontrada";
    }
  
    // Obtener el vuelo asociado a la reserva
    const vuelo = reservaExistente.vuelo;
    if (!vuelo) {
      return "Vuelo no encontrado";
    }
  
    // Obtener la cantidad de pasajeros de la reserva
    const cantidadPasajeros = reservaExistente.pasajeroReservas.length;
  
    // Liberar los asientos asociados
    for (const pasajeroReserva of reservaExistente.pasajeroReservas) {
      const asiento = await this.asientoRepository.obtenerAsientoPorId(Number(pasajeroReserva.id_asiento));
      if (asiento) {
        asiento.disponible = true; // Marcar el asiento como disponible
        await this.asientoRepository.actualizarAsiento(asiento);
      }
      // Eliminar la relación en la tabla `PasajeroReserva`
      await this.pasajeroReservaRepository.eliminar(pasajeroReserva.id_pasajero_reserva);
    }
  
    // Incrementar la cantidad de asientos disponibles en el vuelo
    vuelo.asientos_disponibles += cantidadPasajeros;
    await this.vueloRepository.actualizar(vuelo);
  
    // Actualizar el estado de la reserva a "cancelado"
    reservaExistente.estado_reserva = "cancelado";
    await this.repository.agregar(reservaExistente);
  
    return { ok: true, mensaje: "Reserva cancelada exitosamente" };
  }
  
  async obtener() {
    const result = await this.repository.obtener();
    return result ;
  }

  async obtenerById(id: number) {
    try {
      const result = await this.repository.obtenerById(id);
      if (result) {
        return result
      } else {
        return "El ID de la reserva no se encuentra en la base de datos";
      }
    } catch (error) {
      console.log("Ha ocurrido un error al consultar el codigo de reserva."); 
      return error;
    }
  }

  async eliminar(id: number) {
    const result = await this.repository.eliminar(id);
    return  result
  }

  // Actualizar una reserva existente
  async actualizarReserva(data: {id_reserva: number, id_pasajero: number, cantidad_pasajeros: number, categoria: string}) {

    // Verificar si la reserva existe
    const reservaExistente = await this.repository.reservaExistente(data.id_reserva);
    const id_vuelo = Number(reservaExistente?.id_vuelo)
    console.log("id_vuelo", id_vuelo)

    if (!reservaExistente) {
      return "Reserva no encontrada";
    }

    // Verificar si el vuelo existe
    const vuelo = await this.vueloRepository.obtenerPorId(id_vuelo);
    console.log("vuelo", vuelo)
    if (!vuelo) {
      return "Vuelo no encontrado";
    }

    // Verificar si la cantidad de asientos es mayor o menor
    const diferenciaAsientos = data.cantidad_pasajeros - reservaExistente.pasajeroReservas.length;
    console.log('Diferencia asientos', diferenciaAsientos);
    

    // Verificar si hay suficiente disponibilidad de asientos en el vuelo
    if (diferenciaAsientos > 0 && vuelo.asientos_disponibles < diferenciaAsientos) {
      return "No hay suficientes asientos disponibles";
    }

    // Obtener el ID de categoría del asiento
    const categoria_asiento = await this.categoriaRepository.obtenerCategoriaPorNombre(data.categoria);
    console.log("categoria_asiento", categoria_asiento)
    if (!categoria_asiento) {
      return "Categoría no encontrada";
    }

    const id_categoria = categoria_asiento.id_categoria;

    // Consultar los asientos disponibles para la categoría y cantidad
    const detallesAsientosDisponibles = await this.asientoRepository.obtenerDetallesAsientosDisponibles(
      vuelo.id_vuelo,
      id_categoria,
      Math.abs(diferenciaAsientos)
    );
    console.log("detallesAsientosDisponibles", detallesAsientosDisponibles)

    if (detallesAsientosDisponibles.length < Math.abs(diferenciaAsientos)) {
      return "No hay suficientes asientos disponibles para esta categoría";
    }

    // Actualizar el vuelo según la diferencia de asientos
    if (diferenciaAsientos > 0) {
      // Reducir la cantidad de asientos disponibles en el vuelo
      vuelo.asientos_disponibles -= diferenciaAsientos;
      // const actualizarVuelo = await this.vueloRepository.actualizar(vuelo);
      console.log("actualizarVuelo", vuelo)

      // Obtener el precio del asiento según su categoría
      const precioAsiento = await this.seleccionarCategoriaController.seleccionarCategoriaYCalcularPrecio({
        id_vuelo: vuelo.id_vuelo,
        categoria: data.categoria,
      });
      console.log("precioAsiento", precioAsiento)

      // Crear relaciones de pasajero con nuevos asientos
      for (let i = 0; i < diferenciaAsientos; i++) {
        const asiento = detallesAsientosDisponibles[i];
        const pasajeroReserva = new pasajeroReservaEntity();
        pasajeroReserva.id_asiento = asiento.id_asiento;
        pasajeroReserva.id_reserva = reservaExistente.id_reserva;
        pasajeroReserva.id_pasajero = data.id_pasajero;
        pasajeroReserva.precio_subtotal = precioAsiento.precio;

        // const agregarPasajeroReserva = await this.pasajeroReservaRepository.agregar(pasajeroReserva);
        console.log("agregarPasajeroReserva", pasajeroReserva)

        // Actualizar el estado del asiento a ocupado
        asiento.disponible = false;
        // const actualizarAsiento =  await this.asientoRepository.actualizarAsiento(asiento);
        console.log("actualizarAsiento", asiento)
      }
    } else if (diferenciaAsientos < 0) {
      // Aumentar la cantidad de asientos disponibles en el vuelo
      vuelo.asientos_disponibles += Math.abs(diferenciaAsientos);
      // const actualizarVuelo =  await this.vueloRepository.actualizar(vuelo);
      console.log("actualizarVuelo", vuelo)

      // Eliminar las relaciones de pasajeros con los asientos
      const asientosAEliminar = reservaExistente.pasajeroReservas.slice(data.cantidad_pasajeros);

      for (const pasajeroReserva of asientosAEliminar) {
        // Actualizar el estado de los asientos a disponible
        const asiento = pasajeroReserva.asiento;
        
        if (asiento) {
          asiento.disponible = true;
          // const actualizarAsiento = await this.asientoRepository.actualizarAsiento(asiento);
          console.log("actualizarAsiento", asiento)
        }

        // Eliminar la relación de pasajero con el asiento
        const eliminarPasajeroReserva = await this.pasajeroReservaRepository.eliminar(pasajeroReserva.id_pasajero_reserva);
        console.log("eliminarPasajeroReserva", eliminarPasajeroReserva)
      }
    }

    // Calcular precio total actualizado
    let precio_total = 0;
    for (const asiento of detallesAsientosDisponibles) {
      const categoria = await this.categoriaRepository.obtenerCategoriaPorId(Number(asiento.id_categoria));
      const precioAsiento = await this.seleccionarCategoriaController.seleccionarCategoriaYCalcularPrecio({
        id_vuelo: vuelo.id_vuelo,
        categoria: String(categoria?.nombre_categoria),
      });
      precio_total += precioAsiento.precio;
    }

    // Actualizar los detalles de la reserva
    reservaExistente.precio_total = precio_total;
    const agregarReserva = await this.repository.agregar(reservaExistente);
    console.log("agregarReserva", agregarReserva)

    // Devolver la respuesta
    return { ok: true, id: reservaExistente.id_reserva };
  }
    
}