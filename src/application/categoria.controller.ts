import { CategoriaEntity } from "../infrastructure/entities/categorias.entity";
import { CategoriaRepository } from "../infrastructure/repositories/categoria.repository";

export class CategoriaController {

  private repository: CategoriaRepository;

  constructor() {
    this.repository = new CategoriaRepository();
  }

  // Agregar una nueva categoría
  async agregar(categoria: CategoriaEntity) {
    const result = await this.repository.agregarCategoria(categoria);
    if (result != null) {
      return { ok: true, id: result };
    } else {
      return { ok: false, mensaje: "Error: el nombre de la categoría ya está en uso." };
    }
  }

  // Obtener todas las categorías
  async obtener() {
    const result = await this.repository.obtenerCategorias();
    return result;
  }

  // Obtener una categoría por su ID
  async obtenerPorId(id: number) {
    try {
      const result = await this.repository.obtenerCategoriaPorId(id);
      if (result) {
        return result;
      } else {
        return "El ID de la categoría no existe en la base de datos.";
      }
    } catch (error) {
      console.log("Ha ocurrido un error al consultar la categoría.");
      return error;
    }
  }

  // Actualizar una categoría existente
  async actualizar(categoria: CategoriaEntity) {
    const result = await this.repository.actualizarCategoria(categoria);
    if (result != null) {
      return { ok: true, id: categoria.id_categoria };
    } else {
      return { ok: false, mensaje: "No se pudo actualizar la categoría." };
    }
  }

  // Eliminar una categoría por su ID
  async eliminar(id: number) {
    const result = await this.repository.eliminarCategoria(id);
    if (result != null) {
      return { ok: true, mensaje: "Categoría eliminada con éxito." };
    } else {
      return { ok: false, mensaje: "No se encontró la categoría para eliminar." };
    }
  }
}
