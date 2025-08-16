import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

/**
 * Hook to check if the current user is a system admin
 * Returns both loading state and admin status
 */
export const useIsAdmin = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { has } = useAuth();
	const { user } = useUser();

	useEffect(() => {
		if (!has) {
			setIsLoading(false);
			return;
		}

		const checkAdminAccess = async () => {
			try {
				// First check Clerk organization roles
				const hasOrgAdmin = await has({ role: "org:admin" });

				// Fallback to public metadata for free tier compatibility
				const hasMetadataAdmin =
					user?.publicMetadata?.["system-admin"] === "true" ||
					user?.publicMetadata?.role === "system-admin" ||
					user?.publicMetadata?.["org:admin"] === "true";

				setIsAdmin(hasOrgAdmin || hasMetadataAdmin);
			} catch (error) {
				console.error("Error checking admin access:", error);
				// Fallback to metadata check only
				const hasMetadataAdmin =
					user?.publicMetadata?.["system-admin"] === "true" ||
					user?.publicMetadata?.role === "system-admin" ||
					user?.publicMetadata?.["org:admin"] === "true";
				setIsAdmin(hasMetadataAdmin);
			} finally {
				setIsLoading(false);
			}
		};

		checkAdminAccess();
	}, [has, user?.publicMetadata]);

	return { isAdmin, isLoading };
};

/**
 * Hook to check if the current user is a service admin
 * Returns both loading state and service admin status
 */
export const useIsServiceAdmin = () => {
	const [isServiceAdmin, setIsServiceAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { has } = useAuth();
	const { user } = useUser();

	useEffect(() => {
		if (!has) {
			setIsLoading(false);
			return;
		}

		const checkServiceAdminAccess = async () => {
			try {
				// Check Clerk organization roles
				const hasOrgAdmin = await has({ role: "org:admin" });
				const hasServiceAdmin = await has({ role: "service-admin" });

				// Fallback to public metadata for free tier compatibility
				const hasMetadataServiceAdmin =
					user?.publicMetadata?.["service-admin"] === "true" ||
					user?.publicMetadata?.role === "service-admin" ||
					user?.publicMetadata?.["org:admin"] === "true";

				setIsServiceAdmin(hasOrgAdmin || hasServiceAdmin || hasMetadataServiceAdmin);
			} catch (error) {
				console.error("Error checking service admin access:", error);
				// Fallback to metadata check only
				const hasMetadataServiceAdmin =
					user?.publicMetadata?.["service-admin"] === "true" ||
					user?.publicMetadata?.role === "service-admin" ||
					user?.publicMetadata?.["org:admin"] === "true";
				setIsServiceAdmin(hasMetadataServiceAdmin);
			} finally {
				setIsLoading(false);
			}
		};

		checkServiceAdminAccess();
	}, [has, user?.publicMetadata]);

	return { isServiceAdmin, isLoading };
};

/**
 * Hook to check if the current user has any admin role
 * Returns both loading state and admin status
 */
export const useIsAnyAdmin = () => {
	const { isAdmin, isLoading: adminLoading } = useIsAdmin();
	const { isServiceAdmin, isLoading: serviceAdminLoading } = useIsServiceAdmin();

	return {
		isAnyAdmin: isAdmin || isServiceAdmin,
		isLoading: adminLoading || serviceAdminLoading
	};
};

/**
 * Hook to get user role from Clerk public metadata
 * @returns string or undefined representing the user's role
 */
export const useUserRole = (): string | undefined => {
	const { user } = useUser();
	return user?.publicMetadata?.role as string | undefined;
};
