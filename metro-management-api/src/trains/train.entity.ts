import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from '../routes/route.entity';

export enum TrainStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

@Entity('trains')
export class Train {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trainNumber: string;

  @Column()
  capacity: number;

  @ManyToOne(() => Route)
  route: Route;

  @Column({
    type: 'enum',
    enum: TrainStatus,
    default: TrainStatus.ACTIVE,
  })
  status: TrainStatus;

  @Column({ default: true })
  isActive: boolean;
}