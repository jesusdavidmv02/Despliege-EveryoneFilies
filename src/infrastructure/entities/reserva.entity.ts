import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { VueloEntity } from "./vuelos.entity";
import { pasajeroReservaEntity } from "./pasajero_reserva.entity";
import { AsientoEntity } from "./asientos.entity";


@Entity("reserva")
export class ReservaEntity {
  
  @PrimaryGeneratedColumn({ name: "id_reserva" })
  id_reserva!: number;

  @Column()
  id_vuelo?: string;

  @CreateDateColumn({ name: "fecha_reserva", type: "datetime" })
  fecha_reserva?: Date;

  @Column({ name: "estado_reserva", type: "varchar", length: 100, default: "Disponible"})
  estado_reserva?: string;

  @Column({ name: "cantidad_pasajeros", type: "int" })
  cantidad_pasajeros!: number;

  @Column({ name: "precio_total", type: "int" })
  precio_total?: number;

  @ManyToOne(() => VueloEntity, vuelo => vuelo.reservas)
  @JoinColumn({ name: 'id_vuelo', referencedColumnName: 'id_vuelo' }) // Referencia la columna 'cod_vuelo' en Vuelo
  vuelo!: VueloEntity;

  @OneToMany(() => pasajeroReservaEntity, pasajeroReservas => pasajeroReservas.reserva)
  pasajeroReservas!: pasajeroReservaEntity[];
}

  