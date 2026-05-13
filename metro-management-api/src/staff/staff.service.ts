import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket, TicketStatus } from '../tickets/ticket.entity';
import { Payment } from '../payments/payment.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getDashboard() {
    const totalTickets = await this.ticketRepo.count();
    const bookedTickets = await this.ticketRepo.count({
      where: { status: TicketStatus.BOOKED },
    });
    const cancelledTickets = await this.ticketRepo.count({
      where: { status: TicketStatus.CANCELLED },
    });
    const completedTickets = await this.ticketRepo.count({
      where: { status: TicketStatus.COMPLETED },
    });

    const totalPayments = await this.paymentRepo.count();

    const totalPassengers = await this.userRepo.count({
      where: { role: UserRole.PASSENGER },
    });

    return {
      totalTickets,
      bookedTickets,
      cancelledTickets,
      completedTickets,
      totalPayments,
      totalPassengers,
    };
  }

  findAllTickets() {
    return this.ticketRepo.find({
      relations: [
        'user',
        'route',
        'train',
        'sourceStation',
        'destinationStation',
      ],
      order: {
        id: 'DESC',
      },
    });
  }

  async findSingleTicket(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: [
        'user',
        'route',
        'train',
        'sourceStation',
        'destinationStation',
      ],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async updateTicketStatus(id: number, status: TicketStatus) {
    const ticket = await this.findSingleTicket(id);

    if (!Object.values(TicketStatus).includes(status)) {
      throw new BadRequestException('Invalid ticket status');
    }

    ticket.status = status;

    await this.ticketRepo.save(ticket);

    return {
      message: 'Ticket status updated successfully',
      ticket,
    };
  }

  findAllPayments() {
    return this.paymentRepo.find({
      relations: ['ticket', 'user'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findSinglePayment(id: number) {
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