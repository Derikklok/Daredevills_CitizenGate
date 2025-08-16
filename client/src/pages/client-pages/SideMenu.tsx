import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useClerk } from "@clerk/clerk-react";

interface SideMenuProps {
  user: any;
  onClose: () => void;
}

export default function SideMenu({ user, onClose }: SideMenuProps) {
  const { signOut } = useClerk();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
      <div className="w-72 bg-white h-full p-4 overflow-y-auto">
        {/* Back */}
        <button onClick={onClose} className="mb-4">
          <ArrowLeftIcon className="h-6 w-6 text-[#600D29]" />
        </button>

        {/* Profile */}
        <div className="flex flex-col items-center">
          <img
            src={user?.profileImageUrl}
            alt="Profile"
            className="h-20 w-20 rounded-full border border-gray-300"
          />
          <p className="mt-2 font-bold">{user?.fullName || "User"}</p>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-2">
          <p className="font-bold text-[#600D29]">Main Menu</p>
          <button className="block w-full text-left p-2 hover:bg-pink-50">🏠 Home</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">🔍 Search Services</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">📅 My Appointments</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">📄 My Documents</button>

          <p className="mt-4 font-bold text-[#600D29]">Services</p>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Health</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Education</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Transport</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Registration</button>

          <p className="mt-4 font-bold text-[#600D29]">Support</p>
          <button className="block w-full text-left p-2 hover:bg-pink-50">FAQ</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Contact</button>
          <button className="block w-full text-left p-2 hover:bg-pink-50">Settings</button>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className="mt-6 w-full bg-[#600D29] text-white py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>

      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}
