import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, ManyToOne } from "typeorm";
import { ReservaEntity } from "./reserva.entity";

@Entity("vuelos")
@Unique(["cod_vuelo"])
export class VueloEntity {
  
  @PrimaryGeneratedColumn()
  id_vuelo: number = 0 ;

  @Column()
  cod_vuelo!: string;

  @Column()
  aerolinea?: string;

  @Column()
  origen_aeropuerto?: string;

  @Column()
  destino_aeropuerto?: string;

  @Column()
  fecha_salida?: Date;

  @Column()
  fecha_llegada?: Date;

  @Column()
    duracion?: number;

  @Column()
    total_asientos!: number;

  @Column()
    asientos_disponibles!: number;

  @Column()
    estado_vuelo?: string;

  @Column()
    precio_base_vuelo?: number;
  // @OneToMany(() => Asiento, (asiento) => asiento.asientos)
  // asientos: AsientoEntity = {} as Asiento;

  // @ManyToOne(() => VueloEntity, (vuelo) => vuelo.id_vuelo)
  // @Column({ name: "cod_vuelo" })
  // vuelo?: VueloEntity;

  // @OneToMany(() => TicketsEntity, (ticket) => ticket.vuelo)
  // tickets!: TicketsEntity[];
  @OneToMany(() => ReservaEntity, reserva => reserva.vuelo)
  reservas!: ReservaEntity[];

}
