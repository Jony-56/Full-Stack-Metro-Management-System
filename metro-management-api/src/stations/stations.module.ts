import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Station } from './station.entity';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),

    JwtModule.register({
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}