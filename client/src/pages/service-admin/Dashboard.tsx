import { useState, useEffect } from "react";
import { useUser, useAuth, useOrganization } from "@clerk/clerk-react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCharts } from "./components/DashboardMetrics";
import {
  fetchDepartmentServices,
  fetchDepartmentAppointments,
} from "@/lib/serviceApi";
import type { GovernmentService, Appointment } from "@/lib/types";
import { getServiceDistributionByCategory } from "@/lib/serviceStats";

const ServiceAdminDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { organization, isLoaded: orgIsLoaded } = useOrganization();
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orgIsLoaded || !organization) return;

        setDepartmentName(organization.name);

        // Determine the department ID from user metadata or Clerk org ID
        const departmentId =
          user?.publicMetadata?.departmentId || organization.id;

        // Fetch services for the organization/department
        const servicesData = await fetchDepartmentServices(departmentId as string | number);
        setServices(servicesData);

        // Fetch appointments for the department
        const token = await getToken();
        if (token) {
          const appointmentsData = await fetchDepartmentAppointments(departmentId as string | number, token);
          setAppointments(appointmentsData);
        } else {
          console.warn("No authentication token available for fetching appointments");
          setAppointments([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, organization, orgIsLoaded, getToken]);

  const getServiceMetrics = () => {
    const active = services.filter((s) => s.status === "active").length;
    const inactive = services.filter((s) => s.status === "inactive").length;
    const total = services.length;

    return { active, inactive, total, activePercent: total ? Math.round((active / total) * 100) : 0 };
  };

  const getAppointmentMetrics = () => {
    const scheduled = appointments.filter((a) => a.status === "scheduled").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    const total = appointments.length;

    return { scheduled, completed, cancelled, total, completionRate: total ? Math.round((completed / total) * 100) : 0 };
  };

  const serviceMetrics = getServiceMetrics();
  const appointmentMetrics = getAppointmentMetrics();
  const serviceCategories = getServiceDistributionByCategory(services);

  if (loading || !orgIsLoaded) {
    return (
      <ServiceAdminLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-10">Loading dashboard data...</div>
        </div>
      </ServiceAdminLayout>
    );
  }

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Overview for <span className="font-medium">{departmentName}</span>
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Services</CardDescription>
              <CardTitle className="text-4xl">{serviceMetrics.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {serviceMetrics.active} active ({serviceMetrics.activePercent}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Appointments</CardDescription>
              <CardTitle className="text-4xl">{appointmentMetrics.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {appointmentMetrics.scheduled} scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-4xl">{appointmentMetrics.completionRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {appointmentMetrics.completed} completed appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Service Categories</CardDescription>
              <CardTitle className="text-4xl">{serviceCategories.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Diverse service offerings</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <DashboardCharts
          serviceData={serviceCategories.map((item, index) => ({
            name: item.name,
            value: item.value,
            color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"][index % 6],
          }))}
          statusData={
            appointments.length > 0
              ? [
                  { name: "Scheduled", value: appointmentMetrics.scheduled, color: "#0088FE" },
                  { name: "Completed", value: appointmentMetrics.completed, color: "#00C49F" },
                  { name: "Cancelled", value: appointmentMetrics.cancelled, color: "#FF8042" },
                ]
              : [{ name: "No Data", value: 0, color: "#8884d8" }]
          }
        />
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceAdminDashboard;
