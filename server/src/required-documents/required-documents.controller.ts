import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RequiredDocumentsService } from './required-documents.service';
import { RequiredDocument } from './required-document.entity';

@Controller('required-documents')
export class RequiredDocumentsController {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) {}

  @Post()
  create(@Body() body: Partial<RequiredDocument>) {
    return this.requiredDocumentsService.create(body);
  }

  @Post('batch')
  createMany(@Body() bodies: Partial<RequiredDocument>[]) {
    return this.requiredDocumentsService.createMany(bodies);
  }

  @Get()
  findAll(@Query('service_id') serviceId?: string) {
    if (serviceId) {
      return this.requiredDocumentsService.findByService(serviceId);
    }
    return this.requiredDocumentsService.findAll();
  }

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.requiredDocumentsService.findByService(serviceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requiredDocumentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<RequiredDocument>) {
    return this.requiredDocumentsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requiredDocumentsService.remove(id);
  }
}
