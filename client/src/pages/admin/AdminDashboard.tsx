import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {
	Cog,
	Users,
	FileText,
	Building2,
	TrendingUp,
	BarChart,
} from "lucide-react";
import AdminLayout from "./components/AdminLayout";
import {analyticsApi, type OverviewData} from "@/lib/analyticsApi";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const {getToken} = useAuth();
	const [overview, setOverview] = useState<OverviewData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadOverview();
	}, []);

	const loadOverview = async () => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("No authentication token available");
			}
			const data = await analyticsApi.getOverview(token);
			setOverview(data);
		} catch (error) {
			console.error("Failed to load overview:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">
						System Admin Dashboard
					</h1>
					<p className="text-gray-600">
						Manage and monitor the CitizenGate platform
					</p>
				</div>

				{/* Quick Analytics Overview */}
				{!loading && overview && overview.total_appointments > 0 && (
					<div className="mb-8">
						<h2 className="text-lg font-semibold mb-4 flex items-center">
							<TrendingUp className="h-5 w-5 mr-2" />
							Quick Analytics Overview
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Appointments</p>
										<p className="text-2xl font-bold text-blue-600">
											{overview.total_appointments}
										</p>
									</div>
									<BarChart className="h-8 w-8 text-blue-600" />
								</div>
							</Card>
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Completion Rate</p>
										<p className="text-2xl font-bold text-green-600">
											{overview.completion_rate}%
										</p>
									</div>
									<TrendingUp className="h-8 w-8 text-green-600" />
								</div>
							</Card>
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Pending</p>
										<p className="text-2xl font-bold text-yellow-600">
											{overview.pending}
										</p>
									</div>
									<Building2 className="h-8 w-8 text-yellow-600" />
								</div>
							</Card>
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">No-Show Rate</p>
										<p className="text-2xl font-bold text-red-600">
											{overview.no_show_rate}%
										</p>
									</div>
									<FileText className="h-8 w-8 text-red-600" />
								</div>
							</Card>
						</div>
						<div className="text-center">
							<Button
								onClick={() => navigate("/admin/reports")}
								className="mb-4">
								View Detailed Analytics →
							</Button>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* User Management Card */}
					<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
						<div className="flex items-start mb-4">
							<div className="p-3 bg-blue-100 rounded-lg">
								<Users className="h-6 w-6 text-blue-600" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2">User Management</h3>
						<p className="text-gray-500 mb-4">
							Manage user accounts, permissions, and roles
						</p>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => navigate("/admin/users")}>
							Manage Users
						</Button>
					</Card>

					{/* Department Management Card */}
					<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
						<div className="flex items-start mb-4">
							<div className="p-3 bg-green-100 rounded-lg">
								<Building2 className="h-6 w-6 text-green-600" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2">Departments</h3>
						<p className="text-gray-500 mb-4">
							Manage government departments and services
						</p>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => navigate("/admin/departments")}>
							Manage Departments
						</Button>
					</Card>

					{/* Reports Card */}
					<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200">
						<div className="flex items-start mb-4">
							<div className="p-3 bg-blue-100 rounded-lg">
								<TrendingUp className="h-6 w-6 text-blue-600" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2 text-blue-700">
							Analytics & Reports
						</h3>
						<p className="text-gray-500 mb-4">
							View comprehensive analytics, charts, and insights with
							interactive D3.js visualizations
						</p>
						<Button
							className="w-full bg-blue-600 hover:bg-blue-700"
							onClick={() => navigate("/admin/reports")}>
							<BarChart className="h-4 w-4 mr-2" />
							View Analytics Dashboard
						</Button>
					</Card>

					{/* System Settings Card */}
					<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
						<div className="flex items-start mb-4">
							<div className="p-3 bg-purple-100 rounded-lg">
								<Cog className="h-6 w-6 text-purple-600" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2">System Settings</h3>
						<p className="text-gray-500 mb-4">
							Configure system settings and preferences
						</p>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => navigate("/admin/settings")}>
							Manage Settings
						</Button>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminDashboard;
