import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from './route.entity';
import { Station } from '../stations/station.entity';

@Entity('route_stations')
export class RouteStation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Route, (route) => route.routeStations, {
    onDelete: 'CASCADE',
  })
  route: Route;

  @ManyToOne(() => Station)
  station: Station;

  @Column()
  stopOrder: number;

  @Column({ nullable: true })
  distanceFromStart: number;
}