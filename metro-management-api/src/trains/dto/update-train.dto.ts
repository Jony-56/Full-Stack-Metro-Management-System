import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TrainStatus } from '../train.entity';

export class UpdateTrainDto {
  @IsOptional()
  @IsString()
  trainNumber?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  routeId?: number;

  @IsOptional()
  @IsEnum(TrainStatus)
  status?: TrainStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}