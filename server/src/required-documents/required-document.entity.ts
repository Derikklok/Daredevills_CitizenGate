import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GovernmentService } from '../government-services/government-service.entity';

@Entity('required_documents')
@Unique(['service_id', 'name']) // Add a unique constraint for service_id and name combination
export class RequiredDocument {
  @ApiProperty({ description: 'Unique identifier for the document', example: 'f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30' })
  @PrimaryGeneratedColumn('uuid')
  document_id: string;

  @ManyToOne(() => GovernmentService, (service) => service.requiredDocuments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: GovernmentService;

  @ApiProperty({ description: 'Service ID this document belongs to', example: '6a3a6e19-4d2d-47a1-9a1e-3d2c7be2e0e1' })
  @Column({ type: 'uuid' })
  service_id: string;

  @ApiProperty({ description: 'Document name', example: 'Birth Certificate' })
  @Column({ type: 'text' })
  name: string;

  @ApiPropertyOptional({ description: 'Document description', example: 'Original or certified copy.' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Is this document mandatory', example: true })
  @Column({ type: 'boolean', default: true })
  is_mandatory: boolean;

  @ApiPropertyOptional({ description: 'Allowed formats', example: 'pdf,jpg,png' })
  @Column({ type: 'text', nullable: true, default: 'pdf,jpg,png' })
  document_format: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
