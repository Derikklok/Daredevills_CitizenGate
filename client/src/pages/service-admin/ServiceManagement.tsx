import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { fetchDepartmentServices, fetchGovernmentServices } from "@/lib/serviceApi";
import type { GovernmentService } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API Base URL
const API_BASE_URL = "http://localhost:3000/api";

// Department type
type Department = {
  department_id: number;
  orgId: string;
  name: string;
};

// Fetch all departments, then filter by orgId
const fetchUserDepartment = async (orgId: string): Promise<Department | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/departments`);
    if (!res.ok) throw new Error("Failed to fetch departments");

    const departments: Department[] = await res.json();
    const department = departments.find((dep) => dep.clerk_org_id === orgId) || null;

    return department;
  } catch (err) {
    console.error("Error fetching department:", err);
    return null;
  }
};

const ServiceManagement = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  const [departmentServices, setDepartmentServices] = useState<GovernmentService[]>([]);
  const [allServices, setAllServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedService, setEditedService] = useState<GovernmentService | null>(null);
  const [departmentName, setDepartmentName] = useState<string>("Your Department");
  const [activeTab, setActiveTab] = useState<string>("department");
  const [viewService, setViewService] = useState<GovernmentService | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // Store only the service ID for deletion

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);

        let deptId: number | undefined = undefined;

        if (organization) {
          const department = await fetchUserDepartment(organization.id);
          if (department) {
            deptId = department.department_id;
            setDepartmentName(department.name);
          } else {
            setDepartmentName("Your Department");
          }
        }

        const allServicesData = await fetchGovernmentServices();
        const allServicesWithStatus = allServicesData.map((s) => ({
          ...s,
          status: "active", // Always set to active
        }));
        setAllServices(allServicesWithStatus);

        if (deptId) {
          const departmentServicesData = await fetchDepartmentServices(deptId);
          const departmentServicesWithStatus = departmentServicesData.map((s) => ({
            ...s,
            status: "active", // Always set to active
          }));
          setDepartmentServices(departmentServicesWithStatus);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [user, organization]);

  const filteredDepartmentServices = departmentServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllServices = allServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditService = (serviceId: string) => {
    const service = [...departmentServices, ...allServices].find(
      (s) => s.service_id === serviceId
    );
    if (service) {
      setEditedService({
        ...service,
        name: service.name || "",
        description: service.description || "",
        category: service.category || "",
        estimated_total_completion_time: service.estimated_total_completion_time || "",
        department_id: service.department_id || 0,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleViewDetails = (serviceId: string) => {
    const service = [...departmentServices, ...allServices].find(
      (s) => s.service_id === serviceId
    );
    if (service) {
      setViewService(service);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/government-services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete service");

      setDepartmentServices(departmentServices.filter((s) => s.service_id !== id));
      setAllServices(allServices.filter((s) => s.service_id !== id));
      setConfirmDelete(null); // Clear confirmation after successful deletion
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedService) return;

    try {
      const response = await fetch(`${API_BASE_URL}/government-services/${editedService.service_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedService.name,
          description: editedService.description,
          category: editedService.category,
          estimated_total_completion_time: editedService.estimated_total_completion_time,
          department_id: editedService.department_id,
          status: "active", // Always set to active on save
        }),
      });

      if (!response.ok) throw new Error("Failed to update service");

      const updatedService = await response.json();

      setDepartmentServices((prev) =>
        prev.map((s) => (s.service_id === updatedService.service_id ? updatedService : s))
      );
      setAllServices((prev) =>
        prev.map((s) => (s.service_id === updatedService.service_id ? updatedService : s))
      );

      setIsEditModalOpen(false);
      setEditedService(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedService) {
      setEditedService({
        ...editedService,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600">
            Manage services for{" "}
            <span className="font-medium">
              {organization ? organization.name : departmentName}
            </span>
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="department">My Department Services</TabsTrigger>
            <TabsTrigger value="all">All Government Services</TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center mt-6 mb-6">
            <div className="w-full max-w-md">
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={() => setIsEditModalOpen(true)}>Add New Service</Button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading services...</div>
          ) : (
            <>
              <TabsContent value="department">
                {filteredDepartmentServices.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No services found.</p>
                    <Button className="mt-4" onClick={() => setIsEditModalOpen(true)}>
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredDepartmentServices.map((service) => (
                      <Card key={service.service_id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 flex justify-between items-center">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            active
                          </span>
                        </CardHeader>
 <CardContent className="p-4 space-y-3">
  {/* Description */}
  <p className="text-sm text-gray-800 leading-snug">
    {service.description}
  </p>

  {/* Meta Info */}
  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 space-y-1.5">
    <div className="flex justify-between">
      <span className="font-medium">Category</span>
      <span>{service.category}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium">Completion</span>
      <span>{service.estimated_total_completion_time}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium">Department</span>
      <span>{service.department?.name || "Unknown"}</span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center justify-between pt-2">
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg"
      onClick={() => handleEditService(service.service_id)}
    >
      Edit
    </Button>
    <Button
      variant="destructive"
      size="sm"
      className="rounded-lg"
      onClick={() => setConfirmDelete(service.service_id)}
    >
      Delete
    </Button>
  </div>
</CardContent>


                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all">
                {filteredAllServices.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No government services found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredAllServices.map((service) => (
                      <Card key={service.service_id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 flex justify-between items-center">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            active
                          </span>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
  {/* Description */}
  <p className="text-sm text-gray-800 leading-snug">
    {service.description}
  </p>

  {/* Meta Info */}
  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 space-y-1.5 mt-2">
    <div className="flex justify-between">
      <span className="font-medium">Category</span>
      <span>{service.category}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium">Completion</span>
      <span>{service.estimated_total_completion_time}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium">Department</span>
      <span>{service.department?.name || "Unknown"}</span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center justify-between pt-2">
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg"
      onClick={() => handleViewDetails(service.service_id)}
    >
      View Details
    </Button>
    {service.department?.department_id ===
      Number(user?.publicMetadata?.departmentId) && (
      <Button
        variant="destructive"
        size="sm"
        className="rounded-lg"
        onClick={() => setConfirmDelete(service.service_id)}
      >
        Delete
      </Button>
    )}
  </div>
</CardContent>

                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {isEditModalOpen && editedService && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Service</h2>
              <p className="text-gray-600 mb-4">
                Update the service details below.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="text-sm font-medium text-gray-700">Service</label>
                  <Input
                    value={editedService.name}
                    name="name"
                    onChange={handleInputChange}
                    className="mt-1 w-3/4"
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Input
                    value={editedService.description}
                    name="description"
                    onChange={handleInputChange}
                    className="mt-1 w-3/4"
                    placeholder="Enter description"
                  />
                </div>
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Input
                    value={editedService.category}
                    name="category"
                    onChange={handleInputChange}
                    className="mt-1 w-3/4"
                    placeholder="Enter category"
                  />
                </div>
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="text-sm font-medium text-gray-700">Time Period</label>
                  <Input
                    value={editedService.estimated_total_completion_time}
                    name="estimated_total_completion_time"
                    onChange={handleInputChange}
                    className="mt-1 w-3/4"
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
        {viewService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Service Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p>{viewService.name}</p>
                </div>
                <div>
                  <p className="font-medium">Description:</p>
                  <p>{viewService.description}</p>
                </div>
                <div>
                  <p className="font-medium">Category:</p>
                  <p>{viewService.category}</p>
                </div>
                <div>
                  <p className="font-medium">Estimated Completion Time:</p>
                  <p>{viewService.estimated_total_completion_time}</p>
                </div>
                <div>
                  <p className="font-medium">Department:</p>
                  <p>{viewService.department?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-medium">Status:</p>
                  <p>active</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setViewService(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
        {confirmDelete && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteService(confirmDelete)}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceManagement;