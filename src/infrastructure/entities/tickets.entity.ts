import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, OneToOne, JoinColumn,  CreateDateColumn, OneToMany } from "typeorm";
import { ReservaEntity} from "./reserva.entity";
import { PasajeroEntity} from "./pasajero.entity";
import { VueloEntity } from "./vuelos.entity";

@Entity("tickets")
export class TicketsEntity {
  
  @PrimaryGeneratedColumn()
  id_ticket!: number ; 

  @Column({ name: "id_reserva", type: "int"})
  id_reserva!: number;

  @Column({ name: "id_vuelo", type: "varchar"})
  id_vuelo!: string;

  @Column({ name: "id_pasajero", type: "int"})
  id_pasajero!: number;

  @CreateDateColumn({ name: "fecha_emision", type: "datetime" })
  fecha_emision?: Date;

  @Column({ name: "estado_ticket", type: "enum", enum: ["emitido", "check-in", "abordado", "finalizado", "cancelado"] })
  estado_ticket?: string;

 
  @ManyToOne(() => ReservaEntity, (reserva) => reserva.id_reserva)
  @JoinColumn({ name: "id_reserva" })
  reserva?: ReservaEntity;

  @ManyToOne(() => VueloEntity, (vuelo) => vuelo.id_vuelo)
  @JoinColumn({ name: "id_vuelo" })
  vuelo!: VueloEntity;

  @OneToOne(() => PasajeroEntity, (pasajero) => pasajero.id_pasajero,)
  @JoinColumn({ name: "id_pasajero" })
  pasajero?: PasajeroEntity;
}
