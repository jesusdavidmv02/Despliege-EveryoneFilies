import { Reserva } from "./reserva.interface";
import { Vuelo } from "./vuelo.interface";
import { Pasajero } from "./pasajero.interface";

export interface Ticket {
  id_ticket: number;
  id_reserva: number;
  cod_vuelo: string;
  id_pasajero: number;
  fecha_emision?: Date;
  estado_ticket?: "emitido" | "check-in" | "abordado" | "finalizado" | "cancelado";
  reserva?: Reserva;
  vuelo: Vuelo;
  pasajero?: Pasajero;
}
