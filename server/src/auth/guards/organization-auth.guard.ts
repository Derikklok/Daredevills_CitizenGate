import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClerkService } from "../services/clerk.service";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";

export interface AuthenticatedUserWithOrganization extends AuthenticatedUser {
    organization?: {
        id: string;
        name: string;
        slug: string;
        imageUrl?: string;
        metadata?: Record<string, any>;
    };
}

@Injectable()
export class OrganizationAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly clerkService: ClerkService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        try {
            // First, verify the token and get user info
            const user = await this.clerkService.verifyToken(token);

            // If user has an organization ID, fetch organization details
            if (user.organizationId) {
                try {
                    const organization = await this.clerkService.getOrganization(user.organizationId);

                    // Extend the user object with organization details
                    const userWithOrg: AuthenticatedUserWithOrganization = {
                        ...user,
                        organization: {
                            id: organization.id,
                            name: organization.name,
                            slug: organization.slug,
                            imageUrl: organization.image_url,
                            metadata: organization.metadata || {},
                        },
                    };

                    request.user = userWithOrg;
                } catch (orgError) {
                    // If organization fetch fails, still allow access but without org details
                    console.warn(`Failed to fetch organization details: ${orgError.message}`);
                    request.user = user;
                }
            } else {
                // No organization ID, just use the user as is
                request.user = user;
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException("Invalid token");
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
