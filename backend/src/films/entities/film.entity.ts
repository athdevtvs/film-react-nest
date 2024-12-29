import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsArray } from 'class-validator';
import { Schedules } from './schedule.entity';

@Entity()
export class Films {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  director: string;

  @Column({ type: 'float', default: 0 })
  @IsNumber()
  rating: number;

  @Column('text', { array: true, default: [] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  cover: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  about: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  description: string;

  @OneToMany(() => Schedules, (schedule) => schedule.film, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  schedule: Schedules[];
}
