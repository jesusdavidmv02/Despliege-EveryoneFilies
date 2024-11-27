import { Repository } from "typeorm";
import { PasajeroEntity } from "../entities/pasajero.entity";
import { AppDataSource } from "./config/data-source-orm";
import { AppDataSourceMysql } from "../db/source.orm";

export class PasajeroRepository {
    repository: Repository<PasajeroEntity>;

    constructor() {
        this.repository = AppDataSourceMysql.getRepository(PasajeroEntity)
    }

    agregar(pasajero: PasajeroEntity) {
        return this.repository.save(pasajero)
    }

    obtener(){
        return this.repository.find({
            select: {
                id_pasajero: true,
                nombre: true,
                email: true,
            }
        })
    }
    
    obtenerPorCriterio(nombre: string, email: string){
        return this.repository.find({
            where: {
                nombre: nombre,
                email: email,
            },
        })
    }

    eliminar(id_pasajero: number) {
        return this.repository.delete({id_pasajero})
    }

    actualizar(usuario: PasajeroEntity) {
        return this.repository.update({ id_pasaporte: usuario.id_pasaporte}, {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
            nacionalidad: usuario.nacionalidad 
        })
    }


    obtenerPorId(id_pasajero: number){
        return this.repository.findOne({
            where: {
                id_pasajero: id_pasajero
            }
        })
    }


}