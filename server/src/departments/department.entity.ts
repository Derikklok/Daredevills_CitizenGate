import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('departments')
export class Department{

    @PrimaryGeneratedColumn()
    department_id : number;

    @Column()
    name : string;

    @Column({ type: 'text', nullable: true })
    address : string;

    @Column({ type: 'text', nullable: true })
    contact_email:string;

    @Column({ type: 'text', nullable: true })
    contact_phone:string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;
}