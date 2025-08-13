import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Roles } from "../decorators/roles.decorator";
import { ClerkAuthGuard } from "../guards/clerk-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { RolesEnum } from "../enums/roles.enum";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { AuthService } from "../auth.service";

// Example DTOs (you would define these in your actual implementation)
export class CreateThirdPartyAPIKeyDto {
  clientName: string;
  description: string;
}

export class CreateThirdPartyAPIKeyResponse {
  token: string;
  info: any;
}

export class ThirdPartyAPIKey {
  _id: string;
  organizationId: string;
  createdBy: string;
  clientName: string;
  description: string;
  jwtId: string;
  sanitizedApiKey: string;
}

@Controller("api-management")
@Injectable()
@Roles(RolesEnum.ADMIN)
@UseGuards(ClerkAuthGuard, RolesGuard)
export class APIManagementController {
  constructor(private readonly authService: AuthService) { }

  @Post("third-party-api-keys")
  public async createThirdPartyAPIKey(
    @CurrentUser() curUser: AuthenticatedUser,
    @Body() data: CreateThirdPartyAPIKeyDto
  ): Promise<CreateThirdPartyAPIKeyResponse> {
    // Mock implementation - replace with your actual business logic
    // const user = await this.authService.getUser(curUser.accountId);
    // const organization = await this.authService.getOrganization(
    //   curUser.organizationId,
    // );

    const token = "mock_token_" + Date.now();
    const jwtId = "jwt_" + Date.now();

    const sanitizedToken = `${token.slice(0, 6)}***${token.slice(-6)}`;

    const thirdPartyAPIKeyObject: ThirdPartyAPIKey = {
      _id: "id_" + Date.now(),
      organizationId: curUser.organizationId,
      createdBy: curUser.accountId,
      clientName: data.clientName,
      description: data.description,
      jwtId: jwtId,
      sanitizedApiKey: sanitizedToken,
    };

    return {
      token,
      info: thirdPartyAPIKeyObject,
    };
  }

  @Get("third-party-api-keys")
  public async getThirdPartyAPIKeys(
    @CurrentUser() curUser: AuthenticatedUser
  ): Promise<ThirdPartyAPIKey[]> {
    // Mock implementation - replace with your actual database query
    return [
      {
        _id: "1",
        organizationId: curUser.organizationId,
        createdBy: curUser.accountId,
        clientName: "Example Client",
        description: "Example API Key",
        jwtId: "jwt_1",
        sanitizedApiKey: "mock_***_token",
      },
    ];
  }

  @Delete("third-party-api-keys/:jwtId")
  public async deleteThirdPartyAPIKey(
    @CurrentUser() curUser: AuthenticatedUser,
    @Param("jwtId") jwtId: string
  ): Promise<{ success: boolean }> {
    // Mock implementation - replace with your actual deletion logic
    console.log(
      `Deleting API key with jwtId: ${jwtId} for user: ${curUser.accountId}`
    );
    return { success: true };
  }

  // Example of endpoint with different role requirements
  @Get("admin-only")
  @Roles(RolesEnum.ADMIN)
  public async adminOnlyEndpoint(
    @CurrentUser() curUser: AuthenticatedUser
  ): Promise<{ message: string }> {
    return {
      message: `Hello ${curUser.firstName}, you have super admin access!`,
    };
  }

  // Example of endpoint without role requirements (just authentication)
  @Get("profile")
  public async getUserProfile(
    @CurrentUser() curUser: AuthenticatedUser
  ): Promise<AuthenticatedUser> {
    return curUser;
  }
}
