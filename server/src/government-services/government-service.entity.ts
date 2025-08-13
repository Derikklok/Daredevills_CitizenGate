import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from '../departments/department.entity';
import { ServiceAvailability } from 'src/service-availability/service-availability.entity';
import { RequiredDocument } from 'src/required-documents/required-document.entity';

@Entity('government_services')
export class GovernmentService {
  @ApiProperty({ description: 'Unique identifier for the service', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @PrimaryGeneratedColumn('uuid')
  service_id: string;

  @ApiProperty({ description: 'Service name', example: 'Passport Renewal' })
  @Column({ type: 'text' })
  name: string;

  @ApiPropertyOptional({ description: 'Service description', example: 'Renew your passport at the nearest office.' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Department, (department) => department.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ApiPropertyOptional({ description: 'Department ID owning this service', example: 1 })
  @Column({ name: 'department_id', type: 'int4', nullable: true })
  department_id: number;

  @ApiPropertyOptional({ description: 'Service category', example: 'Travel' })
  @Column({ type: 'text', nullable: true })
  category: string;

  @ApiPropertyOptional({ description: 'Estimated completion time', example: '3-5 business days' })
  @Column({ type: 'text', nullable: true })
  estimated_total_completion_time: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ServiceAvailability, (availability) => availability.service, { cascade: true })
  availabilities: ServiceAvailability[];

  @OneToMany(() => RequiredDocument, (document) => document.service, { cascade: true })
  requiredDocuments: RequiredDocument[];
}
