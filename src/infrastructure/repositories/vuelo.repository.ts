import { Repository } from "typeorm";
import { VueloEntity as VueloEntity } from "../entities/vuelos.entity";
import { CRUD } from "../../domain/crud";
import { AppDataSourceMysql } from "../db/source.orm";

export class VueloRepository implements CRUD {
  
  
  private repository: Repository<VueloEntity>;

  constructor() {
    this.repository = AppDataSourceMysql.getRepository(VueloEntity);
  }

  obtenerTodos(){
    return this.repository.find();
  }

  async obtenerPorId(id: number) {
    const vuelo = await this.repository.findOneBy({ id_vuelo: id });
    return vuelo != null ? vuelo : null;
  }

  async obtenerPorCodVuelo(id: string) {
    const vuelo = await this.repository.findOneBy({ cod_vuelo: id });
    return vuelo != null ? vuelo : null;
  }

  async crear(datos: VueloEntity) {
    const vuelo = this.repository.create(datos);
    const vueloExistente = await this.repository.findOneBy({
      cod_vuelo: datos.cod_vuelo,
    });
    if (vueloExistente) {
      return "El vuelo ya existe"; // Retorna null si el código ya está en uso
    } else {
      return this.repository.insert(vuelo);
      // return this.repositoryPgs.save(vuelo);
    }
  }

  async actualizar(datos: VueloEntity) {
    const result = await this.repository.update( datos.id_vuelo  , { 
      cod_vuelo: datos.cod_vuelo,
      aerolinea: datos.aerolinea,
      origen_aeropuerto: datos.origen_aeropuerto,
      destino_aeropuerto: datos.destino_aeropuerto,
      fecha_salida: datos.fecha_salida,
      fecha_llegada: datos.fecha_llegada,
      duracion: datos.duracion,
      total_asientos: datos.total_asientos,
      asientos_disponibles: datos.asientos_disponibles,
      estado_vuelo: datos.estado_vuelo,
    });

    if (result.affected && result.affected > 0) {
      return result;
    } else {
      return false;
    }
  }

  async eliminar(id: number) {
    const vuelo = await this.repository.findOneBy({ id_vuelo : id });
    if (vuelo) {
      await this.repository.remove(vuelo);
      return vuelo;
    } else {
      console.log('Vuelo no encontrado');
      return null;
    }
  }

  //funciones del cliente
  async buscarPorCriterios(origen?: string, destino?: string, fecha?: Date) {
    const vuelos = await this.repository.find({
      where: [
        { origen_aeropuerto: origen },
        { destino_aeropuerto: destino },
        { fecha_salida: fecha },
      ],
    });
    return vuelos.length > 0 ? vuelos : null;
  }
}
