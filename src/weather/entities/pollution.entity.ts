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

@Entity('pollutions')
@Index('fk_location_pollution_idx', ['locationId'])
export class PollutionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'mainus' })
  mainus: string;

  @Column({ name: 'maincn' })
  maincn: string;

  @Column({ name: 'aqius', type: 'float' })
  aqius: number;

  @Column({ name: 'aqicn', type: 'float' })
  aqicn: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => LocationEntity, location => location.pollutions)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;
}
