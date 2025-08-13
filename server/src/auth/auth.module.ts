import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { AuthService } from "./auth.service";
import { ClerkService } from "./services/clerk.service";
import { ClerkClientProvider } from "./providers/clerk.provider";
import { ConfigService } from "../config/config.service";

@Module({
  controllers: [],
  providers: [
    AuthService,
    ClerkService,
    ClerkClientProvider,
    ConfigService,
  ],
  exports: [AuthService, ClerkService],
})
export class AuthModule { }
