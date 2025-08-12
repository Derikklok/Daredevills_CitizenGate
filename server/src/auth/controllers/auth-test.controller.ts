import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Roles } from "../decorators/roles.decorator";
import { ClerkAuthGuard } from "../guards/clerk-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { RolesEnum } from "../enums/roles.enum";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { AuthService } from "../auth.service";

export class TestUserDataDto {
  message: string;
  timestamp: string;
}

export class UserProfileResponse {
  user: AuthenticatedUser;
  serverInfo: {
    timestamp: string;
    environment: string;
    authStatus: string;
  };
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
  };
}

@Controller("auth-test")
@UseGuards(ClerkAuthGuard, RolesGuard)
export class AuthTestController {
  constructor(private readonly authService: AuthService) {}

  @Get("profile")
  @Roles(RolesEnum.USER)
  async getUserProfile(
    @CurrentUser() user: AuthenticatedUser
  ): Promise<UserProfileResponse> {
    // Get additional user data from Clerk
    const clerkUser = await this.authService.getUser(user.accountId);
    // const organization = await this.authService.getOrganization(
    //   user.organizationId
    // );

    return {
      user: {
        ...user,
        firstName: clerkUser.firstName || user.firstName,
        lastName: clerkUser.lastName || user.lastName,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || user.email,
      },
      serverInfo: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        authStatus: "authenticated",
      },
      permissions: {
        canRead: user.roles.includes(RolesEnum.USER),
        canWrite: user.roles.includes(RolesEnum.ADMIN),
        canDelete: user.roles.includes(RolesEnum.SUPER_ADMIN),
      },
    };
  }

  @Get("admin-only")
  @Roles(RolesEnum.ADMIN)
  async getAdminData(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: "Admin access granted!",
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
      secretData: "This is only visible to admins",
    };
  }

  @Get("super-admin")
  @Roles(RolesEnum.SUPER_ADMIN)
  async getSuperAdminData(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: "Super Admin access granted!",
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
      superSecretData: "This is only visible to super admins",
      systemStats: {
        totalUsers: 1000,
        activeSessions: 150,
        systemHealth: "excellent",
      },
    };
  }

  @Post("test-message")
  @Roles(RolesEnum.USER)
  @HttpCode(HttpStatus.OK)
  async testMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: TestUserDataDto
  ) {
    return {
      message: `Message received from ${user.email}`,
      originalMessage: data.message,
      timestamp: new Date().toISOString(),
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  @Get("public-info")
  async getPublicInfo() {
    return {
      message: "This endpoint is public (no auth required)",
      timestamp: new Date().toISOString(),
      serverVersion: "1.0.0",
    };
  }
}
