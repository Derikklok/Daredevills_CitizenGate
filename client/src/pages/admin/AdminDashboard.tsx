import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Cog, Users, FileText, Building2} from "lucide-react";
import AdminLayout from "./components/AdminLayout";

const AdminDashboard = () => {
	const navigate = useNavigate();

	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">System Admin Dashboard</h1>
					<p className="text-gray-600">Manage and monitor the CitizenGate platform</p>
				</div>

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
					<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
						<div className="flex items-start mb-4">
							<div className="p-3 bg-amber-100 rounded-lg">
								<FileText className="h-6 w-6 text-amber-600" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2">Reports</h3>
						<p className="text-gray-500 mb-4">
							Access analytics and generate reports
						</p>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => navigate("/admin/reports")}>
							View Reports
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
