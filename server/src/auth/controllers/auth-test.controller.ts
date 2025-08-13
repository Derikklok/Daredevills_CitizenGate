import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Auth Test')
@Controller('auth-test')
export class AuthTestController {
  @Get('public')
  @ApiOperation({ summary: 'Public endpoint - no auth required' })
  @ApiResponse({ status: 200, description: 'Public endpoint accessible to everyone' })
  getPublic() {
    return {
      message: 'This is a public endpoint',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('protected')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Protected endpoint - requires authentication' })
  @ApiResponse({ status: 200, description: 'Protected endpoint accessible to authenticated users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  getProtected(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'This is a protected endpoint',
      user: {
        accountId: user.accountId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('admin-only')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Admin only endpoint' })
  @ApiResponse({ status: 200, description: 'Admin endpoint accessible to admin users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  getAdminOnly(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'This is an admin-only endpoint',
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('super-admin-only')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Super admin only endpoint' })
  @ApiResponse({ status: 200, description: 'Super admin endpoint accessible to super admin users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  getSuperAdminOnly(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'This is a super admin-only endpoint',
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('user-info')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get current user information and roles' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  getUserInfo(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'User information retrieved successfully',
      user: {
        accountId: user.accountId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        roles: user.roles,
        permissions: user.permissions,
        metadata: user.metadata,
      },
      availableRoles: Object.values(RolesEnum),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('debug-token')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Debug token payload and role mapping' })
  @ApiResponse({ status: 200, description: 'Token debug information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  debugToken(@CurrentUser() user: AuthenticatedUser, @Request() req: any) {
    return {
      message: 'Token debug information',
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
        organizationId: user.organizationId,
      },
      rawPayload: req.user?.rawPayload || 'No raw payload available',
      availableRoles: Object.values(RolesEnum),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('test-role')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Test endpoint for admin and super admin roles' })
  @ApiResponse({ status: 200, description: 'Role test successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiBearerAuth()
  testRole(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return {
      message: 'Role test successful',
      user: {
        accountId: user.accountId,
        email: user.email,
        roles: user.roles,
      },
      body,
      timestamp: new Date().toISOString(),
    };
  }
}
