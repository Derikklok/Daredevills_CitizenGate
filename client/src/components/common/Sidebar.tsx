import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {
	ChevronLeft,
	Home,
	Search,
	Calendar,
	FileText,
	Building2,
	Shield,
	Users,
	Settings,
} from "lucide-react";
import {
	SignOutButton,
	UserButton,
	useUser,
	OrganizationSwitcher,
} from "@clerk/clerk-react";
import {Button} from "../ui/button";
import {useIsAdmin, useIsServiceAdmin} from "@/hooks/useAuth";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

interface MenuItem {
	name: string;
	icon: any;
	path?: string;
	action?: () => void;
	active: boolean;
}

interface MenuSection {
	title: string;
	items: MenuItem[];
}

export function Sidebar({isOpen, onClose}: SidebarProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const {user} = useUser();
	const {isAdmin} = useIsAdmin();
	const {isServiceAdmin} = useIsServiceAdmin();

	const handleNavigation = (path: string) => {
		navigate(path);
		onClose();
	};

	// Google Translate functionality
	const initGoogleTranslate = () => {
		if (!(window as any).google?.translate?.TranslateElement) {
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src =
				"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
			document.head.appendChild(script);

			(window as any).googleTranslateElementInit = () => {
				new (window as any).google.translate.TranslateElement(
					{
						pageLanguage: "en",
						includedLanguages: "en,si,ta",
						layout: (window as any).google.translate.TranslateElement
							.InlineLayout.SIMPLE,
						autoDisplay: false,
					},
					"google_translate_element"
				);
			};
		}
	};

	// Initialize Google Translate on component mount
	useEffect(() => {
		initGoogleTranslate();
	}, []);

	// Build menu items based on user roles
	const menuItems: MenuSection[] = [];

	// Main Menu - Available to all authenticated users
	menuItems.push({
		title: "Main Menu",
		items: [
			{
				name: "Home",
				icon: Home,
				path: "/",
				active: location.pathname === "/",
			},
			{
				name: "All Services",
				icon: Search,
				path: "/services/all",
				active: location.pathname === "/services/all",
			},
			{
				name: "My Appointments",
				icon: Calendar,
				path: "/my-appointments",
				active: location.pathname === "/my-appointments",
			},
		],
	});

	// Admin Menu - Only for system admins
	if (isAdmin) {
		menuItems.push({
			title: "Administration",
			items: [
				{
					name: "Admin Dashboard",
					icon: Shield,
					path: "/admin",
					active: location.pathname === "/admin",
				},
				{
					name: "User Management",
					icon: Users,
					path: "/admin/users",
					active: location.pathname === "/admin/users",
				},
				{
					name: "Department Management",
					icon: Building2,
					path: "/admin/departments",
					active: location.pathname === "/admin/departments",
				},
				{
					name: "Reports",
					icon: FileText,
					path: "/admin/reports",
					active: location.pathname === "/admin/reports",
				},
				{
					name: "System Settings",
					icon: Settings,
					path: "/admin/settings",
					active: location.pathname === "/admin/settings",
				},
			],
		});
	}

	// Service Admin Menu - Only for service admins
	if (isServiceAdmin) {
		menuItems.push({
			title: "Service Administration",
			items: [
				{
					name: "Service Dashboard",
					icon: Building2,
					path: "/service-admin",
					active: location.pathname === "/service-admin",
				},
				{
					name: "Manage Services",
					icon: Settings,
					path: "/service-admin/services",
					active: location.pathname === "/service-admin/services",
				},
				{
					name: "Appointments",
					icon: Calendar,
					path: "/service-admin/appointments",
					active: location.pathname === "/service-admin/appointments",
				},
				{
					name: "Documents",
					icon: FileText,
					path: "/service-admin/documents",
					active: location.pathname === "/service-admin/documents",
				},
			],
		});
	}

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
								{user?.fullName || "User"}
							</h2>

							{/* Organization Switcher - only visible in mobile sidebar */}
							<div className="w-full">
								<OrganizationSwitcher
									appearance={{
										elements: {
											organizationSwitcherTrigger:
												"w-full border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors",
											organizationPreview: "gap-2 justify-center",
											organizationSwitcherTriggerIcon: "text-gray-500",
											organizationSwitcherPopoverCard: "w-72",
										},
									}}
								/>
							</div>
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
											onClick={() => {
												if (item.path) {
													handleNavigation(item.path);
												} else if (item.action) {
													item.action();
												}
											}}
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

			{/* Hidden Google Translate Element */}
			<div id="google_translate_element" style={{display: "none"}}></div>
		</>
	);
}
