import {useNavigate, useLocation} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const AdminLayout = ({children}: {children: React.ReactNode}) => {
	const navigate = useNavigate();
	const location = useLocation();
	
	// Helper to determine if the current path matches
	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Admin Header */}
			<header className="bg-primary text-white py-4 px-6 shadow-md">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<h1 className="text-xl font-bold">CitizenGate Admin</h1>
						<nav className="hidden md:flex space-x-4">
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/admin") && "bg-white/20"
								)}
								onClick={() => navigate("/admin")}>
								Dashboard
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/admin/users") && "bg-white/20"
								)}
								onClick={() => navigate("/admin/users")}>
								Users
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/admin/departments") && "bg-white/20"
								)}
								onClick={() => navigate("/admin/departments")}>
								Departments
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/admin/reports") && "bg-white/20"
								)}
								onClick={() => navigate("/admin/reports")}>
								Reports
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/admin/settings") && "bg-white/20"
								)}
								onClick={() => navigate("/admin/settings")}>
								Settings
							</Button>
						</nav>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							className="text-white border-white hover:bg-white hover:text-primary"
							onClick={() => navigate("/")}>
							View Site
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">{children}</main>

			{/* Admin Footer */}
			<footer className="bg-gray-100 py-4 px-6 text-center border-t">
				<p className="text-sm text-gray-600">
					© {new Date().getFullYear()} CitizenGate Admin System
				</p>
			</footer>
		</div>
	);
};

export default AdminLayout;
