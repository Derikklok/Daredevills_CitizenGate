import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useOrganization, useAuth } from "@clerk/clerk-react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, FileText, Settings } from "lucide-react";
import { DashboardCharts } from "./components/DashboardMetrics";
import { fetchDepartmentAppointments } from "@/lib/serviceApi";
import { getServiceDistributionByCategory } from "@/lib/serviceStats";
import type { Department, Service } from "@/lib/types";

// 🔹 Helper: fetch department by Clerk orgId
const fetchUserDepartment = async (
  clerkOrgId: string
): Promise<Department | null> => {
  try {
    const res = await fetch("http://localhost:3000/api/departments");
    if (!res.ok) throw new Error("Failed to fetch departments");

    const departments: Department[] = await res.json();
    return departments.find((dep) => dep.clerk_org_id === clerkOrgId) || null;
  } catch (err) {
    console.error("Error fetching department:", err);
    return null;
  }
};

const ServiceAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { organization, isLoaded: orgIsLoaded } = useOrganization();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [summary, setSummary] = useState({
    totalServices: 0,
    activeServices: 0,
    pendingDocuments: 0, // 🔹 you can hook this to real API later
    upcomingAppointments: 0,
  });
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!organization) return;
        const token = await getToken();

        // 1. Find department by orgId
        const department = await fetchUserDepartment(organization.id);
        if (!department) {
          console.error("No department found for Clerk org:", organization.id);
          setLoading(false);
          return;
        }
        setDepartmentName(department.name);

        // 2. Fetch department details including services
        const deptRes = await fetch(
          `http://localhost:3000/api/departments/${department.department_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!deptRes.ok) throw new Error("Failed to fetch department details");

        const deptData: Department & { services: Service[] } =
          await deptRes.json();

        const totalServices = deptData.services?.length || 0;
        // 🔹 Adjust if you add "status" field in services table
       

        setSummary((prev) => ({
          ...prev,
          totalServices,
          
        }));

        // 3. Chart: distribution by category
        const categoryDistribution =
          getServiceDistributionByCategory(deptData.services || []);
        setServiceData(
          categoryDistribution.map((item, index) => ({
            ...item,
            color: [
              "#8884d8",
              "#82ca9d",
              "#ffc658",
              "#ff8042",
              "#0088FE",
              "#00C49F",
            ][index % 6],
          }))
        );

        // 4. Fetch appointments
        const appointmentsData = await fetchDepartmentAppointments(
          department.department_id,
          token!
        );

        const statusCounts: Record<string, number> = {
          Confirmed: 0,
          Pending: 0,
          Cancelled: 0,
          Completed: 0,
        };
        appointmentsData.forEach((a: any) => {
          const status = a.status || "Pending";
          if (statusCounts[status] !== undefined) {
            statusCounts[status]++;
          }
        });

        setStatusData([
          { name: "Confirmed", value: statusCounts.Confirmed, color: "#82ca9d" },
          { name: "Pending", value: statusCounts.Pending, color: "#ffc658" },
          { name: "Cancelled", value: statusCounts.Cancelled, color: "#ff8042" },
          { name: "Completed", value: statusCounts.Completed, color: "#8884d8" },
        ]);

        setSummary((prev) => ({
          ...prev,
          upcomingAppointments: statusCounts.Confirmed + statusCounts.Pending,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [organization]);

  if (loading || !orgIsLoaded) {
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
          <h1 className="text-3xl font-bold text-gray-800">
            Service Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || "User"}! Manage services for{" "}
            {organization ? organization.name : departmentName}.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Services */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Services
              </CardTitle>
              <ClipboardList className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalServices}</div>
              
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Appointments
              </CardTitle>
              <ClipboardList className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
              
            </CardContent>
          </Card>

          {/* Pending Docs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Pending Documents
              </CardTitle>
              <FileText className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.pendingDocuments}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.upcomingAppointments}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
        <DashboardCharts serviceData={serviceData} statusData={statusData} />

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
          Quick Actions
        </h2>
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
              <CardDescription>
                Define required documents for services
              </CardDescription>
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
              <CardDescription>
                View and manage upcoming appointments
              </CardDescription>
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
              <CardDescription>
                Configure service admin preferences
              </CardDescription>
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
