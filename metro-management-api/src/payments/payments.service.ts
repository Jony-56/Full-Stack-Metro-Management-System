import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from './payment.entity';
import { Ticket, TicketStatus } from '../tickets/ticket.entity';
import { User } from '../users/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(userId: number, data: CreatePaymentDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ticket = await this.ticketRepo.findOne({
      where: { id: data.ticketId },
      relations: ['user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.user.id !== userId) {
      throw new UnauthorizedException('You can pay only for your own ticket');
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for cancelled ticket');
    }

    if (data.amount !== ticket.totalFare) {
      throw new BadRequestException('Payment amount must match ticket fare');
    }

    const oldPayment = await this.paymentRepo.findOne({
      where: { ticket: { id: data.ticketId } },
      relations: ['ticket'],
    });

    if (oldPayment) {
      throw new BadRequestException('Payment already exists for this ticket');
    }

    const oldTransaction = await this.paymentRepo.findOne({
      where: { transactionId: data.transactionId },
    });

    if (oldTransaction) {
      throw new BadRequestException('Transaction ID already exists');
    }

    const payment = this.paymentRepo.create({
      ticket,
      user,
      amount: data.amount,
      method: data.method,
      transactionId: data.transactionId,
      status: PaymentStatus.SUCCESS,
      paidAt: new Date(),
    });

    const savedPayment = await this.paymentRepo.save(payment);

await this.mailService.sendPaymentSuccess(user.email, {
  fullName: user.fullName,
  ticketId: ticket.id,
  amount: savedPayment.amount,
  method: savedPayment.method,
  transactionId: savedPayment.transactionId,
  status: savedPayment.status,
});

return savedPayment;
  }

  findMyPayments(userId: number) {
    return this.paymentRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['ticket', 'user'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['ticket', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}