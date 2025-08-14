import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bars3Icon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import SideMenu from "./AdminSideMenu";

export default function HomeAdmin() {
  const [departments, setDepartments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", contact_email: "" });
  const [updateData, setUpdateData] = useState({ id: null, address: "", contact_email: "", contact_phone: "", clerk_org_id: "" });

  const { isSignedIn, user } = useUser();

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async () => {
    try {
      await fetch("http://localhost:3000/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowCreateModal(false);
      setFormData({ name: "", address: "", contact_email: "" });
      fetchDepartments();
    } catch (err) {
      console.error("Error creating department", err);
    }
  };

  const handleUpdate = async () => {
    if (!updateData.id) return;
    try {
      await fetch(`http://localhost:3000/api/departments/${updateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: updateData.address,
          contact_email: updateData.contact_email,
          contact_phone: updateData.contact_phone,
          clerk_org_id: updateData.clerk_org_id,
        }),
      });
      setShowUpdateModal(false);
      setUpdateData({ id: null, address: "", contact_email: "", contact_phone: "", clerk_org_id: "" });
      fetchDepartments();
    } catch (err) {
      console.error("Error updating department", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await fetch(`http://localhost:3000/api/departments/${id}`, { method: "DELETE" });
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department", err);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#600D29]">Departments</h1>
        {isSignedIn && (
          <div className="flex items-center gap-3">
            <img src={user?.profileImageUrl} alt="Profile" className="h-8 w-8 rounded-full border border-gray-300" />
            <Bars3Icon className="h-7 w-7 text-[#600D29] cursor-pointer" onClick={() => setMenuOpen(true)} />
          </div>
        )}
      </div>

      {/* Department Cards */}
      <div className="grid gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-bold">{dept.name}</h2>
              <p className="text-sm text-gray-600">{dept.address}</p>
              <p className="text-sm text-gray-500">{dept.contact_email}</p>
            </div>
            <div className="flex gap-2">
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
              <TrashIcon
                className="h-6 w-6 text-red-500 cursor-pointer"
                onClick={() => handleDelete(dept.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-[#600D29] text-white py-2 rounded-lg mt-4"
      >
        Add Department
      </button>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create Department</h2>
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
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleCreate} className="px-4 py-2 bg-[#600D29] text-white rounded">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Department</h2>
            <input
              type="text"
              placeholder="Address"
              value={updateData.address}
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
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Menu */}
      {menuOpen && <SideMenu user={user} onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
