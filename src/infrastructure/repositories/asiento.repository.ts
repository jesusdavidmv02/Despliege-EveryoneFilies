import { AsientoEntity } from "../entities/asientos.entity";
import { AppDataSourceMysql } from "../db/source.orm";
import { VueloEntity } from "../entities/vuelos.entity";
import { In } from "typeorm";

export class AsientoRepository {

  private asientoRepo = AppDataSourceMysql.getRepository(AsientoEntity);
  private vuelosRepo = AppDataSourceMysql.getRepository(VueloEntity);
  
  // Obtener todos los asientos
  async obtenerAsientos() {
    return this.asientoRepo.find(); // Obtener todos los asientos
  }

  // Obtener un asiento por su id
  async obtenerAsientoPorId(idAsiento: number | undefined) {
    const asiento = await this.asientoRepo.findOneBy({ id_asiento: idAsiento });
    return asiento != null ? asiento : null;
  }

  async obtenerAsientosPorIds(ids_asientos: number[]) {
    if (!ids_asientos.length) {
        throw new Error("El arreglo de IDs de asientos está vacío");
    }

    const asientos = await this.asientoRepo.findBy({ 
        id_asiento: In(ids_asientos) 
    });

    return asientos;
  }

  // Agregar un nuevo asiento
  async agregarAsiento(datos: AsientoEntity) {
    const asiento = this.asientoRepo.create(datos);


    const vuelo = await this.vuelosRepo.findOne({
      where: { id_vuelo : datos.id_vuelo },
      select: ["id_vuelo", "total_asientos"]});

      if (!vuelo) {
        throw new Error("El vuelo especificado no existe");
    }

    const asientosActuales = await this.asientoRepo.count({ where: { id_vuelo : datos.id_vuelo } });
    if (asientosActuales >= vuelo.total_asientos! ) {
      throw new Error("No se pueden agregar más asientos para este vuelo, ya alcanzó el límite permitido");
    }

    const asientoExistente = await this.asientoRepo.findOneBy({ id_vuelo: datos.id_vuelo, numero_asiento: datos.numero_asiento });
    if (asientoExistente) {
      return null; // Retorna null si el asiento ya está en uso (mismo vuelo y número de asiento)
    } else {
      // return this.asientoRepo.insert(asiento);
      return this.asientoRepo.save(asiento);
    }
    
  }

  // Actualizar un asiento existente
  async actualizarAsiento(datos: AsientoEntity) {
    const result = await this.asientoRepo.update(datos.id_asiento, {
      vuelo: { id_vuelo: datos.id_vuelo}, 
      id_categoria: datos.id_categoria,
      disponible: datos.disponible,
      numero_asiento: datos.numero_asiento,
      // id_precio_temporal: datos.id_precio_temporal,
    });

    if (result.affected && result.affected > 0) {
      return result;
    } else {
      return false;
    }
  }

  // Eliminar un asiento por su id
  async eliminarAsiento(idAsiento: number) {
    const asiento = await this.asientoRepo.findOneBy({ id_asiento: idAsiento });
    if (asiento) {
      await this.asientoRepo.remove(asiento);
      return asiento;
    } else {
      console.log('Asiento no encontrado');
      return null;
    }
  }

   // Obtener asiento disponible
   async obtenerAsientoDis(id_vuelo: number, id_categoria_asiento: number) {
    console.log(id_vuelo);
    console.log(id_categoria_asiento);
    
    const asiento = await this.asientoRepo.count({
      where: {
        id_vuelo: id_vuelo,
        id_categoria_asiento: id_categoria_asiento,
        disponible: true,
      },
    })
    return asiento;
  }

  async obtenerDetallesAsientosDisponibles(id_vuelo: number, id_categoria: number, cantidad: number) {
    return this.asientoRepo.find({
        where: {
            id_vuelo,
            id_categoria,
            disponible: true, // suponiendo que hay un campo para disponibilidad
        },
        take: cantidad, // Esto limita la cantidad de registros a devolver
    });
  }

  async obtenerAsientosDisponiblesCategoria(id_vuelo: number, id_categoria: number) {
    return this.asientoRepo.find({
        where: {
            id_vuelo,
            id_categoria,
            disponible: true,
        },
    });
  }

  async obtenerAsientosCategoria(id_vuelo: number, id_categoria: number) {
    return this.asientoRepo.find({
        where: {
            id_vuelo,
            id_categoria,
        },
    });
  }
}