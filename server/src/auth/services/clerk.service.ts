import { Injectable, Inject } from "@nestjs/common";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { RolesEnum } from "../enums/roles.enum";
import { Organization } from "@clerk/clerk-sdk-node";

export interface ClerkClient {
  users: {
    getUser: (userId: string) => Promise<any>;
  };
  organizations: {
    getOrganization: (params: { organizationId: string }) => Promise<any>;
    createOrganization: (params: { name: string, slug: string, metadata?: any }) => Promise<any>;
    deleteOrganization: (params: { organizationId: string }) => Promise<any>;
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
      console.log('Full Clerk payload:', JSON.stringify(payload, null, 2));

      // Map Clerk roles to our application roles
      const mapClerkRolesToAppRoles = (clerkRoles: any): RolesEnum[] => {
        console.log('Raw Clerk roles input:', clerkRoles);

        // Handle different input types
        let rolesArray: string[] = [];
        if (Array.isArray(clerkRoles)) {
          rolesArray = clerkRoles;
        } else if (typeof clerkRoles === 'string') {
          rolesArray = [clerkRoles];
        } else if (clerkRoles) {
          rolesArray = [clerkRoles.toString()];
        }

        console.log('Processed roles array:', rolesArray);

        const roleMap: { [key: string]: RolesEnum } = {
          'admin': RolesEnum.ADMIN,
          'org:admin': RolesEnum.ADMIN,
          'member': RolesEnum.MEMBER,
          'user': RolesEnum.USER,
        };

        const mappedRoles = rolesArray.map(role => {
          const mappedRole = roleMap[role.toLowerCase()];
          console.log(`Mapping role: ${role} -> ${mappedRole}`);
          return mappedRole;
        }).filter(Boolean);

        console.log('Final mapped roles:', mappedRoles);

        // If no roles are mapped, default to USER
        return mappedRoles.length > 0 ? mappedRoles : [RolesEnum.USER];
      };

      const user = {
        accountId: payload.sub,
        organizationId: payload.org_id || payload.organizationId,
        email: payload.email,
        firstName: payload.first_name || payload.firstName,
        lastName: payload.last_name || payload.lastName,
        roles: mapClerkRolesToAppRoles(
          payload.org_role || // Prioritize org_role since that's what Clerk sends
          payload.roles ||
          payload.organization_roles ||
          payload.org_roles ||
          payload.organization?.roles ||
          []
        ),
        permissions: payload.permissions || [],
        metadata: payload.metadata || {},
        rawPayload: payload, // Store raw payload for debugging
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

  async createOrganization(params: { name: string, slug: string, metadata?: any }) {
    return this.clerkClient.organizations.createOrganization(params);
  }

  async deleteOrganization(organizationId: string) {
    return this.clerkClient.organizations.deleteOrganization({ organizationId });
  }
}
