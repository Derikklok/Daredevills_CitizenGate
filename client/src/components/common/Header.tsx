import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Menu, ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Sidebar} from "./Sidebar";

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHomePage = location.pathname === "/";
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<>
			<div className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
				<header className="flex justify-between items-center w-full">
					<div className="flex items-center space-x-4 transition-all duration-300 ease-in-out">
						{/* Back button with smooth animation */}
						<div
							className={`transition-all duration-300 ease-in-out ${
								isHomePage
									? "w-0 opacity-0 -translate-x-4 pointer-events-none"
									: "w-8 opacity-100 translate-x-0"
							}`}>
							<button
								onClick={handleBack}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors">
								<ChevronLeft className="w-5 h-5" />
							</button>
						</div>

						{/* Logo with smooth positioning */}
						<Link to="/" className="transition-all duration-300 ease-in-out">
							<h1 className="text-2xl font-bold transition-all duration-300 ease-in-out">
								<span className="text-primary-500">Citizen</span>
								<span className="text-gray-800">Gate</span>
							</h1>
						</Link>
					</div>

					<div className="flex items-center space-x-4">
						<SignedOut>
							<Link to="/sign-in">
								<Button>Sign In</Button>
							</Link>
						</SignedOut>
						<SignedIn>
							<UserButton />
							<button
								onClick={() => setIsSidebarOpen(true)}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors">
								<Menu className="w-6 h-6 cursor-pointer" />
							</button>
						</SignedIn>
					</div>
				</header>
			</div>

			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
		</>
	);
}
