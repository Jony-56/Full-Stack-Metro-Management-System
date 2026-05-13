import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Controller('stations')
export class StationsController {
  constructor(
    private stationsService: StationsService,
    private jwtService: JwtService,
  ) {}

  private checkAdmin(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = this.jwtService.verify(token);

    if (user.role !== 'admin') {
      throw new UnauthorizedException('Only admin can perform this action');
    }

    return user;
  }

  @Post()
  create(
    @Body() body: CreateStationDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.stationsService.create(body);
  }

  @Get()
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateStationDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.stationsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.stationsService.remove(Number(id));
  }
}