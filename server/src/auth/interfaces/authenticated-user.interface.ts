export interface AuthenticatedUser {
  accountId: string;
  organizationId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}
