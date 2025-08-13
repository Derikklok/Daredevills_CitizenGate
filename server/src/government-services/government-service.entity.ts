import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Department } from '../departments/department.entity';
import { ServiceAvailability } from 'src/service-availability/service-availability.entity';

@Entity('government_services')
export class GovernmentService {
  @PrimaryGeneratedColumn('uuid')
  service_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Department, (department) => department.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'department_id', type: 'int4', nullable: true })
  department_id: number;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  estimated_total_completion_time: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ServiceAvailability, (availability) => availability.service, { cascade: true })
availabilities: ServiceAvailability[];

}
