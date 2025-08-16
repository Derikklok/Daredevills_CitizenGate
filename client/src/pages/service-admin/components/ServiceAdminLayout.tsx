import {useNavigate, useLocation} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useOrganization} from "@clerk/clerk-react";

const ServiceAdminLayout = ({children}: {children: React.ReactNode}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const {organization} = useOrganization();

	// Helper to determine if the current path matches
	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Service Admin Header */}
			<header className="bg-[#460219] text-white py-4 px-6 shadow-md">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex flex-col">
							<h1 className="text-xl font-bold">CitizenGate Service Admin</h1>
							{organization && (
								<p className="text-xs text-white/80">{organization.name}</p>
							)}
						</div>
						<nav className="hidden md:flex space-x-4">
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/service-admin") && "bg-white/20"
								)}
								onClick={() => navigate("/service-admin")}>
								Dashboard
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/service-admin/services") && "bg-white/20"
								)}
								onClick={() => navigate("/service-admin/services")}>
								Services
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/service-admin/documents") && "bg-white/20"
								)}
								onClick={() => navigate("/service-admin/documents")}>
								Documents
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/service-admin/appointments") && "bg-white/20"
								)}
								onClick={() => navigate("/service-admin/appointments")}>
								Appointments
							</Button>
							<Button
								variant="ghost"
								className={cn(
									"text-white hover:text-white/90",
									isActive("/service-admin/settings") && "bg-white/20"
								)}
								onClick={() => navigate("/service-admin/settings")}>
								Settings
							</Button>
						</nav>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="default"
							size="sm"
							className="text-white border-white hover:bg-white hover:text-emerald-600"
							onClick={() => navigate("/")}>
							View Site
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">{children}</main>

			{/* Service Admin Footer */}
			<footer className="bg-gray-100 py-4 px-6 text-center border-t">
				<p className="text-sm text-gray-600">
					© {new Date().getFullYear()} CitizenGate Service Admin System
				</p>
			</footer>
		</div>
	);
};

export default ServiceAdminLayout;
