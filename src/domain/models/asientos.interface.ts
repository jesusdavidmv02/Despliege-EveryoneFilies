import { Vuelo } from "./vuelo.interface";
import { PrecioTemporal } from "./precios_temporales.interface";
// import { Categoria } from "./categorias.interface";

export interface Asiento {
  id_asiento: number;
  cod_vuelo?: string; // Código del vuelo asociado
  vuelo?: Vuelo; // Relación con la entidad Vuelo
  disponible?: boolean; // Disponibilidad del asiento
  numero_asiento?: string; // Número del asiento
  id_precio_temporal?: number; // Clave foránea al precio temporal
  precio_temporal?: PrecioTemporal; // Relación con el precio temporal
  id_categoria_asiento?: number; // Clave foránea a la categoría
}
