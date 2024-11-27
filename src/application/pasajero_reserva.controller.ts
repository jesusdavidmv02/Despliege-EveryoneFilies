import { pasajeroReservaDto } from "../infrastructure/dto/pasajero_reserva.dto";
import { pasajeroReservaEntity } from "../infrastructure/entities/pasajero_reserva.entity";
import { PasajeroReservaRepository } from "../infrastructure/repositories/pasajero_reserva.repository";

export class PasajeroReservaController {
    private repository: PasajeroReservaRepository

    constructor() {
        this.repository = new PasajeroReservaRepository
    }

    private async validarBody(body: { id_reserva: number; id_asiento: number}){
        const dto = new pasajeroReservaDto(body);
        const errores = await dto.validateDto();
        if (errores.length > 0) {
            return { ok: false, message: "El request tiene errores", error: errores };
        }
        return { ok: true }
    }

    async agregar(body: {id_asiento: number, id_reserva: number, id_pasajero: number}) {
        try {
            const validarBody = await this.validarBody(body)
        } catch (error) {
        }
    }

    //Obtener información de una reserva en específico
    async obtenerPorId(id: number) {
        try {
          const resultado = await this.repository.obtenerPorId(id)
          if (resultado !== null) {
            return { ok: true, info: resultado };
          } else {
            return { ok: false, message: "La reserva no existe" };
          }
        } catch (error) {
          throw { ok: false, message: "Ha ocurrido un error inesperado", error };
        }
    }

    async actualizar() {
        try {
            
          } catch (error: any) {
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

    // Obtener pasajero por medio de un criterio
    async obtenerPorCriterio(nombre: string, email: string) {
        try {
            const resultado = await this.repository.obtenerPorCriterio(nombre, email)
            if (resultado.length == 0) {
                return { ok: false, message: "No hay pasajeros" };
            } else {
                return { ok: true, info: resultado };
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

    async obtenerReserva() {
        //Integrar api reservas
    }
}