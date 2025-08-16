import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "./components/DashboardMetrics";
import { fetchDepartmentServices, fetchDepartmentAppointments } from "@/lib/serviceApi";
import type { GovernmentService, Appointment } from "@/lib/types";
import { getServiceDistributionByCategory } from "@/lib/serviceStats";

const ServiceAdminDashboard = () => {
  const { user } = useUser();
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState<string>("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentId = user?.publicMetadata?.departmentId;
        
        if (departmentId) {
          // Fetch services data
          const servicesData = await fetchDepartmentServices(departmentId as number);
          
          if (servicesData.length > 0 && servicesData[0].department?.name) {
            setDepartmentName(servicesData[0].department.name);
          } else {
            setDepartmentName(user?.publicMetadata?.departmentName as string || "Your Department");
          }
          
          setServices(servicesData);
          
          // Try to fetch appointments data
          try {
            const appointmentsData = await fetchDepartmentAppointments(departmentId as number);
            setAppointments(appointmentsData);
          } catch (err) {
            console.error("Error fetching appointments:", err);
            // If appointments fail to load, we'll just use empty array
            setAppointments([]);
          }
          
          setLoading(false);
        } else {
          // Mock data for development
          setDepartmentName("Department of Motor Vehicles");
          setServices([
            {
              service_id: "1",
              name: "Passport Application",
              description: "Apply for a new passport",
              department_id: 1,
              category: "Travel",
              status: "active",
              estimated_total_completion_time: "14 days",
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              department: {
                department_id: 1,
                name: "Department of Motor Vehicles",
                description: "Provide services to Motor Vehicles related services",
                address: "123 Government St, Capital City",
                contact_email: "dmv@gov.example",
                contact_phone: "555-1234",
                clerk_org_id: "org_123456789",
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
              },
            },
            {
              service_id: "2",
              name: "Passport Renewal",
              description: "Renew your existing passport",
              department_id: 1,
              category: "Travel",
              status: "active",
              estimated_total_completion_time: "7 days",
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              department: {
                department_id: 1,
                name: "Department of Motor Vehicles",
                description: "Provide services to Motor Vehicles related services",
                address: "123 Government St, Capital City",
                contact_email: "dmv@gov.example",
                contact_phone: "555-1234",
                clerk_org_id: "org_123456789",
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
              },
            },
            {
              service_id: "3",
              name: "Driver's License",
              description: "Apply for or renew a driver's license",
              department_id: 1,
              category: "Driving",
              status: "active",
              estimated_total_completion_time: "7 days",
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              department: {
                department_id: 1,
                name: "Department of Motor Vehicles",
                description: "Provide services to Motor Vehicles related services",
                address: "123 Government St, Capital City",
                contact_email: "dmv@gov.example",
                contact_phone: "555-1234",
                clerk_org_id: "org_123456789",
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
              },
            },
            {
              service_id: "4",
              name: "Vehicle Registration",
              description: "Register a new vehicle",
              department_id: 1,
              category: "Driving",
              status: "inactive",
              estimated_total_completion_time: "14 days",
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              department: {
                department_id: 1,
                name: "Department of Motor Vehicles",
                description: "Provide services to Motor Vehicles related services",
                address: "123 Government St, Capital City",
                contact_email: "dmv@gov.example",
                contact_phone: "555-1234",
                clerk_org_id: "org_123456789",
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
              },
            },
          ]);
          
          // Mock appointments
          setAppointments([
            {
              appointment_id: "1",
              service_id: "1",
              availability_id: "1",
              full_name: "John Doe",
              nic: "123456789",
              phone_number: "555-1234",
              address: "123 Main St",
              birth_date: "1990-01-01",
              gender: "Male",
              email: "john@example.com",
              appointment_time: "2025-01-15T10:00:00Z",
              appointment_status: "scheduled",
              status: "scheduled",
              notes: "",
              documents_submitted: [],
              reminders_sent: null,
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              service: {} as any,
              availability: {} as any
            },
            {
              appointment_id: "2",
              service_id: "2",
              availability_id: "2",
              full_name: "Jane Smith",
              nic: "987654321",
              phone_number: "555-5678",
              address: "456 Oak St",
              birth_date: "1985-05-15",
              gender: "Female",
              email: "jane@example.com",
              appointment_time: "2025-01-16T14:00:00Z",
              appointment_status: "completed",
              status: "completed",
              notes: "",
              documents_submitted: [],
              reminders_sent: null,
              created_at: "2025-01-02T00:00:00Z",
              updated_at: "2025-01-02T00:00:00Z",
              service: {} as any,
              availability: {} as any
            },
            {
              appointment_id: "3",
              service_id: "1",
              availability_id: "3",
              full_name: "Robert Johnson",
              nic: "456123789",
              phone_number: "555-9012",
              address: "789 Pine St",
              birth_date: "1978-11-30",
              gender: "Male",
              email: "robert@example.com",
              appointment_time: "2025-01-17T09:00:00Z",
              appointment_status: "cancelled",
              status: "cancelled",
              notes: "Customer rescheduled",
              documents_submitted: [],
              reminders_sent: null,
              created_at: "2025-01-03T00:00:00Z",
              updated_at: "2025-01-03T00:00:00Z",
              service: {} as any,
              availability: {} as any
            },
          ]);
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const getServiceMetrics = () => {
    const activeServices = services.filter(s => s.status === "active").length;
    const inactiveServices = services.filter(s => s.status === "inactive").length;
    const totalServices = services.length;
    
    return {
      active: activeServices,
      inactive: inactiveServices,
      total: totalServices,
      activePercent: totalServices ? Math.round((activeServices / totalServices) * 100) : 0
    };
  };
  
  const getAppointmentMetrics = () => {
    const scheduled = appointments.filter(a => a.status === "scheduled").length;
    const completed = appointments.filter(a => a.status === "completed").length;
    const cancelled = appointments.filter(a => a.status === "cancelled").length;
    const total = appointments.length;
    
    return {
      scheduled,
      completed,
      cancelled,
      total,
      completionRate: total ? Math.round((completed / total) * 100) : 0
    };
  };
  
  const serviceMetrics = getServiceMetrics();
  const appointmentMetrics = getAppointmentMetrics();
  
  // Prepare chart data
  const serviceCategories = getServiceDistributionByCategory(services);

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Overview for <span className="font-medium">{departmentName}</span>
          </p>
        </header>

        {loading ? (
          <div className="text-center py-10">Loading dashboard data...</div>
        ) : (
          <>
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
                  <p className="text-sm text-muted-foreground">
                    Diverse service offerings
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <DashboardCharts
              serviceData={serviceCategories.map((item, index) => ({
                name: item.name,
                value: item.value,
                color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]
              }))}
              statusData={appointments.length > 0 
                ? [
                    { name: "Scheduled", value: appointmentMetrics.scheduled, color: "#0088FE" },
                    { name: "Completed", value: appointmentMetrics.completed, color: "#00C49F" },
                    { name: "Cancelled", value: appointmentMetrics.cancelled, color: "#FF8042" }
                  ]
                : [{ name: "No Data", value: 0, color: "#8884d8" }]
              }
            />
            
            {/* Recent Activity - placeholder for future implementation */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your department</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Activity feed will be implemented soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceAdminDashboard;
