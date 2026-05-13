import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { User } from '../users/entities/user.entity';
import { Route } from '../routes/route.entity';
import { Train } from '../trains/train.entity';
import { Station } from '../stations/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Route, Train, Station]),
    JwtModule.register({
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}