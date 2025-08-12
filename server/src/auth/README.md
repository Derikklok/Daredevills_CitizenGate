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

#### RolesGuard

Checks if the authenticated user has the required roles.

### Example Implementation

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

## Available Roles

- `USER`: Basic user role
- `ADMIN`: Administrator role
- `SUPER_ADMIN`: Super administrator role
- `MODERATOR`: Moderator role
- `ORGANIZATION_ADMIN`: Organization administrator role

## Authentication Flow

1. Client sends request with Bearer token in Authorization header
2. `ClerkAuthGuard` extracts and verifies the JWT token
3. User information is attached to the request object
4. `RolesGuard` checks if user has required roles (if specified)
5. Request proceeds to the handler with authenticated user available via `@CurrentUser()`

## Error Handling

The guards will automatically throw appropriate exceptions:

- `UnauthorizedException`: When no token is provided or token is invalid
- `ForbiddenException`: When user doesn't have required roles

## Testing

For testing purposes, you can mock the `ClerkClient` provider or use the mock implementation provided in the example.
