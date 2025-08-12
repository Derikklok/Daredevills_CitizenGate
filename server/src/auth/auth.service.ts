import { Injectable } from "@nestjs/common";
import { ClerkService } from "./services/clerk.service";
import { AuthenticatedUser } from "./interfaces/authenticated-user.interface";

@Injectable()
export class AuthService {
  constructor(private readonly clerkService: ClerkService) {}

  async validateUser(token: string): Promise<AuthenticatedUser> {
    return this.clerkService.verifyToken(token);
  }

  async getUser(userId: string) {
    return this.clerkService.getUser(userId);
  }

  async getOrganization(organizationId: string) {
    return this.clerkService.getOrganization(organizationId);
  }
}
