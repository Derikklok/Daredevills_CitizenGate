import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {ClerkProvider} from "@clerk/clerk-react";
import {shadcn} from "@clerk/themes";
import {UserProvider} from "./lib/contexts/UserContext";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

const root = createRoot(document.getElementById("root")!);
root.render(
	<StrictMode>
		<ClerkProvider
			appearance={{
				baseTheme: [shadcn],
				variables: {colorPrimary: "#8D153A"},
				signIn: {
					baseTheme: [shadcn],
					variables: {colorPrimary: "#8D153A"},
				},
			}}
			signInUrl="/sign-in"
			signUpUrl="/sign-up"
			publishableKey={PUBLISHABLE_KEY}>
			<UserProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</UserProvider>
		</ClerkProvider>
	</StrictMode>
);
