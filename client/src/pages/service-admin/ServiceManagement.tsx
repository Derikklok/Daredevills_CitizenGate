import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { fetchDepartmentServices } from "@/lib/serviceApi";
import type { GovernmentService } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const ServiceManagement = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // We'll keep the setIsAddModalOpen for future implementation
  const [, setIsAddModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>("");
  
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        // If we have an organization from Clerk, use its name
        if (organization) {
          setDepartmentName(organization.name);
        }
        
        // Get department ID from user metadata
        const departmentId = user?.publicMetadata?.departmentId;
        
        if (departmentId) {
          // Fetch real services from API
          const servicesData = await fetchDepartmentServices(departmentId as number);
          
          // Set department name from the first service if available
          if (servicesData.length > 0 && servicesData[0].department?.name) {
            setDepartmentName(servicesData[0].department.name);
          } else {
            setDepartmentName(user?.publicMetadata?.departmentName as string || "Your Department");
          }
          
          // Add status property if not present
          const servicesWithStatus = servicesData.map(service => ({
            ...service,
            status: service.status || "active"
          }));
          
          setServices(servicesWithStatus);
          setLoading(false);
        } else {
          // Fallback to mock data if departmentId is not available
          const defaultDepartment = {
            department_id: 1,
            name: "Department of Motor Vehicles",
            description: "Provide services to Motor Vehicles related services",
            address: "123 Government St, Capital City",
            contact_email: "dmv@gov.example",
            contact_phone: "555-1234",
            clerk_org_id: "org_123456789",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          };
          
          const mockServices: GovernmentService[] = [
          {
            service_id: "1",
            name: "Passport Application",
            description: "Apply for a new passport",
            department_id: 1,
            category: "Travel",
            status: "active",
            estimated_total_completion_time: "14 days",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
            department: defaultDepartment,
          },
          {
            service_id: "2",
            name: "Passport Renewal",
            description: "Renew your existing passport",
            department_id: 1,
            category: "Travel",
            status: "active",
            estimated_total_completion_time: "7 days",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
            department: defaultDepartment,
          },
          {
            service_id: "3",
            name: "ID Card Application",
            description: "Apply for a new national ID card",
            department_id: 1,
            category: "Identity",
            status: "inactive",
            estimated_total_completion_time: "21 days",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
            department: defaultDepartment,
          },
        ];
        
        setServices(mockServices);
        setDepartmentName(defaultDepartment.name);
        setLoading(false);
      }
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [user, organization]);

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditService = (serviceId: string) => {
    // Implement edit functionality
    console.log("Edit service:", serviceId);
  };

  const handleToggleServiceStatus = (serviceId: string, currentStatus: "active" | "inactive" | undefined) => {
    // Implement toggle status functionality
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    console.log(`Change service ${serviceId} status from ${currentStatus} to ${newStatus}`);
    
    // Update the services state
    setServices(services.map(service => 
      service.service_id === serviceId 
        ? { ...service, status: newStatus as "active" | "inactive" } 
        : service
    ));
  };

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600">
            Manage services for <span className="font-medium">{organization ? organization.name : departmentName}</span>
          </p>
          {organization && (
            <p className="text-sm text-gray-500 mt-1">
              Organization ID: {organization.id}
            </p>
          )}
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add New Service
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No services found.</p>
            <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.service_id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
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
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-gray-700">{service.description}</p>
                    <div className="flex flex-col text-sm text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Category: {service.category}</span>
                        <span>Completion: {service.estimated_total_completion_time}</span>
                      </div>
                      <div>
                        <span>Department: {service.department.name}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleEditService(service.service_id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={service.status === "active" ? "destructive" : "secondary"}
                        onClick={() => handleToggleServiceStatus(service.service_id, service.status)}
                      >
                        {service.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceManagement;
