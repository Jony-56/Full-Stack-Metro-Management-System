import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;
}