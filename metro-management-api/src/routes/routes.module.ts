import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route } from './route.entity';
import { RouteStation } from './route-station.entity';
import { Station } from '../stations/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, RouteStation, Station]),
    JwtModule.register({
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}