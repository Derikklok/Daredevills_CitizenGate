import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { DepartmentsModule } from "./departments/departments.module";
import { GovernmentServicesModule } from "./government-services/government-services.module";

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

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
