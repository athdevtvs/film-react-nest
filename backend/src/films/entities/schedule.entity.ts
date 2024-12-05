import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Films } from './film.entity';
import {
  IsNumber,
  IsString,
  IsPositive,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  daytime: string;

  @Column({ type: 'int' })
  @IsString()
  filmId: string;

  @Column({ type: 'int' })
  @IsNumber()
  @IsPositive()
  hall: number;

  @Column({ type: 'int' })
  @IsString()
  @Min(1)
  @Max(100)
  rows: number;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  @Max(500)
  seats: number;

  @Column({ type: 'float' })
  @IsNumber()
  @IsPositive()
  price: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  taken: string;

  @ManyToOne(() => Films, (film) => film.schedule)
  film: Films;
}
