import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn  } from "typeorm";
import { PasajeroEntity } from "./pasajero.entity";
import { ReservaEntity } from "./reserva.entity";
import { AsientoEntity } from "./asientos.entity";

@Entity("pasajero_reserva")
export class pasajeroReservaEntity {

    @PrimaryGeneratedColumn()
    id_pasajero_reserva!: number

    @Column({ name: "id_asiento", type: "int"})
    id_asiento?: number
    
    @Column({ name: "id_reserva", type: "int"})
    id_reserva?: number
    
    @Column({ name: "id_pasajero", type: "int"})
    id_pasajero?: number

    @Column({name: "precio_subtotal", type: "int"})
    precio_subtotal?:number
    
    @ManyToOne(() => ReservaEntity, reserva => reserva.pasajeroReservas)
    @JoinColumn({ name: 'id_reserva', referencedColumnName: 'id_reserva' }) // Relación con Reserva
    reserva!: ReservaEntity;

    @ManyToOne(() => PasajeroEntity, (pasajero) => pasajero.id_pasajero)
    @JoinColumn({name: "id_pasajero"})
    pasajero?: PasajeroEntity;
    
    @ManyToOne(() => AsientoEntity, (asinto) => asinto.id_asiento)
    @JoinColumn({name: "id_asiento"})
    asiento?: AsientoEntity;
}