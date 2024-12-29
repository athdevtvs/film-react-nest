import { Document } from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';

const RequiredStringProp = () => {
  return Prop({ required: true });
};

const RequiredNumberProp = () => {
  return Prop({ required: true, type: Number });
};

const RequiredArrayProp = <T>(type: T, defaultValue: T[] = []) => {
  return Prop({ type: [type], default: defaultValue });
};

@Schema()
export class Schedule {
  @RequiredStringProp()
  @IsString()
  id: string;

  @RequiredStringProp()
  @IsString()
  daytime: string;

  @RequiredNumberProp()
  @IsInt()
  @Min(1)
  hall: number;

  @RequiredNumberProp()
  @IsInt()
  @Min(1)
  rows: number;

  @RequiredNumberProp()
  @IsInt()
  @Min(1)
  seats: number;

  @RequiredNumberProp()
  @IsNumber()
  @Min(0)
  price: number;

  @RequiredArrayProp(String)
  @IsArray()
  @ArrayNotEmpty()
  taken: string | string[];
}

const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Film extends Document {
  @RequiredStringProp()
  @IsString()
  id: string;

  @RequiredStringProp()
  @IsString()
  title: string;

  @RequiredStringProp()
  @IsString()
  director: string;

  @RequiredNumberProp()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @RequiredArrayProp(String)
  @IsArray()
  tags: string[];

  @RequiredStringProp()
  @IsString()
  image: string;

  @RequiredStringProp()
  @IsString()
  cover: string;

  @RequiredStringProp()
  @IsString()
  about: string;

  @RequiredStringProp()
  @IsString()
  description: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
