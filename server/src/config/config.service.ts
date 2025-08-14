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

    get sendgridApiKey(): string {
        const key = process.env.SENDGRID_API_KEY;
        if (!key) {
            throw new Error("SENDGRID_API_KEY environment variable is required");
        }
        return key;
    }

    get plunkApiKey(): string {
        const key = process.env.PLUNK_API_KEY;
        if (!key) {
            throw new Error("PLUNK_API_KEY environment variable is required");
        }
        return key;
    }

    get fromEmail(): string {
        const email = process.env.FROM_EMAIL;
        if (!email) {
            throw new Error("SENDGRID_FROM_EMAIL environment variable is required");
        }
        return email;
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
