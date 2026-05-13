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

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
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
    @Body() body: CreatePaymentDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.paymentsService.create(user.id, body);
  }

  @Get('my')
  findMyPayments(@Headers('authorization') authHeader: string) {
    const user = this.getUserFromToken(authHeader);
    return this.paymentsService.findMyPayments(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(Number(id));
  }
}