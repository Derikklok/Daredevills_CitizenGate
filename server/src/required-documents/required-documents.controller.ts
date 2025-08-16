import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RequiredDocumentsService } from './required-documents.service';
import { RequiredDocument } from './required-document.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRequiredDocumentDto } from './dto/create-required-document.dto';
import { UpdateRequiredDocumentDto } from './dto/update-required-document.dto';

@ApiTags('Required Documents')
@ApiBearerAuth()
@Controller('required-documents')
export class RequiredDocumentsController {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a required document' })
  @ApiResponse({ status: 201, type: RequiredDocument })
  create(@Body() body: CreateRequiredDocumentDto) {
    return this.requiredDocumentsService.create(body);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create multiple required documents' })
  @ApiResponse({ status: 201, type: [RequiredDocument] })
  createMany(@Body() bodies: CreateRequiredDocumentDto[]) {
    return this.requiredDocumentsService.createMany(bodies);
  }

  @Get()
  @ApiOperation({ summary: 'List all required documents or filter by service' })
  @ApiQuery({ name: 'service_id', required: false, type: String })
  @ApiResponse({ status: 200, type: [RequiredDocument] })
  findAll(@Query('service_id') serviceId?: string) {
    if (serviceId) {
      return this.requiredDocumentsService.findByService(serviceId);
    }
    return this.requiredDocumentsService.findAll();
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Find documents by service ID' })
  @ApiParam({ name: 'serviceId', type: String })
  @ApiResponse({ status: 200, type: [RequiredDocument] })
  findByService(@Param('serviceId') serviceId: string) {
    return this.requiredDocumentsService.findByService(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a required document by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: RequiredDocument })
  findOne(@Param('id') id: string) {
    return this.requiredDocumentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a required document' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: RequiredDocument })
  update(@Param('id') id: string, @Body() body: UpdateRequiredDocumentDto) {
    return this.requiredDocumentsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a required document' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  remove(@Param('id') id: string) {
    return this.requiredDocumentsService.remove(id);
  }
}
