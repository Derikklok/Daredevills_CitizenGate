import { useUserContext } from "@/lib/contexts/UserContext";

export default function UserProfile() {
  const { fullName, email, profileImageUrl, isLoaded } = useUserContext();

  if (!isLoaded) return <div>Loading user data...</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-500 text-lg font-bold">
                {fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{fullName || "User"}</h3>
          <p className="text-sm text-gray-500">{email || "No email provided"}</p>
        </div>
      </div>
    </div>
  );
}
