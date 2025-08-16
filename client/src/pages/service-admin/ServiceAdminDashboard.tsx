import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useOrganization } from "@clerk/clerk-react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, FileText, Settings } from "lucide-react";
import { DashboardCharts } from "./components/DashboardMetrics";
import { fetchDepartmentServices, fetchDepartmentAppointments } from "@/lib/serviceApi";
import { getServiceDistributionByCategory } from "@/lib/serviceStats";
import type { GovernmentService, Appointment } from "@/lib/types";

// No custom icon functions needed - using lucide-react icons directly

// Types
interface ServiceSummary {
  totalServices: number;
  activeServices: number;
  pendingDocuments: number;
  upcomingAppointments: number;
}

const ServiceAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [summary, setSummary] = useState<ServiceSummary>({
    totalServices: 0,
    activeServices: 0,
    pendingDocuments: 0,
    upcomingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const departmentId = user?.publicMetadata?.departmentId;
        
        // If we have an organization from Clerk, use its name
        if (organization) {
          setDepartmentName(organization.name);
        }
        
        if (departmentId) {
          // Fetch real data from API
          const servicesData = await fetchDepartmentServices(departmentId as number);
          
          // Set department name from the first service if available
          if (servicesData.length > 0 && servicesData[0].department?.name) {
            setDepartmentName(servicesData[0].department.name);
          } else {
            setDepartmentName(user?.publicMetadata?.departmentName as string || "Your Department");
          }
          
          // Calculate service summary
          const activeServices = servicesData.filter((s: GovernmentService) => s.status === "active").length;
          setSummary({
            totalServices: servicesData.length,
            activeServices: activeServices,
            pendingDocuments: 24, // Placeholder
            upcomingAppointments: 15 // Placeholder
          });
          
          // Generate chart data based on real services
          const categoryDistribution = getServiceDistributionByCategory(servicesData);
          setServiceData(categoryDistribution.map((item: { name: string, value: number }, index: number) => ({
            name: item.name,
            value: item.value,
            color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'][index % 6]
          })));
          
          // Try to fetch appointments data
          try {
            const appointmentsData = await fetchDepartmentAppointments(departmentId as number);
            
            // Set status data based on real appointments
            const statusCounts: Record<string, number> = {
              Confirmed: 0,
              Pending: 0,
              Cancelled: 0,
              Completed: 0
            };
            
            appointmentsData.forEach((appointment: any) => {
              const status = appointment.status || "Pending";
              if (status in statusCounts) {
                statusCounts[status]++;
              }
            });
            
            setStatusData([
              { name: "Confirmed", value: statusCounts.Confirmed, color: "#82ca9d" },
              { name: "Pending", value: statusCounts.Pending, color: "#ffc658" },
              { name: "Cancelled", value: statusCounts.Cancelled, color: "#ff8042" },
              { name: "Completed", value: statusCounts.Completed, color: "#8884d8" }
            ]);
          } catch (err) {
            console.error("Error fetching appointments:", err);
            
            // Use placeholder data for appointments
            setStatusData([
              { name: "Confirmed", value: 15, color: "#82ca9d" },
              { name: "Pending", value: 10, color: "#ffc658" },
              { name: "Cancelled", value: 5, color: "#ff8042" },
              { name: "Completed", value: 20, color: "#8884d8" }
            ]);
          }
        } else {
          // Fallback to mock data if no department ID is available
          setDepartmentName(user?.publicMetadata?.departmentName as string || "Your Department");
          setSummary({
            totalServices: 12,
            activeServices: 8,
            pendingDocuments: 24,
            upcomingAppointments: 15
          });
          
          setServiceData([
            { name: "Passport Application", value: 40, color: "#8884d8" },
            { name: "Passport Renewal", value: 30, color: "#82ca9d" },
            { name: "Visa Application", value: 20, color: "#ffc658" },
            { name: "ID Card", value: 10, color: "#ff8042" }
          ]);
          
          setStatusData([
            { name: "Confirmed", value: 15, color: "#82ca9d" },
            { name: "Pending", value: 10, color: "#ffc658" },
            { name: "Cancelled", value: 5, color: "#ff8042" },
            { name: "Completed", value: 20, color: "#8884d8" }
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, organization]);

  if (loading) {
    return (
      <ServiceAdminLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </ServiceAdminLayout>
    );
  }

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Service Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || "User"}! 
            Manage services for {organization ? organization.name : departmentName}.
          </p>
          {organization && (
            <p className="text-sm text-gray-500 mt-1">
              Organization ID: {organization.id}
            </p>
          )}
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <ClipboardList className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalServices}</div>
              <p className="text-xs text-gray-500">
                {summary.activeServices} active, {summary.totalServices - summary.activeServices} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <ClipboardList className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeServices}</div>
              <p className="text-xs text-gray-500">
                {Math.round((summary.activeServices / summary.totalServices) * 100)}% of total services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
              <FileText className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pendingDocuments}</div>
              <p className="text-xs text-gray-500">Documents awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.upcomingAppointments}</div>
              <p className="text-xs text-gray-500">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Charts */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
        <DashboardCharts serviceData={serviceData} statusData={statusData} />

        {/* Quick Action Cards */}
        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>Add, edit, or deactivate services</CardDescription>
            </CardHeader>
            <CardContent>
              <ClipboardList className="h-6 w-6" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/service-admin/services")}
              >
                View Services
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
              <CardDescription>Define required documents for services</CardDescription>
            </CardHeader>
            <CardContent>
              <FileText className="h-6 w-6" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/service-admin/documents")}
              >
                Manage Documents
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>View and manage upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar className="h-6 w-6" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/service-admin/appointments")}
              >
                View Appointments
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure service admin preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Settings className="h-6 w-6" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/service-admin/settings")}
              >
                Service Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceAdminDashboard;
