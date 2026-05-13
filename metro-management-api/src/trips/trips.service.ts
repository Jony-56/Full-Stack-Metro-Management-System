import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket, TicketStatus } from '../tickets/ticket.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  findMyTrips(userId: number) {
    return this.ticketRepo.find({
      where: {
        user: {
          id: userId,
        },
        status: TicketStatus.COMPLETED,
      },
      relations: [
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
}