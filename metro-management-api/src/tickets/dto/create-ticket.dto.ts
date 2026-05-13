import { IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  routeId: number;

  @IsNumber()
  trainId: number;

  @IsNumber()
  sourceStationId: number;

  @IsNumber()
  destinationStationId: number;

  @IsString()
  journeyDate: string;

  @IsNumber()
  seatCount: number;

  @IsNumber()
  totalFare: number;
}