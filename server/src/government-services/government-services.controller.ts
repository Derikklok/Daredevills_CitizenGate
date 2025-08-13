import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GovernmentServicesService } from './government-services.service';
import { GovernmentService } from './government-service.entity';
import { GovernmentServiceCreateDto } from './dto/government-service.create.dto';
import { AuthenticatedUserWithOrganization, OrganizationAuthGuard } from 'src/auth/guards/organization-auth.guard';
import { CurrentUserWithOrg } from 'src/auth/decorators/current-user-with-org.decorator';
import { GovernmentServiceUpdateDto } from './dto/government-service.update.dto';

@Controller('government-services')
export class GovernmentServicesController {
  constructor(private readonly governmentServicesService: GovernmentServicesService) { }

  @Get()
  findAll() {
    return this.governmentServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.governmentServicesService.findOne(id);
  }

  @Post()
  @UseGuards(OrganizationAuthGuard)
  async create(@CurrentUserWithOrg() user: AuthenticatedUserWithOrganization, @Body() body: GovernmentServiceCreateDto) {
    if (!user.organization?.id) {
      throw new Error('User must be associated with an organization to create government services');
    }
    return await this.governmentServicesService.create(body, user.organization.id);
  }

  @Put(':id')
  @UseGuards(OrganizationAuthGuard)
  update(@Param('id') id: string, @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization, @Body() body: GovernmentServiceUpdateDto) {
    if (!user.organization?.id) {
      throw new Error('User must be associated with an organization to update government services');
    }
    return this.governmentServicesService.update(id, body, user.organization.id);
  }

  @Delete(':id')
  @UseGuards(OrganizationAuthGuard)
  remove(@Param('id') id: string, @CurrentUserWithOrg() user: AuthenticatedUserWithOrganization) {
    if (!user.organization?.id) {
      throw new Error('User must be associated with an organization to delete government services');
    }
    return this.governmentServicesService.remove(id, user.organization.id);
  }
}
