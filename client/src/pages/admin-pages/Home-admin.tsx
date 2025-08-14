import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bars3Icon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import SideMenu from "./AdminSideMenu";
import citizenGateLogo from "../../components/images/CitizenGate.png";

export default function HomeAdmin() {
  const [departments, setDepartments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", contact_email: "" });
  const [updateData, setUpdateData] = useState({
    id: null,
    address: "",
    contact_email: "",
    contact_phone: "",
    clerk_org_id: "",
  });
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);

  const { isSignedIn, user } = useUser();

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // Create department
  const handleCreate = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/departments", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18zMUNhM1lqaUduYkd5OFUzVVFscGRFb3ZjeHAiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NTYxODM3MzQsImlhdCI6MTc1NTE4MzczNCwiaXNzIjoiaHR0cHM6Ly9icmF2ZS1ndXBweS01OS5jbGVyay5hY2NvdW50cy5kZXYiLCJqdGkiOiJjYWViMDdjMjZjZTMxZTEyMWIwNCIsIm5iZiI6MTc1NTE4MzcyOSwib3JnX2lkIjoib3JnXzMxQ3R6bzdvWTZOVXU1SDZJeWxQS0Nmd1hWdCIsIm9yZ19wZXJtaXNzaW9ucyI6W10sIm9yZ19yb2xlIjoib3JnOmFkbWluIiwib3JnX3NsdWciOiJkZXBhcnRtZW50LW1vdG9yLXRyYWZmaWMiLCJzdWIiOiJ1c2VyXzMxSFJsOTRHZm44SjZibmVxTVMxWjF2NVo1YSJ9.FZQcUA3RKwF5YAqdjJ_1mftQI4sJXYoIDToVwB8XyT1EKNmW5vPn4q31JVK3iULmgv7lz7_VdpEhq81zXiRJIYRp2Dr2wCImY_KY-euTreG6fo-WZVz9Gqpj3jcXP8VCTWbty2eszqsN5ETNcVvySM9v3PvX6J8X9jC0t3wJNBFuY3J8e7i6Dfs_YYQSBnlMrkS2m55ghk6tOrnYHShhea7uWqqAZdZs8vX2p6AjA6YMRHChxavvRyE8x4R1pFSM4J6eJokaFt29pKDEumdTz5D8ecLnnLWKxJNK84y73VwnTZAp98zQ9ZxvI13haMRHTW4kvZRb9HgIjQCxuBchVg"
        },
        body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

        const data = await res.json();
        console.log("Created department:", data);

        setFormData({ name: "", address: "", contact_email: "" });
        setShowCreateModal(false);
        fetchDepartments();
    } catch (err) {
        console.error("Error creating department:", err);
    }
    };

  // Update department
  const handleUpdate = async () => {
    if (!updateData.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/departments/${updateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: updateData.address,
          contact_email: updateData.contact_email,
          contact_phone: updateData.contact_phone,
          clerk_org_id: updateData.clerk_org_id,
        }),
      });
      const data = await res.json();
      console.log("Updated department:", data);

      setShowUpdateModal(false);
      setUpdateData({ id: null, address: "", contact_email: "", contact_phone: "", clerk_org_id: "" });
      fetchDepartments();
    } catch (err) {
      console.error("Error updating department:", err);
    }
  };

        // Delete department
        const handleDeleteConfirmed = async () => {
        if (!deleteDeptId) return;

        try {
            const res = await fetch(`http://localhost:3000/api/departments/${deleteDeptId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18zMUNhM1lqaUduYkd5OFUzVVFscGRFb3ZjeHAiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NTYxODM3MzQsImlhdCI6MTc1NTE4MzczNCwiaXNzIjoiaHR0cHM6Ly9icmF2ZS1ndXBweS01OS5jbGVyay5hY2NvdW50cy5kZXYiLCJqdGkiOiJjYWViMDdjMjZjZTMxZTEyMWIwNCIsIm5iZiI6MTc1NTE4MzcyOSwib3JnX2lkIjoib3JnXzMxQ3R6bzdvWTZOVXU1SDZJeWxQS0Nmd1hWdCIsIm9yZ19wZXJtaXNzaW9ucyI6W10sIm9yZ19yb2xlIjoib3JnOmFkbWluIiwib3JnX3NsdWciOiJkZXBhcnRtZW50LW1vdG9yLXRyYWZmaWMiLCJzdWIiOiJ1c2VyXzMxSFJsOTRHZm44SjZibmVxTVMxWjF2NVo1YSJ9.FZQcUA3RKwF5YAqdjJ_1mftQI4sJXYoIDToVwB8XyT1EKNmW5vPn4q31JVK3iULmgv7lz7_VdpEhq81zXiRJIYRp2Dr2wCImY_KY-euTreG6fo-WZVz9Gqpj3jcXP8VCTWbty2eszqsN5ETNcVvySM9v3PvX6J8X9jC0t3wJNBFuY3J8e7i6Dfs_YYQSBnlMrkS2m55ghk6tOrnYHShhea7uWqqAZdZs8vX2p6AjA6YMRHChxavvRyE8x4R1pFSM4J6eJokaFt29pKDEumdTz5D8ecLnnLWKxJNK84y73VwnTZAp98zQ9ZxvI13haMRHTW4kvZRb9HgIjQCxuBchVg"
            },
            });

            if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

            console.log("Deleted department id:", deleteDeptId);
            setDeleteDeptId(null);
            fetchDepartments();
        } catch (err) {
            console.error("Error deleting department:", err);
        }
        };


  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <img src={citizenGateLogo} alt="Logo or banner" className="h-10 w-auto" />
        {isSignedIn && (
          <div className="flex items-center gap-3">
            <img src={user?.profileImageUrl} alt="Profile" className="h-8 w-8 rounded-full border border-gray-300" />
            <Bars3Icon className="h-7 w-7 text-[#600D29] cursor-pointer" onClick={() => setMenuOpen(true)} />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-[#600D29]">Departments</h1>

      {/* Department Cards */}
      <div className="grid gap-4">
        {departments.map((dept) => (
          <div key={dept.id || Math.random()} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-bold">{dept.name}</h2>
              <p className="text-sm text-gray-600">{dept.address}</p>
              <p className="text-sm text-gray-500">{dept.contact_email}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Update */}
              <Dialog open={showUpdateModal && updateData.id === dept.id} onOpenChange={setShowUpdateModal}>
                <DialogTrigger asChild>
                  <PencilSquareIcon
                    className="h-6 w-6 text-blue-500 cursor-pointer"
                    onClick={() => {
                      setUpdateData({
                        id: dept.id,
                        address: dept.address || "",
                        contact_email: dept.contact_email || "",
                        contact_phone: dept.contact_phone || "",
                        clerk_org_id: dept.clerk_org_id || "",
                      });
                      setShowUpdateModal(true);
                    }}
                  />
                </DialogTrigger>
                <DialogContent className="backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle>Update Department</DialogTitle>
                    <DialogDescription>
            Update the department information below.
            </DialogDescription>
                  </DialogHeader>
                  <input
                    type="text"
                    placeholder="Address"
                    value={updateData.address}
                    autoFocus={false} 
                    onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={updateData.contact_email}
                    onChange={(e) => setUpdateData({ ...updateData, contact_email: e.target.value })}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={updateData.contact_phone}
                    onChange={(e) => setUpdateData({ ...updateData, contact_phone: e.target.value })}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Clerk Org ID"
                    value={updateData.clerk_org_id}
                    onChange={(e) => setUpdateData({ ...updateData, clerk_org_id: e.target.value })}
                    className="border p-2 w-full mb-4"
                  />
                  <DialogFooter>
                    <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                      Cancel
                    </button>
                    <button onClick={handleUpdate} className="px-4 py-2 bg-[#600D29] text-white rounded">
                      Update
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete */}
              <Dialog open={deleteDeptId === dept.id} onOpenChange={() => setDeleteDeptId(null)}>
                <DialogTrigger asChild>
                  <TrashIcon
                    className="h-6 w-6 text-red-500 cursor-pointer"
                    onClick={() => setDeleteDeptId(dept.id)}
                  />
                </DialogTrigger>
                <DialogContent className="backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle>Delete Department</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Are you sure you want to delete this department? This action cannot be undone.
                  </DialogDescription>
                  <DialogFooter>
                    <button onClick={() => setDeleteDeptId(null)} className="px-4 py-2 bg-gray-200 rounded">
                      No
                    </button>
                    <button onClick={handleDeleteConfirmed} className="px-4 py-2 bg-red-600 text-white rounded">
                      Yes, Delete
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Button */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogTrigger asChild>
          <button className="w-full bg-[#600D29] text-white py-2 rounded-lg mt-4">Add Department</button>
        </DialogTrigger>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="email"
            placeholder="Contact Email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="border p-2 w-full mb-4"
          />
          <DialogFooter>
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button onClick={handleCreate} className="px-4 py-2 bg-[#600D29] text-white rounded">
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Side Menu */}
      {menuOpen && <SideMenu user={user} onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
