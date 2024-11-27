import { PasajeroDto } from "../infrastructure/dto/pasajero.dto";
import { PasajeroEntity } from "../infrastructure/entities/pasajero.entity";
import { PasajeroRepository } from "../infrastructure/repositories/pasajero.repository";

export class PasajeroController {
    private repository: PasajeroRepository

    constructor() {
        this.repository = new PasajeroRepository
    }

    private async validarBody(body: { nombre: string; apellido: string; email: string; telefono: string; nacionalidad: string; id_pasaporte: string;}){
        const dto = new PasajeroDto(body);
        const errores = await dto.validateDto();
        if (errores.length > 0) {
            return { ok: false, message: "El request tiene errores", error: errores };
        }
        return { ok: true }
    }

    async agregar(body: { nombre: string; apellido: string; email: string; telefono: string; nacionalidad: string; id_pasaporte: string;}) {
        try {
            
            const validarBody = await this.validarBody(body)
            if (!validarBody.ok) { return validarBody}
            
            //Validar si ya existe un pasajero con ese mismo correo
            const validarCorreo = await this.repository.obtenerPorCriterio(body.nombre, body.email)
            if (validarCorreo.length != 0 ) {  return { ok: false, message: 'El pasajero ya existe' } }
            
            const entity = new PasajeroEntity(body)
            const resultado = await this.repository.agregar(entity)
            console.log('resultado', resultado);
            
            if (resultado) {
                return { 
                    ok: true,
                    info: {
                        id_pasajero: resultado.id_pasajero,
                        nombre: resultado.nombre
                    }
                };
            }
            else {
                return { ok: false, message: "El pasajero no se ha agregado correctamente" };
            }
        } catch (error) {
            throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    // Listar todos los Pasajeros
    async obtener() {
        try {
          const resultado = await this.repository.obtener()
          if (resultado.length == 0) {
            return { ok: true, message: "No hay pasajeros" };
          } else {
            return { ok: true, info: resultado };
          }
        } catch (error) {
          throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    // Obtener pasajero por medio de un criterio
    async obtenerPorCriterio(body: {nombre: string, email: string}) {
        try {
            const resultado = await this.repository.obtenerPorCriterio(body.nombre, body.email)
            if (resultado.length == 0) {
                return { ok: false, message: "No hay pasajeros" };
            } else {
                return { ok: true, info: resultado };
            }
        } catch (error) {
            throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    //Metodo para eliminar un pasajero
    async eliminar(id: number) {
        try {
            const resultado = await this.repository.eliminar(id)
            if (resultado !== null) {
                return {ok: true, message: "Pasajero eliminado exitosamente"}
            } else {
                return {ok: false, message: "El pasajero no existe"}
            }
        } catch (error) {
            throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    async actualizar(body: { nombre: string; apellido: string; email: string; telefono: string; nacionalidad: string; id_pasaporte: string;}) {
        try {
            const validBody = await this.validarBody(body)
            if (!validBody.ok) { return validBody }// validBody.ok === false
            const resultado = await this.repository.actualizar(new PasajeroEntity(body));
            
            if (resultado) {
              return { ok: true, info: resultado };
            } else {
              return { ok: false, message: "El pasajero no se ha agregado correctamente" };
            }
          } catch (error: any) {
            throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    //Obtener información de un pasajero específico
    async obtenerPorId(id: number) {
        try {
          const resultado = await this.repository.obtenerPorId(id)
          if (resultado !== null) {
            return { ok: true, info: resultado };
          } else {
            return { ok: false, message: "El pasajero no existe" };
          }
        } catch (error) {
          throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    async obtenerReserva() {
        //Integrar api reservas
    }
}