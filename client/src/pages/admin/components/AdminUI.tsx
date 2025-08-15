import { useState } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirmLoading?: boolean;
  confirmButtonClass?: string;
}

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isConfirmLoading = false,
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isConfirmLoading}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirmLoading}
            className={`px-4 py-2 text-white rounded-md ${confirmButtonClass} ${
              isConfirmLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isConfirmLoading ? "Processing..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useConfirmation = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<{
    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText: string;
    onConfirm: () => void;
    isLoading: boolean;
    confirmButtonClass?: string;
  }>({
    title: "",
    message: "",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    onConfirm: () => {},
    isLoading: false,
    confirmButtonClass: "bg-red-600 hover:bg-red-700",
  });

  const showConfirmation = ({
    title,
    message,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    onConfirm,
    confirmButtonClass,
  }: {
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm: () => void;
    confirmButtonClass?: string;
  }) => {
    setConfirmationState({
      title,
      message,
      confirmButtonText,
      cancelButtonText,
      onConfirm,
      isLoading: false,
      confirmButtonClass,
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setConfirmationState((prev) => ({ ...prev, isLoading: true }));
      await confirmationState.onConfirm();
    } finally {
      setConfirmationState((prev) => ({ ...prev, isLoading: false }));
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const ConfirmationDialogComponent = () => (
    <ConfirmationDialog
      isOpen={isDialogOpen}
      title={confirmationState.title}
      message={confirmationState.message}
      confirmButtonText={confirmationState.confirmButtonText}
      cancelButtonText={confirmationState.cancelButtonText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      isConfirmLoading={confirmationState.isLoading}
      confirmButtonClass={confirmationState.confirmButtonClass}
    />
  );

  return {
    showConfirmation,
    ConfirmationDialog: ConfirmationDialogComponent,
  };
};

export const StatusBadge = ({
  status,
  text,
}: {
  status: "success" | "error" | "warning" | "info" | "pending";
  text: string;
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusClasses()}`}
    >
      {text}
    </span>
  );
};
