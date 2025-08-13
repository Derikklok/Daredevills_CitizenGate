import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GovernmentService } from '../government-services/government-service.entity';

@Entity('required_documents')
@Unique(['service_id', 'name']) // Add a unique constraint for service_id and name combination
export class RequiredDocument {
  @PrimaryGeneratedColumn('uuid')
  document_id: string;

  @ManyToOne(() => GovernmentService, (service) => service.requiredDocuments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @Column({ type: 'uuid' })
  service_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_mandatory: boolean;
  
  @Column({ type: 'text', nullable: true, default: 'pdf,jpg,png' })
  document_format: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
