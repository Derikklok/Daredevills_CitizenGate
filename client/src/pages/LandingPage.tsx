import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {useAuth} from "@clerk/clerk-react";
import {Bell, Calendar, Smartphone} from "lucide-react";

const LandingPage = () => {
	const navigate = useNavigate();
	const {isSignedIn, isLoaded} = useAuth();

	const handleGetStarted = () => {
		if (isLoaded && isSignedIn) {
			navigate("/"); // Navigate to home page (root)
		} else {
			navigate("/sign-in");
		}
	};

	return (
		<div className="h-[100vh] w-full flex flex-col relative text-white bg-[#8D153A] overflow-hidden">
			{/* Modern background image with geometric design in 16:9 ratio */}
			<div className="absolute inset-0 w-full h-full">
				{/* Main background image - preserving 16:9 ratio without zooming */}
				<img
					src="/landing-1.png"
					alt="Background"
					className="w-full h-full object-cover object-center"
					loading="eager"
					style={{objectPosition: "center"}}
				/>

				{/* Subtle overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#8D153A]/30 to-[#8D153A]/70"></div>
			</div>

			{/* Modern content layout optimized for single viewport */}
			<main className="h-full flex flex-col items-center justify-center text-center relative z-10 mx-auto w-full">
				<div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-center p-2 xs:p-3 sm:p-4">
					{/* Top section with logo and title */}
					<div className="flex flex-col items-center">
						{/* Modern logo with geometric styling - smaller for viewport fit */}
						<div className="mx-auto w-fit mb-2 sm:mb-4 relative">
							<div className="bg-white rounded-xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto shadow-lg transform rotate-45">
								<div className="transform -rotate-45">
									<Bell size={24} className="text-[#8D153A]" strokeWidth={2} />
								</div>
							</div>
						</div>

						{/* Modern title with clean design - more compact */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
							<span className="text-white">Citizen</span>
							<span className="text-amber-300">Gate</span>
						</h1>

						{/* Clean subtitle - more compact */}
						<p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto mb-3 sm:mb-4 font-light">
							Seamlessly book, track & manage your government appointments
						</p>
					</div>

					{/* More compact heading */}
					<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
						<span className="bg-white text-[#8D153A] px-3 py-1 rounded-lg">
							One Platform
						</span>
						<span className="mx-1">For All</span>
						<span className="text-white block mt-1">
							Your Government Services
						</span>
					</h2>

					{/* Even more compact feature highlights with modern styling */}
					<div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-5">
						<div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-filter backdrop-brightness-90 border border-white/20 hover:bg-white/20">
							<div className="bg-gradient-to-r from-amber-400 to-amber-500 p-1.5 rounded-lg mb-1 w-8 sm:w-10 mx-auto">
								<Calendar size={16} className="text-white" strokeWidth={2} />
							</div>
							<p className="font-semibold text-xs sm:text-sm text-white">
								Quick Booking
							</p>
						</div>
						<div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-filter backdrop-brightness-90 border border-white/20 hover:bg-white/20">
							<div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-lg mb-1 w-8 sm:w-10 mx-auto">
								<Bell size={16} className="text-white" strokeWidth={2} />
							</div>
							<p className="font-semibold text-xs sm:text-sm text-white">
								Smart Reminders
							</p>
						</div>
						<div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-filter backdrop-brightness-90 border border-white/20 hover:bg-white/20">
							<div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-1.5 rounded-lg mb-1 w-8 sm:w-10 mx-auto">
								<Smartphone size={16} className="text-white" strokeWidth={2} />
							</div>
							<p className="font-semibold text-xs sm:text-sm text-white">
								Mobile Ready
							</p>
						</div>
					</div>

					{/* Even more compact button with geometric styling */}
					<div className="mt-3 mb-0 flex flex-col items-center">
						<Button
							onClick={handleGetStarted}
							className="px-8 sm:px-10 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-amber-300/30 transition-all hover:-translate-y-1 active:translate-y-0 border border-amber-300">
							Get Started Now
						</Button>

						<div className="mt-3 sm:mt-4">
							<span className="text-white/80 text-xs sm:text-sm">
								Already have an account?
							</span>{" "}
							<a
								href="/sign-in"
								className="text-amber-300 font-bold text-xs sm:text-sm hover:text-white transition-colors ml-1 hover:underline underline-offset-4">
								Sign in
							</a>
						</div>
					</div>

					{/* Minimalist footer positioned absolutely at bottom */}
					<footer className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center">
						<div className="inline-block bg-white/10 backdrop-filter backdrop-brightness-90 px-4 py-1 rounded-lg border border-white/20">
							<p className="text-xs sm:text-sm text-white">
								© {new Date().getFullYear()}{" "}
								<span className="font-bold text-amber-300">CitizenGate</span>
							</p>
						</div>
					</footer>
				</div>
			</main>
		</div>
	);
};

export default LandingPage;
