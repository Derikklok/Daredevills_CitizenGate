import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { CurrentUserWithOrg } from "../decorators/current-user-with-org.decorator";
import { Roles } from "../decorators/roles.decorator";
import { OrganizationAuthGuard } from "../guards/organization-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { RolesEnum } from "../enums/roles.enum";
import { AuthenticatedUserWithOrganization } from "../guards/organization-auth.guard";

// Example DTOs
interface CreateOrganizationSettingsDto {
    name: string;
    settings: Record<string, any>;
}

interface UpdateOrganizationSettingsDto {
    settings: Record<string, any>;
}

interface OrganizationSettingsResponse {
    id: string;
    name: string;
    settings: Record<string, any>;
    updatedAt: Date;
}

@Controller("organization-management")
@Injectable()
@UseGuards(OrganizationAuthGuard, RolesGuard)
export class OrganizationManagementController {

    @Get("profile")
    @Roles(RolesEnum.USER)
    public async getOrganizationProfile(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization
    ): Promise<any> {
        return {
            user: {
                id: user.accountId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
            },
            organization: user.organization || null,
        };
    }

    @Get("settings")
    @Roles(RolesEnum.ADMIN)
    public async getOrganizationSettings(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization
    ): Promise<OrganizationSettingsResponse> {
        // Example: Fetch organization settings from database
        // This would typically involve a service call
        return {
            id: user.organization?.id || "no-org",
            name: user.organization?.name || "No Organization",
            settings: {
                theme: "dark",
                notifications: true,
                features: ["feature1", "feature2"],
            },
            updatedAt: new Date(),
        };
    }

    @Post("settings")
    @Roles(RolesEnum.ADMIN)
    public async createOrganizationSettings(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization,
        @Body() data: CreateOrganizationSettingsDto
    ): Promise<OrganizationSettingsResponse> {
        // Example: Create organization settings
        return {
            id: user.organization?.id || "no-org",
            name: data.name,
            settings: data.settings,
            updatedAt: new Date(),
        };
    }

    @Put("settings")
    @Roles(RolesEnum.ADMIN)
    public async updateOrganizationSettings(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization,
        @Body() data: UpdateOrganizationSettingsDto
    ): Promise<OrganizationSettingsResponse> {
        // Example: Update organization settings
        return {
            id: user.organization?.id || "no-org",
            name: user.organization?.name || "No Organization",
            settings: data.settings,
            updatedAt: new Date(),
        };
    }

    @Get("members")
    @Roles(RolesEnum.ADMIN)
    public async getOrganizationMembers(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization
    ): Promise<any[]> {
        // Example: Fetch organization members
        // This would typically involve a service call to get members from Clerk
        return [
            {
                id: "user1",
                email: "user1@example.com",
                firstName: "John",
                lastName: "Doe",
                role: "admin",
            },
            {
                id: "user2",
                email: "user2@example.com",
                firstName: "Jane",
                lastName: "Smith",
                role: "member",
            },
        ];
    }

    @Delete("settings/:settingId")
    @Roles(RolesEnum.ADMIN)
    public async deleteOrganizationSetting(
        @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization,
        @Param("settingId") settingId: string
    ): Promise<{ success: boolean; message: string }> {
        // Example: Delete a specific organization setting
        return {
            success: true,
            message: `Setting ${settingId} deleted successfully for organization ${user.organization?.name}`,
        };
    }
}
