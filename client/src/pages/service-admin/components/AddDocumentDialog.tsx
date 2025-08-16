import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addRequiredDocument } from "@/lib/api";
import { useClerk } from "@clerk/clerk-react";
import type { Service } from "@/lib/types";

interface AddDocumentDialogProps {
  services: Service[];
  onDocumentAdded: () => void;
  serviceId?: string; // Optional service ID to pre-select
}

const AddDocumentDialog = ({ services, onDocumentAdded, serviceId }: AddDocumentDialogProps) => {
  const { session } = useClerk();
  const [open, setOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(serviceId || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMandatory, setIsMandatory] = useState(true);
  const [documentFormat, setDocumentFormat] = useState("pdf,jpg,png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceId || !name) {
      setError("Service and document name are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Get the token from Clerk session
      if (!session) {
        throw new Error("No active session");
      }
      
      const token = await session.getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      await addRequiredDocument({
        service_id: selectedServiceId,
        name,
        description,
        is_mandatory: isMandatory,
        document_format: documentFormat
      }, token);
      
      // Reset form and close dialog
      setName("");
      setDescription("");
      setIsMandatory(true);
      setDocumentFormat("pdf,jpg,png");
      setOpen(false);
      
      // Notify parent component to refresh data
      onDocumentAdded();
    } catch (error) {
      console.error("Error adding document:", error);
      setError("Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Document Requirement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Document Requirement</DialogTitle>
            <DialogDescription>
              Add a new required document for a service. This will be displayed to users when booking appointments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select 
                value={selectedServiceId} 
                onValueChange={setSelectedServiceId}
                disabled={!!serviceId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.service_id} value={service.service_id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Document Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formats" className="text-right">
                Allowed Formats
              </Label>
              <Input
                id="formats"
                value={documentFormat}
                onChange={(e) => setDocumentFormat(e.target.value)}
                className="col-span-3"
                placeholder="e.g., pdf,jpg,png"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mandatory" className="text-right">
                Mandatory
              </Label>
              <div className="flex items-center col-span-3">
                <Switch 
                  id="mandatory" 
                  checked={isMandatory}
                  onCheckedChange={setIsMandatory}
                />
                <span className="ml-2 text-sm text-gray-500">
                  {isMandatory ? "Required document" : "Optional document"}
                </span>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
