import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrainDto {
  @IsString()
  @IsNotEmpty()
  trainNumber: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  routeId: number;
}