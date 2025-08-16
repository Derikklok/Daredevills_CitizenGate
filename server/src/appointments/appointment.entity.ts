import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GovernmentService } from '../government-services/government-service.entity';
import { ServiceAvailability } from '../service-availability/service-availability.entity';

@Entity('appointments')
export class Appointment {
  @ApiProperty({ description: 'Unique appointment ID', example: 'c7a1f0a6-1b5c-4c1e-8f0a-5b1d2c3e4f5a' })
  @PrimaryGeneratedColumn('uuid')
  appointment_id: string;

  @ManyToOne(() => GovernmentService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @ApiProperty({ description: 'Service ID', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @Column({ type: 'uuid', nullable: true })
  service_id: string;

  @ManyToOne(() => ServiceAvailability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availability_id' })
  availability: ServiceAvailability;

  @ApiProperty({ description: 'Availability ID', example: '2c1a5f16-abcd-4f1e-9c12-33f4d2b1a0bc' })
  @Column({ type: 'uuid', nullable: true })
  availability_id: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @Column({ type: 'text' })
  full_name: string;

  @ApiProperty({ description: 'NIC', example: '123456789V' })
  @Column({ type: 'text' })
  nic: string;

  @ApiProperty({ description: 'Phone number', example: '+94 77 123 4567' })
  @Column({ type: 'text' })
  phone_number: string;

  @ApiPropertyOptional({ description: 'Address' })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'Birth date', example: '1990-01-01' })
  @Column({ type: 'date' })
  birth_date: Date;

  @ApiProperty({ description: 'Gender', example: 'Male' })
  @Column({ type: 'text' })
  gender: string;

  @ApiPropertyOptional({ description: 'Email', example: 'john@example.com' })
  @Column({ type: 'text', nullable: true })
  email: string;

<<<<<<< HEAD
  @Column({ type: 'text', nullable: true })
  username: string; // Field to store the current user's username

=======
  @ApiProperty({ description: 'Appointment time (ISO 8601)', example: '2025-08-15T10:30:00Z' })
>>>>>>> master
  @Column({ type: 'timestamptz' })
  appointment_time: Date;

  @ApiPropertyOptional({ description: 'Appointment status', example: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] })
  @Column({ type: 'text', nullable: true })
  appointment_status: string; // pending, confirmed, completed, cancelled

  @ApiPropertyOptional({ description: 'Notes' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiPropertyOptional({ description: 'Documents submitted', isArray: true })
  @Column({ type: 'jsonb', nullable: true })
  documents_submitted: {
    document_id: string;
    name: string;
    file_url: string;
    uploaded_at: Date;
    verification_status?: string; // pending, verified, rejected
  }[]; // Array of uploaded document links with metadata

  @ApiPropertyOptional({ description: 'Reminders sent', isArray: true })
  @Column({ type: 'jsonb', nullable: true })
  reminders_sent: {
    reminder_id: string;
    reminder_time: Date;
  }[]; // Array of reminders sent with metadata

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
