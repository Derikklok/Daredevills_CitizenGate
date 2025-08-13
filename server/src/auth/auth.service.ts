import { Injectable } from "@nestjs/common";
import { ClerkService } from "./services/clerk.service";
import { AuthenticatedUser } from "./interfaces/authenticated-user.interface";
import { Organization } from "@clerk/clerk-sdk-node";

@Injectable()
export class AuthService {
  constructor(private readonly clerkService: ClerkService) { }

  async validateUser(token: string): Promise<AuthenticatedUser> {
    return this.clerkService.verifyToken(token);
  }

  async getUser(userId: string) {
    return this.clerkService.getUser(userId);
  }

  async getOrganization(organizationId: string) {
    return this.clerkService.getOrganization(organizationId);
  }

  async createOrganization(organization: Organization) {
    return this.clerkService.createOrganization(organization);
  }
}
