export interface PersonalDetails {
    name: string;
    phone: string;
    email: string;
  }
  
  export interface DocumentInfo {
    id: string;
    label: string;
    required: boolean;
  }
  
  export interface UploadedFiles {
    [docId: string]: File | null;
  }
  
  export interface CheckedDocuments {
    [docId: string]: boolean;
  }
  
  export interface AppointmentData {
    category?: string;
    service?: string;
    personalDetails?: PersonalDetails;
    documents?: CheckedDocuments;
    uploadedFiles?: UploadedFiles;
    paymentMethod?: string;
    additionalInfo?: string;
    location?: string;
    date?: Date | null;
    time?: string;
  }
  
  export interface StepProps {
    appointmentData: AppointmentData;
    onNext: (data: AppointmentData) => void;
    onBack: () => void;
  }
  