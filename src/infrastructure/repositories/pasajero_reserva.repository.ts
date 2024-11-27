import { Repository } from "typeorm";
import { pasajeroReservaEntity } from "../entities/pasajero_reserva.entity";
import { AppDataSource } from "./config/data-source-orm";
import { AppDataSourceMysql } from "../db/source.orm";

export class PasajeroReservaRepository {
    repository: Repository<pasajeroReservaEntity>;

    constructor() {
        this.repository = AppDataSourceMysql.getRepository(pasajeroReservaEntity)
    }

    agregar(pasajero: pasajeroReservaEntity) {
        return this.repository.save(pasajero)
    }

    async obtenerPorReserva(id_reserva: number){
        const resultados = await this.repository.find({
            where: { id_reserva: id_reserva }
        });
        return resultados;
    }

    obtener(){
        return this.repository.find()
    }
    
    obtenerPorCriterio(nombre: string, email: string){
        return this.repository.find({
            where: {
              
            },
        })
    }

    eliminar(id_pasajero: number) {
        return this.repository.delete({})
    }

    actualizar(usuario: pasajeroReservaEntity) {
        // return this.repository.update({})
    }


    obtenerPorId(id_pasajero: number){
        return this.repository.find({
            where: {
                
            }
        })
    }


}