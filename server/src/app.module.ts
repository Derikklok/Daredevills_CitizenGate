import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { DepartmentsModule } from "./departments/departments.module";
import { GovernmentServicesModule } from "./government-services/government-services.module";
import { ServiceAvailabilityModule } from './service-availability/service-availability.module';
import { RequiredDocumentsModule } from './required-documents/required-documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.databaseUrl,
        synchronize: configService.isDevelopment, // ⚠️ Use only in dev
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DepartmentsModule,
    GovernmentServicesModule,
    ServiceAvailabilityModule,
    RequiredDocumentsModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
