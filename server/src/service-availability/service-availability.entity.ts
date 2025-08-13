import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GovernmentService } from '../government-services/government-service.entity';

@Entity('service_availability')
export class ServiceAvailability {
  @ApiProperty({ description: 'Unique identifier for availability', example: '2c1a5f16-abcd-4f1e-9c12-33f4d2b1a0bc' })
  @PrimaryGeneratedColumn('uuid')
  availability_id: string;

  @ManyToOne(() => GovernmentService, (service) => service.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @ApiProperty({ description: 'Service ID the availability is for', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @Column({ name: 'service_id', type: 'uuid' })
  service_id: string;

  @ApiProperty({ description: 'Day of the week', example: 'Monday' })
  @Column({ type: 'text' })
  day_of_week: string; // "Monday", "Tuesday", etc.

  @ApiProperty({ description: 'Start time (HH:mm)', example: '09:00' })
  @Column({ type: 'time' })
  start_time: string;

  @ApiProperty({ description: 'End time (HH:mm)', example: '17:00' })
  @Column({ type: 'time' })
  end_time: string;

  @ApiProperty({ description: 'Duration per slot in minutes', example: 30 })
  @Column({ type: 'int' })
  duration_minutes: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updated_at: Date;
}
