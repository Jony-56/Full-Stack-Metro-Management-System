import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';

@Controller('stations')
export class StationsController {
  constructor(
    private stationsService: StationsService,
    private jwtService: JwtService,
  ) {}

  @Post()
  create(
    @Body() body: CreateStationDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const user = this.jwtService.verify(token);

      if (user.role !== 'admin') {
        throw new UnauthorizedException('Only admin can create station');
      }

      return this.stationsService.create(body);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(Number(id));
  }
}