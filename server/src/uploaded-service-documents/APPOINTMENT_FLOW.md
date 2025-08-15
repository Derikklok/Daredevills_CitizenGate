# Appointment Booking Flow with Document Upload

This document explains the improved appointment booking flow that solves the chicken-and-egg problem of needing an appointment ID for document uploads.

## 🔄 **The Problem**

Previously, users needed to complete the entire appointment form to get an appointment ID, but document uploads required that ID. This created a poor UX where users couldn't upload documents until after completing the form.

## ✅ **The Solution: 3-Step Draft Pattern**

### **Step 1: Create Draft Appointment**
```
POST /api/appointments/draft
```

**Request:**
```json
{
  "service_id": "uuid",
  "availability_id": "uuid",
  "user_id": "user_123" // From auth context
}
```

**Response:**
```json
{
  "appointment_id": "draft-uuid",
  "status": "draft",
  "service_id": "uuid",
  "availability_id": "uuid"
}
```

### **Step 2: Upload Documents (Multiple Files)**
```
POST /api/uploaded-service-documents/upload
```

**Request (multipart/form-data):**
```
file: [PDF file]
serviceId: "service-uuid"
requiredDocumentId: "document-uuid"
appointmentId: "draft-uuid" // From step 1
```

**Response:**
```json
{
  "id": "document-uuid",
  "fileName": "passport.pdf",
  "appointmentId": "draft-uuid",
  "status": "uploaded"
}
```

### **Step 3: Complete Appointment**
```
PUT /api/appointments/{draft-uuid}/complete
```

**Request:**
```json
{
  "full_name": "John Doe",
  "nic": "123456789V",
  "phone_number": "+94771234567",
  "birth_date": "1990-01-01",
  "gender": "Male",
  "appointment_time": "2025-08-15T10:30:00Z",
  "email": "john@example.com",
  "notes": "First time application"
}
```

**Response:**
```json
{
  "appointment_id": "draft-uuid",
  "status": "pending", // Changed from "draft"
  "full_name": "John Doe",
  "documents_count": 3 // Number of uploaded documents
}
```

## 🎯 **Frontend Flow**

### **React Component Structure**

```typescript
// 1. Service Selection & Draft Creation
const handleServiceSelection = async (serviceId, availabilityId) => {
  const draft = await createDraftAppointment({
    service_id: serviceId,
    availability_id: availabilityId
  });
  
  setAppointmentId(draft.appointment_id);
  setStep(2); // Move to document upload
};

// 2. Document Upload
const handleDocumentUpload = async (file, requiredDocumentId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('serviceId', serviceId);
  formData.append('requiredDocumentId', requiredDocumentId);
  formData.append('appointmentId', appointmentId); // From step 1
  
  await uploadDocument(formData);
  setStep(3); // Move to form completion
};

// 3. Complete Appointment
const handleFormSubmit = async (formData) => {
  await completeAppointment(appointmentId, formData);
  // Appointment is now complete!
};
```

## 🔧 **Database Schema**

### **Appointment Status Flow**
```
draft → pending → confirmed → completed/cancelled
```

### **Draft Appointment Fields**
- Required: `service_id`, `availability_id`, `appointment_status: 'draft'`
- Placeholder: `full_name: 'DRAFT_PENDING'`, `nic: 'DRAFT_PENDING'`
- User tracking: `notes: 'Draft appointment for user: {userId}'`

## 🚀 **Alternative Solutions**

### **Option 2: Temporary File Storage**
Store files temporarily without appointment ID, then associate them later:

```typescript
// 1. Upload to temporary storage
POST /api/uploaded-service-documents/temp-upload

// 2. Create appointment with temp file IDs
POST /api/appointments
{
  ...appointmentData,
  temp_file_ids: ["temp-id-1", "temp-id-2"]
}
```

### **Option 3: Session-Based Storage**
Use session/local storage to hold files until form completion:

```typescript
// Store files in browser until form completion
const [pendingFiles, setPendingFiles] = useState([]);

// Upload all files after appointment creation
const handleSubmit = async () => {
  const appointment = await createAppointment(formData);
  await Promise.all(
    pendingFiles.map(file => uploadFile(file, appointment.id))
  );
};
```

## 📋 **Recommended Approach**

**Use the Draft Pattern** because it:

✅ **Provides immediate appointment ID**
✅ **Allows real file uploads (not temporary)**
✅ **Maintains data integrity**
✅ **Supports progress tracking**
✅ **Enables better error handling**
✅ **Works with your existing file upload system**

## 🔄 **Migration Path**

1. **Deploy the new endpoints** (draft, complete)
2. **Update frontend** to use 3-step flow
3. **Keep existing single-step** for backward compatibility
4. **Gradually migrate users** to new flow
5. **Eventually deprecate** old single-step approach

This solution provides a smooth user experience while maintaining data integrity and supporting your existing upload infrastructure!
