import { GovernmentService } from "src/government-services/government-service.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('departments')
export class Department {

    @ApiProperty({ description: 'Unique identifier for the department', example: 1 })
    @PrimaryGeneratedColumn()
    department_id: number;

    @ApiProperty({ description: 'Department name', example: 'Department of Health' })
    @Column({ unique: true })
    name: string;

    @ApiPropertyOptional({ description: 'Department description' })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiPropertyOptional({ description: 'Address' })
    @Column({ type: 'text', nullable: true })
    address: string;

    @ApiPropertyOptional({ description: 'Contact email' })
    @Column({ type: 'text', nullable: true })
    contact_email: string;

    @ApiPropertyOptional({ description: 'Contact phone' })
    @Column({ type: 'text', nullable: true })
    contact_phone: string;

    @ApiPropertyOptional({ description: 'Clerk organization ID' })
    @Column({ type: 'text', nullable: true })
    clerk_org_id: string;

    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => GovernmentService, (service) => service.department, { cascade: true })
    services: GovernmentService[];
}