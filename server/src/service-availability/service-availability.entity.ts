import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GovernmentService } from '../government-services/government-service.entity';

@Entity('service_availability')
export class ServiceAvailability {
  @PrimaryGeneratedColumn('uuid')
  availability_id: string;

  @ManyToOne(() => GovernmentService, (service) => service.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @Column({ name: 'service_id', type: 'uuid' })
  service_id: string;

  @Column({ type: 'text' })
  day_of_week: string; // "Monday", "Tuesday", etc.

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'int' })
  duration_minutes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
