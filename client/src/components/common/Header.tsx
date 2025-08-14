import {
	SignedIn,
	SignedOut,
	UserButton,
	OrganizationSwitcher,
} from "@clerk/clerk-react";
import {Link} from "react-router-dom";

export default function Header() {
	return (
		<div className="flex justify-between items-center p-4">
			<header>
				<SignedOut>
					<Link to="/sign-in">Sign In</Link> |{" "}
					<Link to="/sign-up">Sign Up</Link>
				</SignedOut>
				<SignedIn>
					<UserButton />
					<OrganizationSwitcher />
				</SignedIn>
			</header>
		</div>
	);
}
