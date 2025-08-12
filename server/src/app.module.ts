import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingsModule } from "./bookings/bookings.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemAdminModule } from "./system-admin/system-admin.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigService } from "./config/config.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Temporarily disabled for auth testing
    // TypeOrmModule.forRoot({
    //   type: "postgres",
    //   url: "postgresql://postgres:iamironman0516@db.qntlhmmsysgawoelgkwa.supabase.co:5432/postgres",
    //   synchronize: true, // ⚠️ Use only in dev
    //   autoLoadEntities: true,
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
    // BookingsModule,
    // SystemAdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
