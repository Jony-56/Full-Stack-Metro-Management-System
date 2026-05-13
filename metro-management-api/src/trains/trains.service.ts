import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Train } from './train.entity';
import { Route } from '../routes/route.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainRepo: Repository<Train>,

    @InjectRepository(Route)
    private routeRepo: Repository<Route>,
  ) {}

  async create(data: CreateTrainDto) {
    const oldTrain = await this.trainRepo.findOne({
      where: { trainNumber: data.trainNumber },
    });

    if (oldTrain) {
      throw new BadRequestException('Train number already exists');
    }

    const route = await this.routeRepo.findOne({
      where: { id: data.routeId },
    });

    if (!route) {
      throw new BadRequestException('Route not found');
    }

    const train = this.trainRepo.create({
      trainNumber: data.trainNumber,
      capacity: data.capacity,
      route,
    });

    return this.trainRepo.save(train);
  }

  findAll() {
    return this.trainRepo.find({
      relations: ['route', 'route.sourceStation', 'route.destinationStation'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const train = await this.trainRepo.findOne({
      where: { id },
      relations: ['route', 'route.sourceStation', 'route.destinationStation'],
    });

    if (!train) {
      throw new NotFoundException('Train not found');
    }

    return train;
  }

  async update(id: number, data: UpdateTrainDto) {
    const train = await this.findOne(id);

    if (data.trainNumber && data.trainNumber !== train.trainNumber) {
      const oldTrain = await this.trainRepo.findOne({
        where: { trainNumber: data.trainNumber },
      });

      if (oldTrain) {
        throw new BadRequestException('Train number already exists');
      }

      train.trainNumber = data.trainNumber;
    }

    if (data.capacity !== undefined) {
      train.capacity = data.capacity;
    }

    if (data.routeId) {
      const route = await this.routeRepo.findOne({
        where: { id: data.routeId },
      });

      if (!route) {
        throw new BadRequestException('Route not found');
      }

      train.route = route;
    }

    if (data.status) {
      train.status = data.status;
    }

    if (data.isActive !== undefined) {
      train.isActive = data.isActive;
    }

    return this.trainRepo.save(train);
  }

  async remove(id: number) {
    const train = await this.findOne(id);

    train.isActive = false;
    train.status = 'inactive' as any;

    await this.trainRepo.save(train);

    return {
      message: 'Train deactivated successfully',
    };
  }
}