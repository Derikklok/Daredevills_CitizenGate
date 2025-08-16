import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useOrganization, useAuth } from "@clerk/clerk-react";
import { getAllRequiredDocuments } from "@/lib/api";
import { fetchDepartmentServices, getDepartmentByOrgId } from "@/lib/serviceApi";
import type { RequiredDocument } from "@/lib/types";
import AddDocumentDialog from "./components/AddDocumentDialog";
import DeleteDocumentDialog from "./components/DeleteDocumentDialog";
import EditDocumentDialog from "./components/EditDocumentDialog";

const DocumentManagement = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [services, setServices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string, name: string} | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<RequiredDocument | null>(null);
  
  const handleDeleteClick = (document: RequiredDocument) => {
    setDocumentToDelete({
      id: document.document_id,
      name: document.name
    });
    setDeleteDialogOpen(true);
  };
  
  const handleEditClick = (document: RequiredDocument) => {
    setDocumentToEdit(document);
    setEditDialogOpen(true);
  };
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const orgId = organization?.id;
      
      console.log("Current organization:", organization?.name, "ID:", orgId);
      
      if (!orgId) {
        console.error("No organization ID found");
        setLoading(false);
        return;
      }

      // Get JWT token for authenticated requests
      const token = await getToken();
      
      console.log("Fetching department for organization ID:", orgId);
      
      // First, get the department ID from the organization ID
      try {
        const department = await getDepartmentByOrgId(orgId as string, token || undefined);
        console.log("Found department for organization:", department);
        
        if (!department || !department.department_id) {
          console.error("Could not find department for organization ID:", orgId);
          setLoading(false);
          return;
        }
        
        const departmentId = department.department_id;
        console.log("Fetching services for department ID:", departmentId);
        
        // Fetch services filtered by department ID
        const servicesData = await fetchDepartmentServices(departmentId, token || undefined);
        console.log("Services for this department:", servicesData);
        
        setServicesList(servicesData);
        
        const serviceNameMap = servicesData.reduce<Record<string, string>>((map: Record<string, string>, service: any) => {
          map[service.service_id] = service.name;
          return map;
        }, {});
        setServices(serviceNameMap);
        
        // Fetch all required documents
        const documentsData = await getAllRequiredDocuments();
        console.log("All documents before filtering:", documentsData.length);
        
        // Filter documents to only include those for services in this department
        const filteredDocuments = documentsData.filter(doc => 
          serviceNameMap[doc.service_id] !== undefined
        );
        
        console.log("Filtered documents for this department:", filteredDocuments.length);
        setDocuments(filteredDocuments);
      } catch (err) {
        console.error("Error getting department from organization ID:", err);
        
        // Fallback to user metadata if available
        const departmentId = user?.publicMetadata?.departmentId;
        console.log("Falling back to user metadata department ID:", departmentId);
        
        if (!departmentId) {
          console.error("No department ID found in user metadata");
          setLoading(false);
          return;
        }
        
        console.log("Using department ID from user metadata:", departmentId);
        
        try {
          // Fetch services filtered by department ID from user metadata
          const servicesData = await fetchDepartmentServices(departmentId as number, token || undefined);
          console.log("Services fetched from user metadata department ID:", servicesData?.length);
          
          setServicesList(servicesData);
          
          const serviceNameMap = servicesData.reduce<Record<string, string>>((map: Record<string, string>, service: any) => {
            map[service.service_id] = service.name;
            return map;
          }, {});
          setServices(serviceNameMap);
          
          // Fetch all required documents
          const documentsData = await getAllRequiredDocuments();
          console.log("All documents fetched:", documentsData?.length);
          
          // Filter documents to only include those for services in this department
          const filteredDocuments = documentsData.filter(doc => 
            serviceNameMap[doc.service_id] !== undefined
          );
          
          console.log("Filtered documents for department:", filteredDocuments?.length);
          setDocuments(filteredDocuments);
        } catch (serviceError) {
          console.error("Error fetching services with department ID from user metadata:", serviceError);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Re-fetch data when user or organization changes
  useEffect(() => {
    if (user && organization) {
      console.log("User or organization changed, re-fetching data");
      console.log("Current organization details:", {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      });
      
      // Reset state before fetching new data
      setServices({});
      setServicesList([]);
      setDocuments([]);
      
      // Fetch data with the new organization
      fetchData();
    }
  }, [user, organization?.id]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    if (organization) {
      setLoading(true);
      setServices({});
      setServicesList([]);
      setDocuments([]);
      fetchData();
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (services[doc.service_id]?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Group documents by service for better organization
  const documentsByService = filteredDocuments.reduce<Record<string, RequiredDocument[]>>((acc, doc) => {
    if (!acc[doc.service_id]) {
      acc[doc.service_id] = [];
    }
    acc[doc.service_id].push(doc);
    return acc;
  }, {});

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Document Management</h1>
              <p className="text-gray-600">Manage required documents for your department's services</p>
              {organization && (
                <p className="text-sm text-emerald-600 font-semibold mt-2">
                  Current organization: {organization.name}
                </p>
              )}
            </div>
            {organization && (
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            )}
          </div>
        </header>

        {!organization ? (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700">No organization selected</h3>
            <p className="text-gray-500 mt-2">Please select an organization to manage document requirements</p>
          </div>
        ) : loading && servicesList.length === 0 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services and documents...</p>
          </div>
        ) : servicesList.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700">No services found for this organization</h3>
            <p className="text-gray-500 mt-2">This organization might not be associated with a department or the department has no services</p>
            <p className="text-gray-500 mt-1">Organization ID: {organization.id}</p>
            
            <div className="mt-6">
              <Button 
                onClick={handleRefresh} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="w-full max-w-md">
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <AddDocumentDialog services={servicesList} onDocumentAdded={fetchData} />
            </div>

            {loading ? (
              <div className="text-center py-10">Loading document requirements...</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No document requirements found.</p>
                <div className="mt-4">
                  <AddDocumentDialog services={servicesList} onDocumentAdded={fetchData} />
                </div>
          </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(documentsByService).map(([serviceId, docs]) => (
                  <Card key={serviceId} className="overflow-hidden">
                    <CardHeader className="bg-emerald-50">
                      <div className="flex justify-between items-center">
                        <CardTitle>{services[serviceId] || "Unknown Service"}</CardTitle>
                        <AddDocumentDialog 
                          services={servicesList} 
                          onDocumentAdded={fetchData}
                          serviceId={serviceId}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {docs.map((doc) => (
                          <div key={doc.document_id} className="p-4 border rounded-md bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{doc.name}</h3>
                                {doc.description && <p className="text-sm text-gray-600">{doc.description}</p>}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    doc.is_mandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {doc.is_mandatory ? "Mandatory" : "Optional"}
                                  </span>
                                  {doc.document_format && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                      Formats: {doc.document_format}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditClick(doc)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteClick(doc)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>      {documentToDelete && (
        <DeleteDocumentDialog
          documentId={documentToDelete.id}
          documentName={documentToDelete.name}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDocumentDeleted={fetchData}
        />
      )}
      
      <EditDocumentDialog
        document={documentToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onDocumentUpdated={fetchData}
      />
    </ServiceAdminLayout>
  );
};

export default DocumentManagement;
 
 