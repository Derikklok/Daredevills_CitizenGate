import { Injectable, Inject } from "@nestjs/common";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { RolesEnum } from "../enums/roles.enum";

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

      // Map Clerk roles to our application roles
      const mapClerkRolesToAppRoles = (clerkRoles: any): RolesEnum[] => {
        // Handle different input types
        let rolesArray: string[] = [];
        if (Array.isArray(clerkRoles)) {
          rolesArray = clerkRoles;
        } else if (typeof clerkRoles === 'string') {
          rolesArray = [clerkRoles];
        } else if (clerkRoles) {
          rolesArray = [clerkRoles.toString()];
        }

        const roleMap: { [key: string]: RolesEnum } = {
          'admin': RolesEnum.ADMIN,
          'org:admin': RolesEnum.ADMIN,
          'member': RolesEnum.MEMBER,
          'user': RolesEnum.USER,
          'system-admin': RolesEnum.SYSTEM_ADMIN,
        };

        const mappedRoles = rolesArray.map(role => {
          const mappedRole = roleMap[role.toLowerCase()];
          return mappedRole;
        }).filter(Boolean);

        // If no roles are mapped, default to USER
        return mappedRoles.length > 0 ? mappedRoles : [RolesEnum.USER];
      };

      // Check if user has a role in public metadata
      let metadataRole = null;
      if (payload.public_metadata && payload.public_metadata.role) {
        metadataRole = payload.public_metadata.role;
      }
      
      const user = {
        accountId: payload.sub,
        organizationId: payload.org_id || payload.organizationId,
        email: payload.email,
        firstName: payload.first_name || payload.firstName,
        lastName: payload.last_name || payload.lastName,
        roles: mapClerkRolesToAppRoles(
          metadataRole || // First check public metadata role
          payload.org_role || // Then check org_role
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
