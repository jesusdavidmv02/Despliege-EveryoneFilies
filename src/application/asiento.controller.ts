import { AsientoEntity } from "../infrastructure/entities/asientos.entity";
import { AsientoRepository } from "../infrastructure/repositories/asiento.repository";

export class AsientoController {

  private repository: AsientoRepository;

  constructor() {
    this.repository = new AsientoRepository();
  }

  async agregar(asiento: AsientoEntity) {
    const result = await this.repository.agregarAsiento(asiento);
    if (result != null) {
      return { ok: true, id: asiento.id_asiento };
    } else {
      return { ok: false, message: "Error al agregar el asiento // El vuelo o la categoría no existen" };
    }
  }

  async obtener() {
    const result = await this.repository.obtenerAsientos();
    return result;
  }

  async obtenerPorId(id: number) {
    try {
      const result = await this.repository.obtenerAsientoPorId(id);
      if (result) {
        return result;
      } else {
        return "El ID del asiento no está en la base de datos";
      }
    } catch (error) {
      console.log("Ha ocurrido un error al consultar el asiento.");
      return error;
    }
  }

  async actualizar(asiento: AsientoEntity) {
    const result = await this.repository.actualizarAsiento(asiento);
    if (result != null) {
      return { ok: true, id: result };
    } else {
      return { ok: false, message: "No se pudo actualizar el asiento" };
    }
  }

  async eliminar(id: number) {
    const result = await this.repository.eliminarAsiento(id);
    return result;
  }
}
