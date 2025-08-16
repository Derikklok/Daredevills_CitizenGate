import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateRequiredDocument } from "@/lib/api";
import { useClerk } from "@clerk/clerk-react";
import type { RequiredDocument } from "@/lib/types";

interface EditDocumentDialogProps {
  document: RequiredDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUpdated: () => void;
}

const EditDocumentDialog = ({
  document,
  open,
  onOpenChange,
  onDocumentUpdated
}: EditDocumentDialogProps) => {
  const { session } = useClerk();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMandatory, setIsMandatory] = useState(true);
  const [documentFormat, setDocumentFormat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load document data when dialog opens
  useEffect(() => {
    if (document && open) {
      setName(document.name);
      setDescription(document.description || "");
      setIsMandatory(document.is_mandatory);
      setDocumentFormat(document.document_format || "pdf,jpg,png");
    }
  }, [document, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document || !name) {
      setError("Document name is required.");
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

      await updateRequiredDocument(
        document.document_id,
        {
          name,
          description,
          is_mandatory: isMandatory,
          document_format: documentFormat
        },
        token
      );
      
      onOpenChange(false);
      onDocumentUpdated();
    } catch (error) {
      console.error("Error updating document:", error);
      setError("Failed to update document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!document) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Document Requirement</DialogTitle>
            <DialogDescription>
              Update the document requirement details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
