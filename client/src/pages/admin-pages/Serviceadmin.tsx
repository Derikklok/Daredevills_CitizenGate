import { CalendarDaysIcon, ClipboardDocumentCheckIcon, ExclamationTriangleIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function ServiceAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white shadow-lg rounded-3xl p-4 w-[360px] border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            <span className="text-[#600D29]">Citizen</span>
            <span className="text-pink-400">Gate</span>
          </h1>
          <span className="bg-[#600D29] text-white px-3 py-1 rounded text-sm font-medium">
            Admin
          </span>
        </div>

        {/* Dashboard Overview */}
        <h2 className="text-sm font-semibold mb-2">Dashboard Overview</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#600D29] text-white p-3 rounded-lg flex flex-col items-center shadow-md">
            <CalendarDaysIcon className="h-6 w-6 mb-1" />
            <p className="text-xs">Appointments Today</p>
            <p className="text-lg font-bold">12</p>
          </div>
          <div className="bg-[#600D29] text-white p-3 rounded-lg flex flex-col items-center shadow-md">
            <ClipboardDocumentCheckIcon className="h-6 w-6 mb-1" />
            <p className="text-xs">Pending Approvals</p>
            <p className="text-lg font-bold">5</p>
          </div>
          <div className="bg-[#600D29] text-white p-3 rounded-lg flex flex-col items-center shadow-md">
            <ExclamationTriangleIcon className="h-6 w-6 mb-1" />
            <p className="text-xs">Faulty Reporting</p>
            <p className="text-lg font-bold">3</p>
          </div>
          <div className="bg-[#600D29] text-white p-3 rounded-lg flex flex-col items-center shadow-md">
            <ChartBarIcon className="h-6 w-6 mb-1" />
            <p className="text-xs">Attendance Rate</p>
            <p className="text-lg font-bold">92%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-col gap-2 mb-4">
          <button className="bg-orange-500 text-white py-2 rounded-lg font-medium">
            View Appointments
          </button>
          <button className="bg-green-600 text-white py-2 rounded-lg font-medium">
            Manage Services
          </button>
          <button className="border border-gray-300 py-2 rounded-lg font-medium">
            Analytics
          </button>
          <button className="border border-gray-300 py-2 rounded-lg font-medium">
            System Settings
          </button>
        </div>

        {/* New Updates */}
        <h2 className="text-sm font-semibold mb-2">New Updates</h2>
        <div className="border border-pink-300 rounded-lg p-3 text-sm text-gray-500 h-20 flex items-center justify-center">
          No new updates
        </div>
      </div>
    </div>
  );
}
