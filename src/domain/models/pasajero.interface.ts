import { PasajeroReserva } from "./pasajero_reserva.interface";
import { Ticket } from "./ticket.interface";

export interface Pasajero {
  id_pasajero: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  id_pasaporte: string;
  reservas?: PasajeroReserva;
  ticket?: Ticket;
}
