import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDto } from './dto/create-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepo: Repository<Station>,
  ) {}

  async create(data: CreateStationDto) {
    const oldStation = await this.stationRepo.findOne({
      where: { code: data.code },
    });

    if (oldStation) {
      throw new BadRequestException('Station code already exists');
    }

    const station = this.stationRepo.create(data);
    return this.stationRepo.save(station);
  }

  findAll() {
    return this.stationRepo.find();
  }

  async findOne(id: number) {
    const station = await this.stationRepo.findOne({
      where: { id },
    });

    if (!station) {
      throw new NotFoundException('Station not found');
    }

    return station;
  }
}