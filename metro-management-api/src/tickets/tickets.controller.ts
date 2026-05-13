import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private ticketsService: TicketsService,
    private jwtService: JwtService,
  ) {}

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