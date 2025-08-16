import { useUser } from "@clerk/clerk-react";

/**
 * Hook to check if the current user is a system admin
 * @returns boolean indicating if the user has the system-admin role
 */
export const useIsAdmin = (): boolean => {
	const { user } = useUser();
	// Check for system admin role in public metadata
	return (
		user?.publicMetadata?.["system-admin"] === "true" ||
		user?.publicMetadata?.role === "system-admin" ||
		user?.publicMetadata?.["org:admin"] === "true" // fallback for backwards compatibility
	);
};

/**
 * Hook to check if the current user is a service admin
 * @returns boolean indicating if the user has the service-admin role
 */
export const useIsServiceAdmin = (): boolean => {
	const { user } = useUser();
	return (
		user?.publicMetadata?.["org:admin"] === "true" ||
		user?.publicMetadata?.["service-admin"] === "true" ||
		user?.publicMetadata?.role === "service-admin"
	);
};

/**
 * Hook to check if the current user has any admin role
 * @returns boolean indicating if the user has any admin role
 */
export const useIsAnyAdmin = (): boolean => {
	const isAdmin = useIsAdmin();
	const isServiceAdmin = useIsServiceAdmin();
	return isAdmin || isServiceAdmin;
};

/**
 * Hook to get user role from Clerk public metadata
 * @returns string or undefined representing the user's role
 */
export const useUserRole = (): string | undefined => {
	const { user } = useUser();
	return user?.publicMetadata?.role as string | undefined;
};
