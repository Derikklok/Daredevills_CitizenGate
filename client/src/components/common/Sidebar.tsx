import {useLocation, useNavigate} from "react-router-dom";
import {
	ChevronLeft,
	Home,
	Search,
	Calendar,
	FileText,
	Heart,
	GraduationCap,
	Car,
	UserCheck,
	HelpCircle,
	Phone,
	Settings,
} from "lucide-react";
import {SignOutButton, UserButton} from "@clerk/clerk-react";
import {Button} from "../ui/button";
import {useUserContext} from "@/lib/contexts/UserContext";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({isOpen, onClose}: SidebarProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const {fullName} = useUserContext();
	const handleNavigation = (path: string) => {
		navigate(path);
		onClose();
	};

	const menuItems = [
		{
			title: "Main Menu",
			items: [
				{
					name: "Home",
					icon: Home,
					path: "/",
					active: location.pathname === "/",
				},
				{
					name: "Search Services",
					icon: Search,
					path: "/search",
					active: location.pathname === "/search",
				},
				{
					name: "My Appointments",
					icon: Calendar,
					path: "/my-appointments",
					active: location.pathname === "/my-appointments",
				},
				{
					name: "My Documents",
					icon: FileText,
					path: "/documents",
					active: location.pathname === "/documents",
				},
			],
		},
		{
			title: "Services",
			items: [
				{
					name: "Health",
					icon: Heart,
					path: "/services/health",
					active: location.pathname === "/services/health",
				},
				{
					name: "Education",
					icon: GraduationCap,
					path: "/services/education",
					active: location.pathname === "/services/education",
				},
				{
					name: "Transport",
					icon: Car,
					path: "/services/transport",
					active: location.pathname === "/services/transport",
				},
				{
					name: "Registration",
					icon: UserCheck,
					path: "/services/registration",
					active: location.pathname === "/services/registration",
				},
			],
		},
		{
			title: "Support",
			items: [
				{
					name: "FAQ",
					icon: HelpCircle,
					path: "/faq",
					active: location.pathname === "/faq",
				},
				{
					name: "Contact",
					icon: Phone,
					path: "/contact",
					active: location.pathname === "/contact",
				},
				{
					name: "Settings",
					icon: Settings,
					path: "/settings",
					active: location.pathname === "/settings",
				},
			],
		},
	];

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="h-full flex flex-col">
					{/* Header */}
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center space-x-4 mb-6">
							<button
								onClick={onClose}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors">
								<ChevronLeft className="w-5 h-5" />
							</button>
							<h1 className="text-xl font-bold">
								<span className="text-primary-500">Citizen</span>
								<span className="text-gray-800">Gate</span>
							</h1>
						</div>

						{/* User Profile */}
						<div className="flex flex-col items-center space-y-4">
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-14 h-14",
									},
								}}
							/>
							<h2 className="text-lg font-semibold text-gray-900">
								{fullName || "User"}
							</h2>
						</div>
					</div>

					{/* Menu Sections */}
					<div className="flex-1 overflow-y-auto py-4">
						{menuItems.map((section, sectionIndex) => (
							<div key={section.title} className="mb-6">
								<h3 className="px-6 mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
									{section.title}
								</h3>
								<div className="space-y-1">
									{section.items.map((item) => (
										<button
											key={item.name}
											onClick={() => handleNavigation(item.path)}
											className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
												item.active
													? "bg-primary-50 text-primary-500 border-r-2 border-primary-500"
													: "text-gray-700 hover:bg-primary-50 hover:text-primary-500"
											}`}>
											<item.icon
												className={`w-5 h-5 ${
													item.active ? "text-primary-500" : "text-primary-500"
												}`}
											/>
											<span className="font-medium">{item.name}</span>
										</button>
									))}
								</div>
								{sectionIndex < menuItems.length - 1 && (
									<div className="mx-6 my-4 border-t border-dotted border-purple-300" />
								)}
							</div>
						))}
					</div>

					{/* Sign Out Button */}
					<div className="p-6 border-t border-gray-200">
						<SignOutButton>
							<Button className="w-full">Sign Out</Button>
						</SignOutButton>
					</div>
				</div>
			</div>
		</>
	);
}
