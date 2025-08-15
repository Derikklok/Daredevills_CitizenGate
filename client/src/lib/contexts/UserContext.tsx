import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

// Define the shape of user context data
type UserContextType = {
  userId?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profileImageUrl?: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  // Add any other user properties you need
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  userId: null,
  fullName: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImageUrl: null,
  isLoaded: false,
  isSignedIn: false,
});

// Provider component that wraps your app and makes user object available to any child component
export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  const isLoaded = userLoaded && authLoaded;

  // Values passed to context consumers
  const value: UserContextType = {
    userId: user?.id,
    fullName: user?.fullName,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.primaryEmailAddress?.emailAddress,
    profileImageUrl: user?.imageUrl,
    isLoaded,
    isSignedIn: !!isSignedIn,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook that shortens the imports needed to use the context
export function useUserContext() {
  return useContext(UserContext);
}
