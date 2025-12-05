import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  sportId: string;

  @IsUUID()
  @IsOptional()
  venueId?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  timeStart: string; // HH:MM

  @IsString()
  @IsNotEmpty()
  timeEnd: string; // HH:MM

  @IsString()
  @IsNotEmpty()
  placeName: string;

  @IsEnum(['reserved', 'to_be_arranged'])
  reservationType: 'reserved' | 'to_be_arranged';

  @IsInt()
  @Min(1)
  playerCountTotal: number;

  @IsInt()
  @Min(1)
  @Max(4)
  skillMin: number;

  @IsInt()
  @Min(1)
  @Max(4)
  skillMax: number;

  @IsString()
  @IsOptional()
  description?: string;
}


