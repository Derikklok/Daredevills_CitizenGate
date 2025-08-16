import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { fetchDepartmentServices, fetchGovernmentServices } from "@/lib/serviceApi";
import type { GovernmentService } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Department type
type Department = {
  department_id: number;
  orgId: string;
  name: string;
};

// Fetch all departments, then filter by orgId
const fetchUserDepartment = async (orgId: string): Promise<Department | null> => {
  try {
    const res = await fetch(`http://localhost:3000/api/departments`);
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
  const [, setIsAddModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>("Your Department");
  const [activeTab, setActiveTab] = useState<string>("department");

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);

        let deptId: number | undefined = undefined;

        if (organization) {
          // Step 1: Fetch user's department by Clerk org ID
          const department = await fetchUserDepartment(organization.id);
          if (department) {
            deptId = department.department_id;
            setDepartmentName(department.name);
          } else {
            setDepartmentName("Your Department");
          }
        }

        // Step 2: Fetch all government services
        const allServicesData = await fetchGovernmentServices();
        const allServicesWithStatus = allServicesData.map((s) => ({
          ...s,
          status: s.status || "active",
        }));
        setAllServices(allServicesWithStatus);

        // Step 3: Fetch department-specific services
        if (deptId) {
          const departmentServicesData = await fetchDepartmentServices(deptId);
          const departmentServicesWithStatus = departmentServicesData.map((s) => ({
            ...s,
            status: s.status || "active",
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

  // Filter services based on search
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

  // Edit service
  const handleEditService = (serviceId: string) => {
    console.log("Edit service:", serviceId);
  };

  // Toggle service status
  const handleToggleServiceStatus = (
    serviceId: string,
    currentStatus: "active" | "inactive" | undefined
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setDepartmentServices(
      departmentServices.map((s) =>
        s.service_id === serviceId ? { ...s, status: newStatus } : s
      )
    );
    setAllServices(
      allServices.map((s) =>
        s.service_id === serviceId ? { ...s, status: newStatus } : s
      )
    );
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
            <Button onClick={() => setIsAddModalOpen(true)}>Add New Service</Button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading services...</div>
          ) : (
            <>
              <TabsContent value="department">
                {filteredDepartmentServices.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No services found.</p>
                    <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredDepartmentServices.map((service) => (
                      <Card key={service.service_id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 flex justify-between items-center">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              service.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.status}
                          </span>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{service.description}</p>
                          <div className="flex flex-col text-sm text-gray-500 space-y-1 mt-2">
                            <div className="flex justify-between">
                              <span>Category: {service.category}</span>
                              <span>Completion: {service.estimated_total_completion_time}</span>
                            </div>
                            <div>Department: {service.department?.name || "Unknown"}</div>
                          </div>
                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => handleEditService(service.service_id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={
                                service.status === "active" ? "destructive" : "secondary"
                              }
                              onClick={() =>
                                handleToggleServiceStatus(service.service_id, service.status)
                              }
                            >
                              {service.status === "active" ? "Deactivate" : "Activate"}
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
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              service.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.status}
                          </span>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{service.description}</p>
                          <div className="flex flex-col text-sm text-gray-500 space-y-1 mt-2">
                            <div className="flex justify-between">
                              <span>Category: {service.category}</span>
                              <span>Completion: {service.estimated_total_completion_time}</span>
                            </div>
                            <div>Department: {service.department?.name || "Unknown"}</div>
                          </div>
                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => handleEditService(service.service_id)}
                            >
                              View Details
                            </Button>
                            {service.department?.department_id ===
                              Number(user?.publicMetadata?.departmentId) && (
                              <Button
                                variant={
                                  service.status === "active" ? "destructive" : "secondary"
                                }
                                onClick={() =>
                                  handleToggleServiceStatus(service.service_id, service.status)
                                }
                              >
                                {service.status === "active" ? "Deactivate" : "Activate"}
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
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceManagement;
