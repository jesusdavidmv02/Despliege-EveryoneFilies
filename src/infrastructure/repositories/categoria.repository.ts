import { CategoriaEntity } from "../entities/categorias.entity";
import { AppDataSourceMysql } from "../db/source.orm";

export class CategoriaRepository {

  private categoriaRepo = AppDataSourceMysql.getRepository(CategoriaEntity);

  // Obtener todas las categorías
  async obtenerCategorias() {
    return this.categoriaRepo.find(); // Obtener todas las categorías
  }

  // Obtener una categoría por su id
  async obtenerCategoriaPorId(idCategoria: number) {
    const categoria = await this.categoriaRepo.findOneBy({ id_categoria: idCategoria });
    return categoria != null ? categoria : null;
  }

  // Agregar una nueva categoría
  async agregarCategoria(datos: CategoriaEntity) {
    const categoria = this.categoriaRepo.create(datos);
    const categoriaExistente = await this.categoriaRepo.findOneBy({ nombre_categoria: datos.nombre_categoria });
    if (categoriaExistente) {
      return null; // Retorna null si el nombre de categoría ya existe
    } else {
      return this.categoriaRepo.save(categoria);
    }
  }

  // Actualizar una categoría existente
  async actualizarCategoria(datos: CategoriaEntity) {
    const result = await this.categoriaRepo.update(datos.id_categoria, {
      nombre_categoria: datos.nombre_categoria,
      porcentaje_categoria: datos.porcentaje_categoria,
    });

    if (result.affected && result.affected > 0) {
      return result;
    } else {
      return false;
    }
  }

  // Eliminar una categoría por su id
  async eliminarCategoria(idCategoria: number) {
    const categoria = await this.categoriaRepo.findOneBy({ id_categoria: idCategoria });
    if (categoria) {
      await this.categoriaRepo.remove(categoria);
      return categoria;
    } else {
      console.log('Categoría no encontrada');
      return null;
    }
  }

  // Obtener categoría por su ombre
  async obtenerCategoriaPorNombre(nombre_categoria: string) {
    
    const categoria = await this.categoriaRepo.findOneBy({ nombre_categoria: nombre_categoria });
    
    return categoria;
  }
}
