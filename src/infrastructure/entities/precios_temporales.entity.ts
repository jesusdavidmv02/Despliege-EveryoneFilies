import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("precios_temporales")
export class PreciosTemporalesEntity  {

  @PrimaryGeneratedColumn()
  id_temporada: number = 0;

  @Column()
  temporada?: string;

  @Column()
  demanda?: string;

  @Column()
  disponibilidad?: string;

  @Column()
  porcentaje_temporal?: number;
}
