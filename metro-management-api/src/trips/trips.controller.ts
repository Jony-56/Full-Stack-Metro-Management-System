import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(
    private tripsService: TripsService,
    private jwtService: JwtService,
  ) {}

  private getUserFromToken(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verify(token);
  }

  @Get('my')
  findMyTrips(@Headers('authorization') authHeader: string) {
    const user = this.getUserFromToken(authHeader);

    if (user.role !== 'passenger') {
      throw new UnauthorizedException('Only passenger can view trip history');
    }

    return this.tripsService.findMyTrips(user.id);
  }
}