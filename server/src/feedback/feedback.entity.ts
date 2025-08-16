import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';
import { GovernmentService } from '../government-services/government-service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('feedback')
export class Feedback {
  @ApiProperty({ description: 'Unique identifier for the feedback', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Government service ID being rated', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @Column({ name: 'service_id' })
  serviceId: string;

  @ManyToOne(() => GovernmentService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @ApiProperty({ description: 'Rating from 1 to 5', example: 5 })
  @Column({ type: 'int' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Feedback description', example: 'Great service, very efficient!' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
