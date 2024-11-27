import { PreciosTemporalesEntity } from "../infrastructure/entities/precios_temporales.entity";
import { PrecioTemporalesRepository } from "../infrastructure/repositories/precio_temporales.repository";
import { VueloRepository } from "../infrastructure/repositories/vuelo.repository";

export class PreciosTemporalesController {

  private repository: PrecioTemporalesRepository ;

  constructor() {
    this.repository = new PrecioTemporalesRepository();
  }

  async agregar( PrecioTemporales : PreciosTemporalesEntity ) { 
    const result  =  await this.repository.crear(PrecioTemporales);
    if (result  != null) {
        return { ok: true, Resultado: result };
      } else {
        return { ok: false, messaje : "Error en envio " };
      }   
  }
    
  
  async obtener() {
    const result = await this.repository.obtenerTodos();
    return result ;
  }


  async actualizar(PrecioTemporales : PreciosTemporalesEntity) {
    const result  =  await this.repository.actualizar(PrecioTemporales);
    if (result  != null) {
      return { ok: true, id: result };
    } else {
      return { ok: false, id: result };
    }
  }

  async obtenerPorId(id: number) {
    try {
      const result = await this.repository.obtenerPorId(id);
      if (result) {
        return result
      } else {
        return "El ID del PrecioTemporales no esta : no se encuentra en la base de datos";
      }
    } catch (error) {
      console.log("Ha ocurrido un error al consultando.");
      return error;
    }
  }

  async eliminar(id: number) {
    const result = await this.repository.eliminar(id);
    return  result
  }
  
  }






 



