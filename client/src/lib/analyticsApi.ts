import { getNormalizedApiUrl } from './apiUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedApiUrl = getNormalizedApiUrl(API_URL);

async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const response = await fetch(`${normalizedApiUrl}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

export interface PeakHoursData {
  hour: number;
  booking_count: number;
}

export interface DepartmentalWorkloadData {
  department_name: string;
  department_id: number;
  pending: number;
  completed: number;
  cancelled: number;
  no_show: number;
  total: number;
}

export interface NoShowAnalysisData {
  age_group: string;
  gender: string;
  no_show_count: number;
  total: number;
  no_show_rate: string;
}

export interface ProcessingTimesData {
  service_id: string;
  service_name: string;
  avg_processing_hours: number;
}

export interface OverviewData {
  total_appointments: number;
  completed: number;
  no_show: number;
  cancelled: number;
  pending: number;
  completion_rate: string;
  no_show_rate: string;
}

export interface AppointmentTrendsData {
  date: string;
  count: number;
}

export const analyticsApi = {
  async getPeakHours(token: string): Promise<PeakHoursData[]> {
    return apiRequest<PeakHoursData[]>('/analytics/peak-hours', token);
  },

  async getDepartmentalWorkload(token: string): Promise<DepartmentalWorkloadData[]> {
    return apiRequest<DepartmentalWorkloadData[]>('/analytics/departmental-workload', token);
  },

  async getNoShowAnalysis(token: string): Promise<NoShowAnalysisData[]> {
    return apiRequest<NoShowAnalysisData[]>('/analytics/no-show-analysis', token);
  },

  async getProcessingTimes(token: string): Promise<ProcessingTimesData[]> {
    return apiRequest<ProcessingTimesData[]>('/analytics/processing-times', token);
  },

  async getOverview(token: string): Promise<OverviewData> {
    return apiRequest<OverviewData>('/analytics/overview', token);
  },

  async getAppointmentTrends(token: string, days: number = 30): Promise<AppointmentTrendsData[]> {
    return apiRequest<AppointmentTrendsData[]>(`/analytics/appointment-trends?days=${days}`, token);
  },
};
