import { Injectable, Inject } from "@nestjs/common";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { RolesEnum } from "../enums/roles.enum";

export interface ClerkClient {
  users: {
    getUser: (userId: string) => Promise<any>;
  };
  organizations: {
    getOrganization: (params: { organizationId: string }) => Promise<any>;
  };
  verifyToken: (token: string) => Promise<any>;
}

@Injectable()
export class ClerkService {
  private readonly clerkClient: ClerkClient;

  constructor(@Inject("ClerkClient") clerkClient: ClerkClient) {
    this.clerkClient = clerkClient;
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    try {
      console.log("🔍 ClerkService: Starting token verification...");
      const payload = await this.clerkClient.verifyToken(token);
      console.log("🔍 ClerkService: Token payload received:", {
        sub: payload.sub,
        email: payload.email,
        hasRoles: !!payload.roles,
      });

      const user = {
        accountId: payload.sub,
        organizationId: payload.org_id || payload.organizationId,
        email: payload.email,
        firstName: payload.first_name || payload.firstName,
        lastName: payload.last_name || payload.lastName,
        roles: payload.roles || [RolesEnum.USER],
        permissions: payload.permissions || [],
        metadata: payload.metadata || {},
      };

      console.log("✅ ClerkService: User object created:", user.accountId);
      return user;
    } catch (error) {
      console.error("❌ ClerkService: Token verification error:", error.message);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async getUser(userId: string) {
    return this.clerkClient.users.getUser(userId);
  }

  async getOrganization(organizationId: string) {
    return this.clerkClient.organizations.getOrganization({ organizationId });
  }
}
