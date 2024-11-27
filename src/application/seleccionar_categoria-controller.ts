import { CategoriaEntity } from "../infrastructure/entities/categorias.entity";
import { CategoriaRepository } from "../infrastructure/repositories/categoria.repository";
import { VueloRepository } from "../infrastructure/repositories/vuelo.repository";
import { AsientoRepository } from "../infrastructure/repositories/asiento.repository";
import { PrecioTemporalesRepository } from "../infrastructure/repositories/precio_temporales.repository";

export class SeleccionarCategoriaController {
    
    private vueloRepository: VueloRepository;
    private categoriaRepository:CategoriaRepository;
    private asientoRepository:AsientoRepository;
    private precioTemporalesRepository :PrecioTemporalesRepository ;


    constructor() {
        this.categoriaRepository = new CategoriaRepository();
        this.vueloRepository = new VueloRepository();
        this.asientoRepository = new AsientoRepository();
        this.precioTemporalesRepository = new PrecioTemporalesRepository();
      }
      

    async seleccionarCategoriaYCalcularPrecio(data: { id_vuelo: number, categoria: string }) {
        // Validar que el vuelo existe
        const vuelo = await this.vueloRepository.obtenerPorId(data.id_vuelo);

        if (!vuelo) {
            throw new Error("Vuelo no encontrado");
        }
    
        // Validar categoría
        const categoria = await this.categoriaRepository.obtenerCategoriaPorNombre(data.categoria);
        if (!categoria) {
            throw new Error("Categoría no encontrada");
        }
    
        // Buscar asientos disponibles en la categoría
        const asientosDisponibles = await this.asientoRepository.obtenerAsientosDisponiblesCategoria(vuelo.id_vuelo, categoria.id_categoria);
        const asientosCategoria = await this.asientoRepository.obtenerAsientosCategoria(vuelo.id_vuelo, categoria.id_categoria);
        if (asientosDisponibles.length === 0) {
            throw new Error("No hay asientos disponibles en esta categoría");
        }

        let precio;
    
        // Calcular el precio base con el porcentaje de la categoría
        if (vuelo?.precio_base_vuelo && categoria?.porcentaje_categoria) {
            precio = vuelo.precio_base_vuelo * (1 + categoria.porcentaje_categoria / 100);

            if (vuelo?.fecha_salida) {
                // Determinar porcentaje temporal basado en la fecha del vuelo
                const fecha = new Date(vuelo.fecha_salida);
                const mes = fecha.getMonth() + 1; // Enero = 0, ajustamos con +1
                const temporadaAlta = [3, 6, 7, 12].includes(mes);
                const disponibilidadBaja = vuelo.asientos_disponibles / vuelo.total_asientos < 0.5;
                const demandaAlta = asientosDisponibles.length / asientosCategoria.length < 0.5;
                console.log("asiento por categoria", asientosCategoria.length);
                console.log("asiento disponibles por categoria", asientosDisponibles.length);
                console.log("asientos disponibles en el avion", vuelo.asientos_disponibles);
                console.log("total de asientos en el avion", vuelo.total_asientos);

                 // Determinar las condiciones de la tabla de precios temporales
                const condicionesTemporales = {
                    temporada: temporadaAlta ? "alta" : "baja",
                    disponibilidad: disponibilidadBaja ? "baja" : "alta",
                    demanda: demandaAlta ? "alta" : "baja"
                };

                console.log('condicionesTemporales', condicionesTemporales);
                
                // Obtener el porcentaje temporal basado en las condiciones
                const precioTemporal = await this.precioTemporalesRepository.obtenerPorCondiciones(condicionesTemporales);
                console.log("PRECIOS TEMPORALES", precioTemporal);
                
                if (precioTemporal?.porcentaje_temporal) {
                    precio *= (1 + precioTemporal.porcentaje_temporal / 100);

                    return {
                        asientosDisponibles: asientosDisponibles.map(asiento => ({ id: asiento.id_asiento, numero: asiento.numero_asiento })),
                        precio
                    };
                }else{
                    throw new Error("No hay valores de precios temporales definidos");
                }

            }else{
                throw new Error("No hay fecha de salida definida");
            }
        }else{
            throw new Error("No hay valores definidos para calcular el valor del vuelo");
        } 
    }
}