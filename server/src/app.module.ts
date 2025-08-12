import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingsModule } from "./bookings/bookings.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemAdminModule } from "./system-admin/system-admin.module";
import { AuthModule } from "./auth/auth.module";
import { ClerkClientProvider } from "./auth/providers/clerk.provider";
import { ConfigService } from "./config/config.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://postgres:iamironman0516@db.qntlhmmsysgawoelgkwa.supabase.co:5432/postgres",
      synchronize: true, // ⚠️ Use only in dev
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    BookingsModule,
    SystemAdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkClientProvider, ConfigService],
})
export class AppModule { }
