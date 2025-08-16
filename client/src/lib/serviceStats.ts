import type { GovernmentService, Appointment } from './types';

/**
 * Calculate service distribution by category
 * @param services List of government services
 * @returns Array of objects with category name and count
 */
export const getServiceDistributionByCategory = (services: GovernmentService[]) => {
  const distribution: Record<string, number> = {};
  
  services.forEach(service => {
    const category = service.category || 'Uncategorized';
    distribution[category] = (distribution[category] || 0) + 1;
  });
  
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Calculate service status distribution
 * @param services List of government services
 * @returns Array of objects with status name and count
 */
export const getServiceStatusDistribution = (services: GovernmentService[]) => {
  const activeCount = services.filter(service => service.status === 'active').length;
  const inactiveCount = services.filter(service => service.status === 'inactive').length;
  
  return [
    { name: 'Active', value: activeCount },
    { name: 'Inactive', value: inactiveCount }
  ];
};

/**
 * Calculate appointment status distribution
 * @param appointments List of appointments
 * @returns Array of objects with status name and count
 */
export const getAppointmentStatusDistribution = (appointments: Appointment[]) => {
  const statusCounts: Record<string, number> = {};
  
  appointments.forEach(appointment => {
    const status = appointment.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Calculate appointment count by service
 * @param appointments List of appointments
 * @param services List of government services
 * @returns Array of objects with service name and appointment count
 */
export const getAppointmentsByService = (appointments: Appointment[], services: GovernmentService[]) => {
  const serviceMap: Record<string, number> = {};
  const serviceNameMap: Record<string, string> = {};
  
  // Create service ID to name mapping
  services.forEach(service => {
    serviceNameMap[service.service_id] = service.name;
  });
  
  // Count appointments by service
  appointments.forEach(appointment => {
    if (appointment.service_id) {
      serviceMap[appointment.service_id] = (serviceMap[appointment.service_id] || 0) + 1;
    }
  });
  
  // Convert to chart data format
  return Object.entries(serviceMap).map(([serviceId, count]) => ({
    name: serviceNameMap[serviceId] || `Service ${serviceId}`,
    count
  }));
};

/**
 * Get the most popular services based on appointment count
 * @param appointments List of appointments
 * @param services List of government services
 * @param limit Number of services to return
 * @returns Array of top services with their appointment counts
 */
export const getTopServices = (
  appointments: Appointment[], 
  services: GovernmentService[], 
  limit: number = 5
) => {
  const serviceAppointments = getAppointmentsByService(appointments, services);
  
  return serviceAppointments
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
