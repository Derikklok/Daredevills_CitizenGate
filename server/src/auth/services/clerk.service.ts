import { Injectable, Inject } from "@nestjs/common";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { RolesEnum } from "../enums/roles.enum";

export interface ClerkClient {
  users: {
    getUser: (userId: string) => Promise<any>;
  };
  organizations: {
    getOrganization: (params: { organizationId: string }) => Promise<any>;
    getOrganizationList: () => Promise<any>;
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
      const payload = await this.clerkClient.verifyToken(token);

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


      return user;
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async getUser(userId: string) {
    return this.clerkClient.users.getUser(userId);
  }

  async getOrganization(organizationId: string) {
    return this.clerkClient.organizations.getOrganization({ organizationId });
  }

  async getOrganizationList() {
    return this.clerkClient.organizations.getOrganizationList();
  }
}
