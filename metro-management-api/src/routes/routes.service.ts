import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route } from './route.entity';
import { RouteStation } from './route-station.entity';
import { Station } from '../stations/station.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepo: Repository<Route>,

    @InjectRepository(RouteStation)
    private routeStationRepo: Repository<RouteStation>,

    @InjectRepository(Station)
    private stationRepo: Repository<Station>,
  ) {}

  async create(data: CreateRouteDto) {
    const sourceStation = await this.stationRepo.findOne({
      where: { id: data.sourceStationId },
    });

    const destinationStation = await this.stationRepo.findOne({
      where: { id: data.destinationStationId },
    });

    if (!sourceStation || !destinationStation) {
      throw new BadRequestException('Source or destination station not found');
    }

    const route = this.routeRepo.create({
      name: data.name,
      sourceStation,
      destinationStation,
    });

    const savedRoute = await this.routeRepo.save(route);

    for (const stop of data.stops) {
      const station = await this.stationRepo.findOne({
        where: { id: stop.stationId },
      });

      if (!station) {
        throw new BadRequestException(`Station id ${stop.stationId} not found`);
      }

      const routeStation = this.routeStationRepo.create({
        route: savedRoute,
        station,
        stopOrder: stop.stopOrder,
        distanceFromStart: stop.distanceFromStart,
      });

      await this.routeStationRepo.save(routeStation);
    }

    return this.findOne(savedRoute.id);
  }

  findAll() {
    return this.routeRepo.find({
      relations: [
        'sourceStation',
        'destinationStation',
        'routeStations',
        'routeStations.station',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const route = await this.routeRepo.findOne({
      where: { id },
      relations: [
        'sourceStation',
        'destinationStation',
        'routeStations',
        'routeStations.station',
      ],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    route.routeStations = route.routeStations.sort(
      (a, b) => a.stopOrder - b.stopOrder,
    );

    return route;
  }

  async update(id: number, data: UpdateRouteDto) {
    const route = await this.findOne(id);

    if (data.name) {
      route.name = data.name;
    }

    if (data.sourceStationId) {
      const sourceStation = await this.stationRepo.findOne({
        where: { id: data.sourceStationId },
      });

      if (!sourceStation) {
        throw new BadRequestException('Source station not found');
      }

      route.sourceStation = sourceStation;
    }

    if (data.destinationStationId) {
      const destinationStation = await this.stationRepo.findOne({
        where: { id: data.destinationStationId },
      });

      if (!destinationStation) {
        throw new BadRequestException('Destination station not found');
      }

      route.destinationStation = destinationStation;
    }

    if (data.isActive !== undefined) {
      route.isActive = data.isActive;
    }

    const updatedRoute = await this.routeRepo.save(route);

    if (data.stops) {
      await this.routeStationRepo
        .createQueryBuilder()
        .delete()
        .from(RouteStation)
        .where('"routeId" = :routeId', { routeId: id })
        .execute();

      for (const stop of data.stops) {
        const station = await this.stationRepo.findOne({
          where: { id: stop.stationId },
        });

        if (!station) {
          throw new BadRequestException(`Station id ${stop.stationId} not found`);
        }

        const routeStation = this.routeStationRepo.create({
          route: updatedRoute,
          station,
          stopOrder: stop.stopOrder,
          distanceFromStart: stop.distanceFromStart,
        });

        await this.routeStationRepo.save(routeStation);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const route = await this.findOne(id);

    route.isActive = false;

    await this.routeRepo.save(route);

    return {
      message: 'Route deactivated successfully',
    };
  }
}