import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Menu, ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHomePage = location.pathname === "/";

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<div className="flex justify-between items-center p-4 bg-white shadow-sm">
			<header className="flex justify-between items-center w-full">
				{isHomePage ? (
					// Home page header - no back button
					<Link to="/">
						<h1 className="text-2xl font-bold">
							<span className="text-primary-500">Citizen</span>
							<span className="text-gray-800">Gate</span>
						</h1>
					</Link>
				) : (
					// Other pages header - with back button
					<div className="flex items-center space-x-4">
						<button
							onClick={handleBack}
							className="p-1 hover:bg-gray-100 rounded-full transition-colors">
							<ChevronLeft className="w-5 h-5" />
						</button>
						<Link to="/">
							<h1 className="text-2xl font-bold">
								<span className="text-primary-500">Citizen</span>
								<span className="text-gray-800">Gate</span>
							</h1>
						</Link>
					</div>
				)}

				<div className="flex items-center space-x-4">
					<SignedOut>
						<Link to="/sign-in">
							<Button>Sign In</Button>
						</Link>
					</SignedOut>
					<SignedIn>
						<UserButton />
						<Menu className="w-6 h-6 cursor-pointer" />
					</SignedIn>
				</div>
			</header>
		</div>
	);
}
