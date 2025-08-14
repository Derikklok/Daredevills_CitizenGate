import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GovernmentService } from '../government-services/government-service.entity';
import { ServiceAvailability } from '../service-availability/service-availability.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointment_id: string;

  @ManyToOne(() => GovernmentService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @Column({ type: 'uuid' })
  service_id: string;

  @ManyToOne(() => ServiceAvailability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availability_id' })
  availability: ServiceAvailability;

  @Column({ type: 'uuid' })
  availability_id: string;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'text' })
  nic: string;

  @Column({ type: 'text' })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'text' })
  gender: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  username: string; // Field to store the current user's username

  @Column({ type: 'timestamptz' })
  appointment_time: Date;
  
  @Column({ type: 'text', nullable: true })
  appointment_status: string; // pending, confirmed, completed, cancelled

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  documents_submitted: {
    document_id: string;
    name: string;
    file_url: string;
    uploaded_at: Date;
    verification_status?: string; // pending, verified, rejected
  }[]; // Array of uploaded document links with metadata

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
