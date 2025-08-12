import { Provider } from "@nestjs/common";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { verifyToken } from "@clerk/backend";
import { ClerkClient } from "../services/clerk.service";
import { ConfigService } from "../../config/config.service";

export const CLERK_CLIENT = "ClerkClient";

export const ClerkClientProvider: Provider = {
  provide: CLERK_CLIENT,
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
      },
      verifyToken: async (token: string) => {
        return await verifyToken(token, {
          secretKey: configService.clerkSecretKey,
        });
      },
    };
  },
};
