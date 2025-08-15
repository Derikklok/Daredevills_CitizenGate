import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { UploadedServiceDocuments } from "./uploaded-service-documents.entity";
import { UploadedServiceDocumentsController } from "./uploaded-service-documents.controller";
import { UploadedServiceDocumentsService } from "./uploaded-service-documents.service";
import { SupabaseService } from "./supabase.service";
import { AppConfigModule } from "../config/config.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth";

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        TypeOrmModule.forFeature([UploadedServiceDocuments]),
        MulterModule.register({
            // Configure multer to use memory storage (files will be in memory)
            storage: require('multer').memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit
            },
        }),
        AppConfigModule, // For ConfigService dependency
    ],
    controllers: [UploadedServiceDocumentsController],
    providers: [UploadedServiceDocumentsService, SupabaseService],
    exports: [UploadedServiceDocumentsService], // Export service for use in other modules
})
export class UploadedServiceDocumentsModule { }