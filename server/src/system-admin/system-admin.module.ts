import { Module } from "@nestjs/common";
import { SystemAdminController } from "./system-admin.controller";
import { SystemAdminService } from "./system-admin.service";

@Module({
  controllers: [SystemAdminController],
  providers: [SystemAdminService],
})
export class SystemAdminModule {}
