import {SignUp} from "@clerk/clerk-react";

export default function SignUpPage() {
	return (
		<div className="flex justify-center items-center h-screen">
			<SignUp
				signInFallbackRedirectUrl="/sign-in"
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
