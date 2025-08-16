import {SignUp} from "@clerk/clerk-react";

export default function SignUpPage() {
	return (
		<div className="flex justify-center items-center h-screen bg-white">
			<SignUp
				signInFallbackRedirectUrl="/sign-in"
				redirectUrl="/home"
				appearance={{
					elements: {
						footerActionLink: {
							color: "var(--color-primary-500)",
							"&:hover": {
								color: "var(--color-primary-600)",
							},
						},
					},
				}}
			/>
		</div>
	);
}
