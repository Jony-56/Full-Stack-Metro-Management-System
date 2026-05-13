import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RouteStopDto {
  @IsNumber()
  stationId: number;

  @IsNumber()
  stopOrder: number;

  @IsOptional()
  @IsNumber()
  distanceFromStart?: number;
}

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  sourceStationId: number;

  @IsNumber()
  destinationStationId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopDto)
  stops: RouteStopDto[];
}