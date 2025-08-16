import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUser, useOrganization} from "@clerk/clerk-react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Calendar, ClipboardList, FileText, Settings} from "lucide-react";
import {DashboardCharts} from "./components/DashboardMetrics";
import {getServiceDistributionByCategory} from "@/lib/serviceStats";
import type {Department, Service} from "@/lib/types";

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
	const {user} = useUser();
	const {organization, isLoaded: orgIsLoaded} = useOrganization();

	const [loading, setLoading] = useState(true);
	const [departmentName, setDepartmentName] = useState<string>("");
	const [summary, setSummary] = useState({
		totalServices: 0,
		activeServices: 0,
		pendingDocuments: 0,
		upcomingAppointments: 0,
		totalAppointments: 0,
	});
	const [serviceData, setServiceData] = useState<any[]>([]);
	const [statusData, setStatusData] = useState<any[]>([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				if (!organization) return;

				// Use the provided token
				const token =
					"eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18zMUNhM1lqaUduYkd5OFUzVVFscGRFb3ZjeHAiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NTYxODM3MzQsImlhdCI6MTc1NTE4MzczNCwiaXNzIjoiaHR0cHM6Ly9icmF2ZS1ndXBweS01OS5jbGVyay5hY2NvdW50cy5kZXYiLCJqdGkiOiJjYWViMDdjMjZjZTMxZTEyMWIwNCIsIm5iZiI6MTc1NTE4MzcyOSwib3JnX2lkIjoib3JnXzMxQ3R6bzdvWTZOVXU1SDZJeWxQS0Nmd1hWdCIsIm9yZ19wZXJtaXNzaW9ucyI6W10sIm9yZ19yb2xlIjoib3JnOmFkbWluIiwib3JnX3NsdWciOiJkZXBhcnRtZW50LW1vdG9yLXRyYWZmaWMiLCJzdWIiOiJ1c2VyXzMxSFJsOTRHZm44SjZibmVxTVMxWjF2NVo1YSJ9.FZQcUA3RKwF5YAqdjJ_1mftQI4sJXYoIDToVwB8XyT1EKNmW5vPn4q31JVK3iULmgv7lz7_VdpEhq81zXiRJIYRp2Dr2wCImY_KY-euTreG6fo-WZVz9Gqpj3jcXP8VCTWbty2eszqsN5ETNcVvySM9v3PvX6J8X9jC0t3wJNBFuY3J8e7i6Dfs_YYQSBnlMrkS2m55ghk6tOrnYHShhea7uWqqAZdZs8vX2p6AjA6YMRHChxavvRyE8x4R1pFSM4J6eJokaFt29pKDEumdTz5D8ecLnnLWKxJNK84y73VwnTZAp98zQ9ZxvI13haMRHTW4kvZRb9HgIjQCxuBchVg";

				// 1️⃣ Find department by Clerk orgId
				const department = await fetchUserDepartment(organization.id);
				if (!department) {
					console.error("No department found for Clerk org:", organization.id);
					setLoading(false);
					return;
				}
				setDepartmentName(department.name);

				// 2️⃣ Fetch department details including services
				const deptRes = await fetch(
					`http://localhost:3000/api/departments/${department.department_id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (!deptRes.ok) throw new Error("Failed to fetch department details");

				const deptData: Department & {services: Service[]} =
					await deptRes.json();
				const totalServices = deptData.services?.length || 0;

				setSummary((prev) => ({
					...prev,
					totalServices,
				}));

				// 3️⃣ Chart: service distribution by category
				const categoryDistribution = getServiceDistributionByCategory(
					deptData.services || []
				);
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

				// 4️⃣ Fetch all organization appointments
				const orgAppointmentsRes = await fetch(
					"http://localhost:3000/api/appointments/organization",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (!orgAppointmentsRes.ok)
					throw new Error("Failed to fetch org appointments");

				const orgAppointments: any[] = await orgAppointmentsRes.json();

				// Filter appointments by department_id
				const deptAppointments = orgAppointments.filter(
					(appt) =>
						appt.service?.department?.department_id === department.department_id
				);

				// Count status for charts
				const statusCounts: Record<string, number> = {
					pending: 0,
					confirmed: 0,
					completed: 0,
					cancelled: 0,
					draft: 0,
				};
				deptAppointments.forEach((a) => {
					const status = a.appointment_status || "pending";
					if (statusCounts[status] !== undefined) {
						statusCounts[status]++;
					}
				});

				setStatusData([
					{name: "Confirmed", value: statusCounts.confirmed, color: "#82ca9d"},
					{name: "Pending", value: statusCounts.pending, color: "#ffc658"},
					{name: "Cancelled", value: statusCounts.cancelled, color: "#ff8042"},
					{name: "Completed", value: statusCounts.completed, color: "#8884d8"},
				]);

				// 🔹 Update summary (excluding drafts for total appointments)
				setSummary((prev) => ({
					...prev,
					totalAppointments: deptAppointments.filter(
						(a) => a.appointment_status !== "draft"
					).length,
					upcomingAppointments: statusCounts.pending + statusCounts.confirmed,
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
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">
								Total Services
							</CardTitle>
							<ClipboardList className="h-6 w-6" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{summary.totalServices}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">
								Total Appointments
							</CardTitle>
							<ClipboardList className="h-6 w-6" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{summary.totalAppointments}
							</div>
						</CardContent>
					</Card>

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
							<CardDescription>
								Add, edit, or deactivate services
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ClipboardList className="h-6 w-6" />
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								onClick={() => navigate("/service-admin/services")}>
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
								onClick={() => navigate("/service-admin/documents")}>
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
								onClick={() => navigate("/service-admin/appointments")}>
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
								onClick={() => navigate("/service-admin/settings")}>
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
