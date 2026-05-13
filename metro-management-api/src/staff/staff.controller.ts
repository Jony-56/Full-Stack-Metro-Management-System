import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { StaffService } from './staff.service';
import { TicketStatus } from '../tickets/ticket.entity';

@Controller('staff')
export class StaffController {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  private checkStaffOrAdmin(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = this.jwtService.verify(token);

    if (user.role !== 'staff' && user.role !== 'admin') {
      throw new UnauthorizedException('Only staff or admin can access this');
    }

    return user;
  }

  @Get('dashboard')
  getDashboard(@Headers('authorization') authHeader: string) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.getDashboard();
  }

  @Get('tickets')
  findAllTickets(@Headers('authorization') authHeader: string) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.findAllTickets();
  }

  @Get('tickets/:id')
  findSingleTicket(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.findSingleTicket(Number(id));
  }

  @Patch('tickets/:id/status')
  updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.updateTicketStatus(Number(id), status);
  }

  @Get('payments')
  findAllPayments(@Headers('authorization') authHeader: string) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.findAllPayments();
  }

  @Get('payments/:id')
  findSinglePayment(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkStaffOrAdmin(authHeader);
    return this.staffService.findSinglePayment(Number(id));
  }
}