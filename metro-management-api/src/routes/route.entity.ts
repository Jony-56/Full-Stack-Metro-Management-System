import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Station } from '../stations/station.entity';
import { RouteStation } from './route-station.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Station)
  sourceStation: Station;

  @ManyToOne(() => Station)
  destinationStation: Station;

  @OneToMany(() => RouteStation, (routeStation) => routeStation.route)
  routeStations: RouteStation[];

  @Column({ default: true })
  isActive: boolean;
}