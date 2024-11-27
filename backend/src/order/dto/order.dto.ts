import {
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetTicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsString()
  day: string;

  @IsString()
  time: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class PlaceTicketDto {
  @IsString()
  filmId: string;

  @IsString()
  sessionId: string;

  @IsString()
  seatsSelection: string;
}

class ContactsDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class CreateOrderDto extends ContactsDto {
  @IsString()
  @IsOptional()
  id?: string; // Необязательный, так как репозиторий генерирует его

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetTicketDto)
  tickets!: GetTicketDto[];

  get orderData(): PlaceTicketDto[] {
    return this.tickets.map(
      (ticket) =>
        ({
          filmId: ticket.film,
          sessionId: ticket.session,
          seatsSelection: `${ticket.row}:${ticket.seat}`,
        }) as PlaceTicketDto,
    );
  }
}
