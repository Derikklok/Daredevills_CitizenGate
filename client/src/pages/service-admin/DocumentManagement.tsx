import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";

// Types
interface RequiredDocument {
  document_id: string;
  service_id: string;
  service_name: string;
  name: string;
  description: string;
  is_mandatory: boolean;
  document_format: string;
  created_at: string;
  updated_at: string;
}

const DocumentManagement = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real application, you would fetch the documents from your API
        // using the user's department ID from metadata
        
        // Mock data for demonstration
        const mockDocuments: RequiredDocument[] = [
          {
            document_id: "1",
            service_id: "1",
            service_name: "Passport Application",
            name: "Birth Certificate",
            description: "Original or certified copy of birth certificate",
            is_mandatory: true,
            document_format: "pdf,jpg,png",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            document_id: "2",
            service_id: "1",
            service_name: "Passport Application",
            name: "ID Card",
            description: "Valid national ID card",
            is_mandatory: true,
            document_format: "pdf,jpg,png",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            document_id: "3",
            service_id: "2",
            service_name: "Passport Renewal",
            name: "Old Passport",
            description: "Expired or expiring passport",
            is_mandatory: true,
            document_format: "pdf,jpg,png",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            document_id: "4",
            service_id: "2",
            service_name: "Passport Renewal",
            name: "Recent Photo",
            description: "Passport-size photo taken within the last 6 months",
            is_mandatory: true,
            document_format: "jpg,png",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
        ];
        
        setDocuments(mockDocuments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.service_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-800">Document Management</h1>
          <p className="text-gray-600">Manage required documents for your department's services</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button>Add New Document Requirement</Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading document requirements...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No document requirements found.</p>
            <Button className="mt-4">Add Your First Document Requirement</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(documentsByService).map(([serviceId, docs]) => (
              <Card key={serviceId} className="overflow-hidden">
                <CardHeader className="bg-emerald-50">
                  <div className="flex justify-between items-center">
                    <CardTitle>{docs[0].service_name}</CardTitle>
                    <Button size="sm" variant="outline">
                      Add Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {docs.map((doc) => (
                      <div key={doc.document_id} className="p-4 border rounded-md bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-gray-600">{doc.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                doc.is_mandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {doc.is_mandatory ? "Mandatory" : "Optional"}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                Formats: {doc.document_format}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800">
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
      </div>
    </ServiceAdminLayout>
  );
};

export default DocumentManagement;
 
 