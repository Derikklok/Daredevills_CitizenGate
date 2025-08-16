import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { GovernmentService } from '../government-services/government-service.entity';
import { Department } from '../departments/department.entity';
import { ServiceAvailability } from '../service-availability/service-availability.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(GovernmentService)
    private serviceRepository: Repository<GovernmentService>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async getPeakHours() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('EXTRACT(HOUR FROM appointment.appointment_time)', 'hour')
      .addSelect('COUNT(*)', 'booking_count')
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return result.map(row => ({
      hour: parseInt(row.hour),
      booking_count: parseInt(row.booking_count)
    }));
  }

  async getDepartmentalWorkload() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .leftJoin('service.department', 'department')
      .select('department.name', 'department_name')
      .addSelect('department.department_id', 'department_id')
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'pending')`,
        'pending'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'completed')`,
        'completed'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'cancelled')`,
        'cancelled'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'no_show')`,
        'no_show'
      )
      .addSelect('COUNT(*)', 'total')
      .groupBy('department.department_id, department.name')
      .orderBy('department.department_id', 'ASC')
      .getRawMany();

    return result.map(row => ({
      department_name: row.department_name,
      department_id: parseInt(row.department_id),
      pending: parseInt(row.pending) || 0,
      completed: parseInt(row.completed) || 0,
      cancelled: parseInt(row.cancelled) || 0,
      no_show: parseInt(row.no_show) || 0,
      total: parseInt(row.total) || 0
    }));
  }

  async getNoShowAnalysis() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select(`
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(appointment.birth_date)) BETWEEN 18 AND 25 THEN '18-25'
          WHEN EXTRACT(YEAR FROM AGE(appointment.birth_date)) BETWEEN 26 AND 35 THEN '26-35'
          WHEN EXTRACT(YEAR FROM AGE(appointment.birth_date)) BETWEEN 36 AND 45 THEN '36-45'
          WHEN EXTRACT(YEAR FROM AGE(appointment.birth_date)) BETWEEN 46 AND 55 THEN '46-55'
          WHEN EXTRACT(YEAR FROM AGE(appointment.birth_date)) BETWEEN 56 AND 65 THEN '56-65'
          ELSE '65+'
        END
      `, 'age_group')
      .addSelect('appointment.gender', 'gender')
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'no_show')`,
        'no_show_count'
      )
      .addSelect('COUNT(*)', 'total')
      .groupBy('age_group, appointment.gender')
      .getRawMany();

    return result.map(row => ({
      age_group: row.age_group,
      gender: row.gender,
      no_show_count: parseInt(row.no_show_count) || 0,
      total: parseInt(row.total) || 0,
      no_show_rate: row.total > 0 ? ((row.no_show_count || 0) / row.total * 100).toFixed(2) : '0.00'
    }));
  }

  async getProcessingTimes() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .select('service.service_id', 'service_id')
      .addSelect('service.name', 'service_name')
      .addSelect(
        'AVG(EXTRACT(EPOCH FROM (appointment.updated_at - appointment.created_at))/3600)',
        'avg_processing_hours'
      )
      .where(`appointment.appointment_status = 'completed'`)
      .groupBy('service.service_id, service.name')
      .getRawMany();

    return result.map(row => ({
      service_id: row.service_id,
      service_name: row.service_name,
      avg_processing_hours: parseFloat(parseFloat(row.avg_processing_hours || 0).toFixed(2))
    }));
  }

  async getOverview() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('COUNT(*)', 'total_appointments')
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'completed')`,
        'completed'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'no_show')`,
        'no_show'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'cancelled')`,
        'cancelled'
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE appointment.appointment_status = 'pending')`,
        'pending'
      )
      .getRawOne();

    return {
      total_appointments: parseInt(result.total_appointments) || 0,
      completed: parseInt(result.completed) || 0,
      no_show: parseInt(result.no_show) || 0,
      cancelled: parseInt(result.cancelled) || 0,
      pending: parseInt(result.pending) || 0,
      completion_rate: result.total_appointments > 0 
        ? ((result.completed / result.total_appointments) * 100).toFixed(2)
        : '0.00',
      no_show_rate: result.total_appointments > 0 
        ? ((result.no_show / result.total_appointments) * 100).toFixed(2)
        : '0.00'
    };
  }

  async getAppointmentTrends(days: number = 30) {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('DATE(appointment.created_at)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where(`appointment.created_at >= NOW() - INTERVAL '${days} days'`)
      .groupBy('DATE(appointment.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      count: parseInt(row.count)
    }));
  }
}
