import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { AuthService } from "./auth.service";
import { ClerkService } from "./services/clerk.service";
import { AuthTestController } from "./controllers/auth-test.controller";
import { ClerkClientProvider } from "./providers/clerk.provider";

@Module({
  controllers: [AuthTestController],
  providers: [
    AuthService,
    ClerkService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, ClerkService],
})
export class AuthModule { }
