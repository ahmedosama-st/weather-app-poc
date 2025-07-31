import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WeatherEntity } from '@src/weather/entities/weather.entity';
import { PollutionEntity } from '@src/weather/entities/pollution.entity';
import { LocationEnum } from '@src/location/enums/location.enum';

@Entity('locations')
@Index('fk_location_parent_idx', ['parentId'])
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number | null;

  @Column({
    type: 'enum',
    enum: Object.values(LocationEnum),
    nullable: false,
  })
  type: LocationEnum;

  @ManyToOne(() => LocationEntity, location => location.children)
  @JoinColumn({ name: 'parent_id' })
  parent: LocationEntity;

  @OneToMany(() => LocationEntity, location => location.parent)
  children: LocationEntity[];

  @OneToMany(() => WeatherEntity, weather => weather.location)
  weathers: WeatherEntity[];

  @OneToMany(() => PollutionEntity, pollution => pollution.location)
  pollutions: PollutionEntity[];
}
