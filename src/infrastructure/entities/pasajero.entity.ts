import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm"
import { pasajeroReservaEntity } from "./pasajero_reserva.entity"
import { TicketsEntity } from "./tickets.entity"

@Entity("pasajero")
export class PasajeroEntity {

    @PrimaryGeneratedColumn()
    id_pasajero! : number 

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column()
    email: string

    @Column()
    telefono: string

    @Column()
    nacionalidad: string
    
    @Column()
    id_pasaporte: string

    @OneToMany(() => pasajeroReservaEntity, (reserva) => reserva.pasajero)
    pasajerosReserva?: pasajeroReservaEntity; 
    
    @OneToOne(() => TicketsEntity, (ticket) => ticket.pasajero)
    ticket?: TicketsEntity; 

    constructor(body: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        nacionalidad: string; 
        id_pasaporte: string; 
    }) {
        this.nombre = body?.nombre;
        this.apellido = body?.apellido;
        this.email = body?.email;
        this.telefono = body?.telefono;
        this.nacionalidad = body?.nacionalidad;
        this.id_pasaporte = body?.id_pasaporte;
    }
}