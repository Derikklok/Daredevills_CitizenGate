import { Provider } from "@nestjs/common";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { verifyToken } from "@clerk/backend";
import { ClerkClient } from "../services/clerk.service";
import { ConfigService } from "../../config/config.service";

export const CLERK_CLIENT = "ClerkClient";

export const ClerkClientProvider: Provider = {
  provide: CLERK_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClerkClient => {
    return {
      users: {
        getUser: async (userId: string) => {
          return await clerkClient.users.getUser(userId);
        },
      },
      organizations: {
        getOrganization: async ({
          organizationId,
        }: {
          organizationId: string;
        }) => {
          return await clerkClient.organizations.getOrganization({
            organizationId,
          });
        },
        createOrganization: async (params: {
          name: string;
          slug: string;
          image_url?: string;
          metadata: any;
        }) => {
          return await clerkClient.organizations.createOrganization({
            name: params.name,
            slug: params.slug,
            createdBy: params.metadata?.created_by || 'system',
          });
        },
        deleteOrganization: async ({
          organizationId,
        }: {
          organizationId: string;
        }) => {
          return await clerkClient.organizations.deleteOrganization(organizationId);
        },
      },
      verifyToken: async (token: string) => {
        try {
          return await verifyToken(token, {
            secretKey: configService.clerkSecretKey,
          });
        } catch (verifyError) {
          return await verifyToken(token, {
            secretKey: configService.clerkSecretKey,
            audience: "http://localhost:5173",
          });
        }

      },
    };
  },
};
