import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
    get clerkSecretKey(): string {
        const key = process.env.CLERK_SECRET_KEY;
        if (!key) {
            throw new Error("CLERK_SECRET_KEY environment variable is required");
        }
        return key;
    }

    get clerkPublishableKey(): string {
        const key = process.env.CLERK_PUBLISHABLE_KEY;
        if (!key) {
            throw new Error("CLERK_PUBLISHABLE_KEY environment variable is required");
        }
        return key;
    }

    get databaseUrl(): string {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error("DATABASE_URL environment variable is required");
        }
        return url;
    }

    get nodeEnv(): string {
        return process.env.NODE_ENV || "development";
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === "development";
    }

    get isProduction(): boolean {
        return this.nodeEnv === "production";
    }
}
