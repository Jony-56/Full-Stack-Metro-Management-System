import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Route } from '../routes/route.entity';
import { Train } from '../trains/train.entity';
import { Station } from '../stations/station.entity';

export enum TicketStatus {
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Route)
  route: Route;

  @ManyToOne(() => Train)
  train: Train;

  @ManyToOne(() => Station)
  sourceStation: Station;

  @ManyToOne(() => Station)
  destinationStation: Station;

  @Column()
  journeyDate: string;

  @Column()
  seatCount: number;

  @Column()
  totalFare: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.BOOKED,
  })
  status: TicketStatus;
}