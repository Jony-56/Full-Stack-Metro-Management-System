import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket, TicketStatus } from './ticket.entity';
import { User } from '../users/entities/user.entity';
import { Route } from '../routes/route.entity';
import { Train, TrainStatus } from '../trains/train.entity';
import { Station } from '../stations/station.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepo: Repository<Ticket>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Route)
        private routeRepo: Repository<Route>,

        @InjectRepository(Train)
        private trainRepo: Repository<Train>,

        @InjectRepository(Station)
        private stationRepo: Repository<Station>,
        private mailService: MailService,
    ) { }

    async create(userId: number, data: CreateTicketDto) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const route = await this.routeRepo.findOne({
            where: { id: data.routeId },
        });

        if (!route || !route.isActive) {
            throw new BadRequestException('Active route not found');
        }

        const train = await this.trainRepo.findOne({
            where: { id: data.trainId },
        });

        if (!train || !train.isActive || train.status !== TrainStatus.ACTIVE) {
            throw new BadRequestException('Active train not found');
        }

        const sourceStation = await this.stationRepo.findOne({
            where: { id: data.sourceStationId },
        });

        const destinationStation = await this.stationRepo.findOne({
            where: { id: data.destinationStationId },
        });

        if (!sourceStation || !destinationStation) {
            throw new BadRequestException('Source or destination station not found');
        }

        if (data.seatCount <= 0) {
            throw new BadRequestException('Seat count must be greater than 0');
        }

        if (data.totalFare <= 0) {
            throw new BadRequestException('Total fare must be greater than 0');
        }

        const ticket = this.ticketRepo.create({
            user,
            route,
            train,
            sourceStation,
            destinationStation,
            journeyDate: data.journeyDate,
            seatCount: data.seatCount,
            totalFare: data.totalFare,
            status: TicketStatus.BOOKED,
        });
        const savedTicket = await this.ticketRepo.save(ticket);

        await this.mailService.sendTicketConfirmation(user.email, {
            fullName: user.fullName,
            routeName: route.name,
            trainNumber: train.trainNumber,
            journeyDate: savedTicket.journeyDate,
            seatCount: savedTicket.seatCount,
            totalFare: savedTicket.totalFare,
        });
        return savedTicket;
    }

    findMyTickets(userId: number) {
        return this.ticketRepo.find({
            where: {
                user: {
                    id: userId,
                },
            },
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

    async findOne(id: number) {
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

    async cancel(id: number, userId: number) {
        const ticket = await this.findOne(id);

        if (ticket.user.id !== userId) {
            throw new UnauthorizedException('You can cancel only your own ticket');
        }

        if (ticket.status === TicketStatus.CANCELLED) {
            throw new BadRequestException('Ticket already cancelled');
        }

        ticket.status = TicketStatus.CANCELLED;

        await this.ticketRepo.save(ticket);
        await this.mailService.sendTicketCancelled(ticket.user.email, {
            fullName: ticket.user.fullName,
            ticketId: ticket.id,
            journeyDate: ticket.journeyDate,
        });

        return {
            message: 'Ticket cancelled successfully',
            ticket,
        };

    }

    async updateStatus(id: number, status: TicketStatus) {
        const ticket = await this.findOne(id);

        if (ticket.status === TicketStatus.CANCELLED) {
            throw new BadRequestException('Cancelled ticket status cannot be changed');
        }

        ticket.status = status;

        await this.ticketRepo.save(ticket);

        return {
            message: 'Ticket status updated successfully',
            ticket,
        };
    }
}