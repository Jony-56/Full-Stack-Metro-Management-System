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

import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Controller('trains')
export class TrainsController {
  constructor(
    private trainsService: TrainsService,
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
    @Body() body: CreateTrainDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.trainsService.create(body);
  }

  @Get()
  findAll() {
    return this.trainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateTrainDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.trainsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.trainsService.remove(Number(id));
  }
}