import {useUser} from "@clerk/clerk-react";

/**
 * Hook to check if the current user is a system admin
 * @returns boolean indicating if the user has the system-admin role
 */
export const useIsAdmin = (): boolean => {
	const {user} = useUser();
	return user?.publicMetadata?.role === "system-admin";
};

/**
 * Hook to get user role from Clerk public metadata
 * @returns string or undefined representing the user's role
 */
export const useUserRole = (): string | undefined => {
	const {user} = useUser();
	return user?.publicMetadata?.role as string | undefined;
};
