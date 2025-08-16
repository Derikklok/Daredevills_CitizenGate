import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteRequiredDocument } from "@/lib/api";
import { useClerk } from "@clerk/clerk-react";

interface DeleteDocumentDialogProps {
  documentId: string;
  documentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentDeleted: () => void;
}

const DeleteDocumentDialog = ({ 
  documentId, 
  documentName, 
  open, 
  onOpenChange, 
  onDocumentDeleted 
}: DeleteDocumentDialogProps) => {
  const { session } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Get the token from Clerk session
      if (!session) {
        throw new Error("No active session");
      }
      
      const token = await session.getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      await deleteRequiredDocument(documentId, token);
      
      onOpenChange(false);
      onDocumentDeleted();
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Document Requirement</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the "{documentName}" requirement? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocumentDialog;
