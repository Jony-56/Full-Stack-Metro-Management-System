import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

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

  async update(id: number, data: UpdateStationDto) {
    const station = await this.findOne(id);

    if (data.code && data.code !== station.code) {
      const oldStation = await this.stationRepo.findOne({
        where: { code: data.code },
      });

      if (oldStation) {
        throw new BadRequestException('Station code already exists');
      }
    }

    Object.assign(station, data);
    return this.stationRepo.save(station);
  }

  async remove(id: number) {
    const station = await this.findOne(id);

    station.isActive = false;

    await this.stationRepo.save(station);

    return {
      message: 'Station deactivated successfully',
    };
  }
}