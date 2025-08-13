import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
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
        synchronize: false, // Temporarily disabled to handle schema manually
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
  providers: [],
})
export class AppModule { }
