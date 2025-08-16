import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { RolesEnum } from '../auth/enums/roles.enum';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(ClerkAuthGuard)
// TODO: Re-enable admin-only access once roles are properly configured
// @Roles(RolesEnum.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('peak-hours')
  @ApiOperation({ summary: 'Get peak booking hours' })
  @ApiResponse({
    status: 200,
    description: 'Returns booking count by hour of day',
    example: [
      { hour: 9, booking_count: 25 },
      { hour: 10, booking_count: 30 }
    ]
  })
  async getPeakHours() {
    return this.analyticsService.getPeakHours();
  }

  @Get('departmental-workload')
  @ApiOperation({ summary: 'Get departmental workload breakdown' })
  @ApiResponse({
    status: 200,
    description: 'Returns appointment counts by department and status',
    example: [
      {
        department_name: 'Department of Health',
        department_id: 1,
        pending: 10,
        completed: 50,
        cancelled: 5,
        no_show: 3,
        total: 68
      }
    ]
  })
  async getDepartmentalWorkload() {
    return this.analyticsService.getDepartmentalWorkload();
  }

  @Get('no-show-analysis')
  @ApiOperation({ summary: 'Get no-show analysis by demographics' })
  @ApiResponse({
    status: 200,
    description: 'Returns no-show statistics by age group and gender',
    example: [
      {
        age_group: '26-35',
        gender: 'Male',
        no_show_count: 5,
        total: 50,
        no_show_rate: '10.00'
      }
    ]
  })
  async getNoShowAnalysis() {
    return this.analyticsService.getNoShowAnalysis();
  }

  @Get('processing-times')
  @ApiOperation({ summary: 'Get average processing times by service' })
  @ApiResponse({
    status: 200,
    description: 'Returns average processing time for each service',
    example: [
      {
        service_id: 'uuid',
        service_name: 'Passport Renewal',
        avg_processing_hours: 24.5
      }
    ]
  })
  async getProcessingTimes() {
    return this.analyticsService.getProcessingTimes();
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overall system metrics' })
  @ApiResponse({
    status: 200,
    description: 'Returns high-level system statistics',
    example: {
      total_appointments: 500,
      completed: 400,
      no_show: 50,
      cancelled: 30,
      pending: 20,
      completion_rate: '80.00',
      no_show_rate: '10.00'
    }
  })
  async getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('appointment-trends')
  @ApiOperation({ summary: 'Get appointment booking trends over time' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to look back (default: 30)',
    example: 30
  })
  @ApiResponse({
    status: 200,
    description: 'Returns daily appointment counts for the specified period',
    example: [
      { date: '2024-01-01', count: 15 },
      { date: '2024-01-02', count: 20 }
    ]
  })
  async getAppointmentTrends(@Query('days') days?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getAppointmentTrends(numDays);
  }
}
