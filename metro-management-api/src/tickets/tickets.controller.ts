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

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private ticketsService: TicketsService,
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

@Patch(':id/status')
updateStatus(
  @Param('id') id: string,
  @Body() body: UpdateTicketStatusDto,
  @Headers('authorization') authHeader: string,
) {
  this.checkAdmin(authHeader);
  return this.ticketsService.updateStatus(Number(id), body.status);
}

  private getUserFromToken(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verify(token);
  }

  @Post()
  create(
    @Body() body: CreateTicketDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);

    if (user.role !== 'passenger') {
      throw new UnauthorizedException('Only passenger can book ticket');
    }

    return this.ticketsService.create(user.id, body);
  }

  @Get('my')
  findMyTickets(@Headers('authorization') authHeader: string) {
    const user = this.getUserFromToken(authHeader);
    return this.ticketsService.findMyTickets(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(Number(id));
  }

  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.ticketsService.cancel(Number(id), user.id);
  }
}