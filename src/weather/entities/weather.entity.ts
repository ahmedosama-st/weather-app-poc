import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LocationEntity } from '@src/location/entities/location.entity';

@Entity('weathers')
@Index('fk_location_weather_idx', ['locationId'])
export class WeatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'tp', type: 'float' })
  tp: number;

  @Column({ name: 'pr', type: 'float' })
  pr: number;

  @Column({ name: 'hu', type: 'float' })
  hu: number;

  @Column({ name: 'ws', type: 'float' })
  ws: number;

  @Column({ name: 'wd', type: 'float' })
  wd: number;

  @Column({ name: 'ic' })
  ic: string;

  @Column({ name: 'heat_index' })
  heat_index: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => LocationEntity, location => location.weathers)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;
}
