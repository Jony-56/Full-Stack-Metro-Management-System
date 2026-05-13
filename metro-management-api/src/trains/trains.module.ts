import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Train } from './train.entity';
import { Route } from '../routes/route.entity';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Train, Route]),
    JwtModule.register({
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TrainsController],
  providers: [TrainsService],
})
export class TrainsModule {}