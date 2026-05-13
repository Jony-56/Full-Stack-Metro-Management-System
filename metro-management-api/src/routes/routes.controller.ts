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

import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(
    private routesService: RoutesService,
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
    @Body() body: CreateRouteDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.routesService.create(body);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRouteDto,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.routesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.routesService.remove(Number(id));
  }
}