import { Reserva } from "./reserva.interface";
import { Pasajero } from "./pasajero.interface";
import { Asiento } from "./asientos.interface";

export interface PasajeroReserva {
  id_pasajero_reserva: number;
  id_asiento?: number;
  id_reserva?: number;
  id_pasajero?: number;
  precio_subtotal?:number;
  reserva?: Reserva;
  pasajero?: Pasajero;
  asinto?: Asiento;
}