import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Ticket } from '../tickets/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    JwtModule.register({
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}