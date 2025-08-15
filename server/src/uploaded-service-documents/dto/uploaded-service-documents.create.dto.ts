import { IsNotEmpty, IsString } from "class-validator";

export class UploadedServiceDocumentsCreateDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    fileType: string;

    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @IsString()
    @IsNotEmpty()
    requiredDocumentId: string;

    @IsString()
    @IsNotEmpty()
    appointmentId: string;
}