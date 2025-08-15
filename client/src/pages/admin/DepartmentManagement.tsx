import { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/clerk-react";
import type { Department } from "@/lib/admin/types";
import { fetchDepartments, deleteDepartment } from "@/lib/admin/departmentApi";
import DepartmentForm from "./components/DepartmentForm";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{ id: number | null; status: 'idle' | 'loading' | 'success' | 'error' }>({
    id: null,
    status: 'idle'
  });
  const [formMode, setFormMode] = useState<'none' | 'add' | 'edit'>('none');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);
  const { getToken } = useAuth();

  const handleDeleteDepartment = async (departmentId: number) => {
    try {
      setDeleteStatus({ id: departmentId, status: 'loading' });
      
      const token = await getToken();
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      await deleteDepartment(departmentId, token);
      
      // Remove the department from the state
      setDepartments(prevDepartments => 
        prevDepartments.filter(dept => dept.department_id !== departmentId)
      );
      
      setDeleteStatus({ id: departmentId, status: 'success' });
    } catch (err) {
      console.error('Error deleting department:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete department');
      setDeleteStatus({ id: departmentId, status: 'error' });
    }
  };
  
  const handleSaveDepartment = (department: Department) => {
    if (formMode === 'add') {
      // Add the new department to state
      setDepartments(prev => [...prev, department]);
    } else {
      // Update the department in state
      setDepartments(prev => 
        prev.map(dept => dept.department_id === department.department_id ? department : dept)
      );
    }
    
    // Reset form mode and selected department
    setFormMode('none');
    setSelectedDepartment(undefined);
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        if (!token) {
          setError("Authentication required");
          return;
        }
        
        const data = await fetchDepartments(token);
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching departments');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDepartments();
  }, [getToken]);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Department Management</h1>
            <p className="text-gray-600">
              Manage government departments and their services
            </p>
          </div>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => {
              setSelectedDepartment(undefined);
              setFormMode('add');
            }}
          >
            Add New Department
          </button>
        </div>
        
        {formMode !== 'none' ? (
          <DepartmentForm
            department={selectedDepartment}
            onSave={handleSaveDepartment}
            onCancel={() => {
              setFormMode('none');
              setSelectedDepartment(undefined);
            }}
          />
        ) : loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading departments...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No departments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.map((department) => (
              <DepartmentCard 
                key={department.department_id} 
                department={department}
                onDelete={handleDeleteDepartment}
                onEdit={(dept) => {
                  setSelectedDepartment(dept);
                  setFormMode('edit');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

import { useConfirmation, StatusBadge } from "./components/AdminUI";

const DepartmentCard = ({ 
  department,
  onDelete,
  onEdit
}: { 
  department: Department;
  onDelete: (departmentId: number) => void;
  onEdit: (department: Department) => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmation();
  
  const handleDelete = () => {
    showConfirmation({
      title: "Delete Department",
      message: `Are you sure you want to delete ${department.name}? This action cannot be undone.`,
      confirmButtonText: "Delete",
      onConfirm: async () => {
        setIsDeleting(true);
        await onDelete(department.department_id);
        setIsDeleting(false);
      }
    });
  };
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <ConfirmationDialog />
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
            <StatusBadge 
              status={department.services.length > 0 ? "success" : "pending"} 
              text={department.services.length > 0 ? "Active" : "No Services"}
            />
          </div>
          <p className="text-sm text-gray-500">
            {department.description || "No description available"}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => onEdit(department)}
          >
            Edit
          </button>
          <button 
            className="text-red-600 hover:text-red-800 text-sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-600 w-24">Address:</span>
          <span className="text-gray-700">{department.address}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-600 w-24">Email:</span>
          <span className="text-gray-700">{department.contact_email}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-600 w-24">Phone:</span>
          <span className="text-gray-700">{department.contact_phone}</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Services ({department.services.length})</h4>
        {department.services.length === 0 ? (
          <p className="text-sm text-gray-500">No services available</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {department.services.map((service) => (
              <Badge key={service.service_id} variant="outline" className="bg-blue-50">
                {service.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DepartmentManagement;
