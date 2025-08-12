# Auth Module

This module provides authentication and authorization functionality using Clerk and role-based access control.

## Features

- **Clerk Integration**: JWT token verification and user management
- **Role-based Access Control**: Protect endpoints with role requirements
- **Decorators**: Easy-to-use decorators for authentication and authorization
- **Guards**: Automatic authentication and authorization guards

## Setup

### 1. Install Dependencies

```bash
npm install @clerk/clerk-sdk-node
```

### 2. Configure Environment Variables

Add your Clerk configuration to your environment:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Clerk Integration (Already Implemented!)

The actual Clerk SDK integration has been implemented! The provider now uses:

- **Real Clerk API calls** for user and organization data
- **JWT token verification** using Clerk's backend SDK
- **Environment-based configuration** with proper error handling

See `CLERK_SETUP.md` for detailed setup instructions.

## Usage

### Decorators

#### @CurrentUser()

Extract the authenticated user from the request context.

```typescript
@Get()
async getProfile(@CurrentUser() user: AuthenticatedUser) {
  return `Hello ${user.firstName}!`;
}
```

#### @CurrentUserWithOrg()

Extract the authenticated user with organization details from the request context. Use this with `OrganizationAuthGuard`.

```typescript
@Get()
@UseGuards(OrganizationAuthGuard)
async getOrganizationProfile(@CurrentUserWithOrg() user: AuthenticatedUserWithOrganization) {
  return {
    user: user,
    organization: user.organization
  };
}
```

#### @Roles(...roles)

Specify required roles for an endpoint.

```typescript
@Get('admin-only')
@Roles(RolesEnum.ADMIN)
async adminOnly(@CurrentUser() user: AuthenticatedUser) {
  return 'Admin access granted';
}
```

### Guards

#### ClerkAuthGuard

Automatically verifies JWT tokens and extracts user information.

#### OrganizationAuthGuard

Extends `ClerkAuthGuard` to also fetch and include organizational details from Clerk. This guard:

- Verifies JWT tokens and extracts user information
- Fetches organization details if the user has an `organizationId`
- Attaches organization information to the request user object
- Gracefully handles cases where organization fetch fails or user has no organization

#### RolesGuard

Checks if the authenticated user has the required roles.

### Example Implementation

#### Basic Authentication Example

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RolesEnum } from "../auth/enums/roles.enum";
import { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";

@Controller("api-management")
@Injectable()
@Roles(RolesEnum.ADMIN)
@UseGuards(ClerkAuthGuard, RolesGuard)
export class APIManagementController {
  constructor(private readonly authService: AuthService) {}

  @Post("third-party-api-keys")
  public async createThirdPartyAPIKey(
    @CurrentUser() curUser: AuthenticatedUser,
    @Body() data: CreateThirdPartyAPIKeyDto
  ): Promise<CreateThirdPartyAPIKeyResponse> {
    // Your business logic here
    return {
      token: "generated_token",
      info: {
        /* ... */
      },
    };
  }

  @Get("third-party-api-keys")
  public async getThirdPartyAPIKeys(
    @CurrentUser() curUser: AuthenticatedUser
  ): Promise<ThirdPartyAPIKey[]> {
    // Your business logic here
    return [];
  }
}
```

#### Organization-Aware Authentication Example

```typescript
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
import { CurrentUserWithOrg } from "../auth/decorators/current-user-with-org.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { OrganizationAuthGuard } from "../auth/guards/organization-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RolesEnum } from "../auth/enums/roles.enum";
import { AuthenticatedUserWithOrganization } from "../auth/guards/organization-auth.guard";

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
  @Roles(RolesEnum.ORGANIZATION_ADMIN, RolesEnum.ADMIN)
  public async getOrganizationSettings(
    @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization
  ): Promise<any> {
    // Access organization details
    const orgId = user.organization?.id;
    const orgName = user.organization?.name;

    // Your business logic here
    return {
      organizationId: orgId,
      organizationName: orgName,
      settings: {
        // ... organization settings
      },
    };
  }
}
```

## Available Roles

- `USER`: Basic user role
- `ADMIN`: Administrator role
- `SUPER_ADMIN`: Super administrator role
- `MODERATOR`: Moderator role
- `ORGANIZATION_ADMIN`: Organization administrator role

## Authentication Flow

### Basic Authentication

1. Client sends request with Bearer token in Authorization header
2. `ClerkAuthGuard` extracts and verifies the JWT token
3. User information is attached to the request object
4. `RolesGuard` checks if user has required roles (if specified)
5. Request proceeds to the handler with authenticated user available via `@CurrentUser()`

### Organization-Aware Authentication

1. Client sends request with Bearer token in Authorization header
2. `OrganizationAuthGuard` extracts and verifies the JWT token
3. If user has an `organizationId`, organization details are fetched from Clerk
4. User information with organization details is attached to the request object
5. `RolesGuard` checks if user has required roles (if specified)
6. Request proceeds to the handler with authenticated user and organization available via `@CurrentUserWithOrg()`

## Error Handling

The guards will automatically throw appropriate exceptions:

- `UnauthorizedException`: When no token is provided or token is invalid
- `ForbiddenException`: When user doesn't have required roles

### OrganizationAuthGuard Error Handling

The `OrganizationAuthGuard` includes additional error handling:

- If organization fetch fails, the request still proceeds with user information (without organization details)
- A warning is logged when organization fetch fails
- Users without an `organizationId` can still access endpoints (organization will be `null`)

## Types and Interfaces

### AuthenticatedUserWithOrganization

This interface extends `AuthenticatedUser` to include organization details:

```typescript
export interface AuthenticatedUserWithOrganization extends AuthenticatedUser {
  organization?: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
  };
}
```

The organization object contains:

- `id`: Unique organization identifier
- `name`: Organization display name
- `slug`: URL-friendly organization identifier
- `imageUrl`: Organization logo/image URL (optional)
- `metadata`: Additional organization metadata (optional)

## Testing

For testing purposes, you can mock the `ClerkClient` provider or use the mock implementation provided in the example.
