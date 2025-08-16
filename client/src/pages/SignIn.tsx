import {SignIn} from "@clerk/clerk-react";

export default function SignInPage() {
	return (
		<div className="flex justify-center items-center h-screen bg-white">
			<SignIn
				signUpFallbackRedirectUrl="/sign-up"
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
