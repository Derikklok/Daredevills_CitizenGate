import { CalendarDaysIcon, ClipboardDocumentCheckIcon, ExclamationTriangleIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ServiceAdmin() {
  const appointments = [
    {
      name: "Medical Test",
      description: "Routine health checkup",
      category: "Health",
      appointmentTime: "6th August 2025, 10:30 AM",
      departmentName: "MOH Nugegoda",
      contactNumber: "+94 112 345 678",
      notes: "Bring previous medical reports",
    },
    {
      name: "Driver's Written Test",
      description: "Written exam for driver's license",
      category: "Licensing",
      appointmentTime: "6th August 2025, 10:30 AM",
      departmentName: "MOH Nugegoda",
      contactNumber: "+94 112 345 679",
      notes: "Arrive 15 minutes early",
    },
  ];

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 text-white py-2 rounded-lg font-medium w-full">
                View Appointments
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg p-4 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#600D29] text-lg font-bold">
                  Appointments
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Details of upcoming appointments.
                </DialogDescription>
              </DialogHeader>
              {appointments.map((appt, index) => (
                <div key={index} className="border-b border-gray-200 py-2">
                  <h3 className="font-semibold text-[#600D29]">{appt.name}</h3>
                  <p><strong>Description:</strong> {appt.description}</p>
                  <p><strong>Category:</strong> {appt.category}</p>
                  <p><strong>Appointment Time:</strong> {appt.appointmentTime}</p>
                  <p><strong>Department:</strong> {appt.departmentName}</p>
                  <p><strong>Contact Number:</strong> {appt.contactNumber}</p>
                  <p><strong>Notes:</strong> {appt.notes}</p>
                </div>
              ))}
            </DialogContent>
          </Dialog>
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