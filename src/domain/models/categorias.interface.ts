import { Asiento } from "./asientos.interface";

export interface Categoria {
  id_categoria: number;
  nombre_categoria?: string;
  precio_base?: number;
  asientos?: Asiento[];
}