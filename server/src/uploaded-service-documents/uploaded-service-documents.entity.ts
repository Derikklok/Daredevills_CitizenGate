import { ApiProperty } from "@nestjs/swagger";
import { Appointment } from "../appointments/appointment.entity";
import { GovernmentService } from "../government-services/government-service.entity";
import { RequiredDocument } from "../required-documents/required-document.entity";
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class UploadedServiceDocuments {
    @PrimaryColumn({ type: "uuid" })
    @ApiProperty({ description: "The ID of the uploaded document" })
    id: string;

    @Column()
    @ApiProperty({ description: "The S3 key for the uploaded file" })
    s3Key: string;

    @Column()
    @ApiProperty({ description: "The name of the uploaded file" })
    fileName: string;

    @Column()
    @ApiProperty({ description: "The type of the uploaded file" })
    fileType: string;

    @Column({ type: "uuid" })
    @ApiProperty({ description: "The ID of the service" })
    serviceId: string;

    @ManyToOne(() => GovernmentService, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'serviceId', referencedColumnName: 'service_id' })
    service?: GovernmentService;

    @Column({ type: "uuid" })
    @ApiProperty({ description: "The ID of the required document" })
    requiredDocumentId: string;

    @ManyToOne(() => RequiredDocument, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'requiredDocumentId', referencedColumnName: 'document_id' })
    requiredDocument?: RequiredDocument;

    @Column()
    @ApiProperty({ description: "The ID of the user" })
    userId: string;

    @Column({ type: "uuid" })
    @ApiProperty({ description: "The ID of the appointment" })
    appointmentId: string;

    @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'appointmentId', referencedColumnName: 'appointment_id' })
    appointment?: Appointment;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: "The date and time the document was created" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: "The date and time the document was updated" })
    updatedAt: Date;
}