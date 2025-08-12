import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedUserWithOrganization } from "../guards/organization-auth.guard";

export const CurrentUserWithOrg = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthenticatedUserWithOrganization => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
