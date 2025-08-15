// import {useState, useEffect} from "react";
// import {useNavigate, useSearchParams} from "react-router-dom";
// import {useAuth} from "@clerk/clerk-react";
// import {Button} from "@/components/ui/button";
// import {
// 	createDraftAppointment,
// 	uploadDocument,
// 	completeAppointment,
// } from "@/lib/api";

// // Example booking flow component demonstrating the 3-step process
// const BookingFlow = () => {
// 	const navigate = useNavigate();
// 	const {getToken} = useAuth();
// 	const [searchParams] = useSearchParams();

// 	// Step tracking
// 	const [currentStep, setCurrentStep] = useState(1);
// 	const [appointmentId, setAppointmentId] = useState<string | null>(
// 		searchParams.get("appointmentId")
// 	);

// 	// Form data
// 	const [selectedService, setSelectedService] = useState("");
// 	const [selectedAvailability, setSelectedAvailability] = useState("");
// 	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
// 	const [personalInfo, setPersonalInfo] = useState({
// 		full_name: "",
// 		nic: "",
// 		phone_number: "",
// 		birth_date: "",
// 		gender: "",
// 		email: "",
// 		appointment_time: "",
// 		notes: "",
// 	});

// 	// Loading states
// 	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
// 	const [isUploadingFiles, setIsUploadingFiles] = useState(false);
// 	const [isCompletingAppointment, setIsCompletingAppointment] = useState(false);

// 	// Step 1: Service & Availability Selection + Draft Creation
// 	const handleServiceSelection = async (
// 		serviceId: string,
// 		availabilityId: string
// 	) => {
// 		try {
// 			setIsCreatingDraft(true);
// 			const token = await getToken();
// 			if (!token) throw new Error("No authentication token");

// 			const draft = await createDraftAppointment(
// 				{
// 					service_id: serviceId,
// 					availability_id: availabilityId,
// 				},
// 				token
// 			);

// 			setAppointmentId(draft.appointment_id);
// 			setSelectedService(serviceId);
// 			setSelectedAvailability(availabilityId);

// 			// Update URL with appointment ID
// 			navigate(`?appointmentId=${draft.appointment_id}`, {replace: true});

// 			setCurrentStep(2);
// 		} catch (error) {
// 			console.error("Failed to create draft appointment:", error);
// 			alert("Failed to start appointment. Please try again.");
// 		} finally {
// 			setIsCreatingDraft(false);
// 		}
// 	};

// 	// Step 2: Document Upload
// 	const handleFileUpload = async (file: File, requiredDocumentId: string) => {
// 		if (!appointmentId) return;

// 		try {
// 			setIsUploadingFiles(true);
// 			const token = await getToken();
// 			if (!token) throw new Error("No authentication token");

// 			await uploadDocument(
// 				{
// 					file,
// 					serviceId: selectedService,
// 					requiredDocumentId,
// 					appointmentId,
// 				},
// 				token
// 			);

// 			setUploadedFiles((prev) => [...prev, file]);

// 			// Auto-advance to step 3 after first file upload
// 			if (uploadedFiles.length === 0) {
// 				setCurrentStep(3);
// 			}
// 		} catch (error) {
// 			console.error("Failed to upload file:", error);
// 			alert("Failed to upload file. Please try again.");
// 		} finally {
// 			setIsUploadingFiles(false);
// 		}
// 	};

// 	// Step 3: Complete Appointment
// 	const handleCompleteAppointment = async () => {
// 		if (!appointmentId) return;

// 		try {
// 			setIsCompletingAppointment(true);
// 			const token = await getToken();
// 			if (!token) throw new Error("No authentication token");

// 			await completeAppointment(appointmentId, personalInfo, token);

// 			// Success! Navigate to confirmation or appointments list
// 			navigate("/my-appointments?success=true");
// 		} catch (error) {
// 			console.error("Failed to complete appointment:", error);
// 			alert("Failed to complete appointment. Please try again.");
// 		} finally {
// 			setIsCompletingAppointment(false);
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen p-4">
// 			<div className="max-w-md mx-auto">
// 				{/* Progress Indicator */}
// 				<div className="mb-6">
// 					<div className="flex justify-between items-center">
// 						<div
// 							className={`w-8 h-8 rounded-full flex items-center justify-center ${
// 								currentStep >= 1 ? "bg-primary-500 text-white" : "bg-gray-200"
// 							}`}>
// 							1
// 						</div>
// 						<div
// 							className={`flex-1 h-1 mx-2 ${
// 								currentStep >= 2 ? "bg-primary-500" : "bg-gray-200"
// 							}`}
// 						/>
// 						<div
// 							className={`w-8 h-8 rounded-full flex items-center justify-center ${
// 								currentStep >= 2 ? "bg-primary-500 text-white" : "bg-gray-200"
// 							}`}>
// 							2
// 						</div>
// 						<div
// 							className={`flex-1 h-1 mx-2 ${
// 								currentStep >= 3 ? "bg-primary-500" : "bg-gray-200"
// 							}`}
// 						/>
// 						<div
// 							className={`w-8 h-8 rounded-full flex items-center justify-center ${
// 								currentStep >= 3 ? "bg-primary-500 text-white" : "bg-gray-200"
// 							}`}>
// 							3
// 						</div>
// 					</div>
// 					<div className="flex justify-between text-xs mt-2">
// 						<span>Select Service</span>
// 						<span>Upload Docs</span>
// 						<span>Complete</span>
// 					</div>
// 				</div>

// 				{/* Step 1: Service Selection */}
// 				{currentStep === 1 && (
// 					<div>
// 						<h2 className="text-lg font-semibold mb-4">
// 							Select Service & Time
// 						</h2>
// 						<div className="space-y-4">
// 							{/* Example service selection buttons */}
// 							<Button
// 								onClick={() =>
// 									handleServiceSelection("service-1", "availability-1")
// 								}
// 								disabled={isCreatingDraft}
// 								className="w-full">
// 								{isCreatingDraft
// 									? "Creating..."
// 									: "Passport Renewal - 10:00 AM"}
// 							</Button>
// 							<Button
// 								onClick={() =>
// 									handleServiceSelection("service-2", "availability-2")
// 								}
// 								disabled={isCreatingDraft}
// 								className="w-full">
// 								{isCreatingDraft
// 									? "Creating..."
// 									: "Birth Certificate - 2:00 PM"}
// 							</Button>
// 						</div>
// 						{appointmentId && (
// 							<div className="mt-4 p-3 bg-green-50 rounded">
// 								<p className="text-sm text-green-700">
// 									Draft created! ID: {appointmentId.slice(0, 8)}...
// 								</p>
// 							</div>
// 						)}
// 					</div>
// 				)}

// 				{/* Step 2: Document Upload */}
// 				{currentStep === 2 && (
// 					<div>
// 						<h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
// 						<div className="space-y-4">
// 							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
// 								<input
// 									type="file"
// 									onChange={(e) => {
// 										const file = e.target.files?.[0];
// 										if (file) {
// 											handleFileUpload(file, "required-doc-1");
// 										}
// 									}}
// 									accept=".pdf,.jpg,.jpeg,.png"
// 									className="w-full"
// 								/>
// 							</div>

// 							{uploadedFiles.length > 0 && (
// 								<div className="space-y-2">
// 									<h3 className="font-medium">Uploaded Files:</h3>
// 									{uploadedFiles.map((file, index) => (
// 										<div key={index} className="p-2 bg-gray-50 rounded">
// 											{file.name}
// 										</div>
// 									))}
// 								</div>
// 							)}

// 							<Button onClick={() => setCurrentStep(3)} className="w-full">
// 								Continue to Personal Info
// 							</Button>
// 						</div>
// 					</div>
// 				)}

// 				{/* Step 3: Personal Information */}
// 				{currentStep === 3 && (
// 					<div>
// 						<h2 className="text-lg font-semibold mb-4">Personal Information</h2>
// 						<div className="space-y-4">
// 							<input
// 								type="text"
// 								placeholder="Full Name"
// 								value={personalInfo.full_name}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({
// 										...prev,
// 										full_name: e.target.value,
// 									}))
// 								}
// 								className="w-full p-2 border rounded"
// 							/>
// 							<input
// 								type="text"
// 								placeholder="NIC"
// 								value={personalInfo.nic}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({...prev, nic: e.target.value}))
// 								}
// 								className="w-full p-2 border rounded"
// 							/>
// 							<input
// 								type="tel"
// 								placeholder="Phone Number"
// 								value={personalInfo.phone_number}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({
// 										...prev,
// 										phone_number: e.target.value,
// 									}))
// 								}
// 								className="w-full p-2 border rounded"
// 							/>
// 							<input
// 								type="date"
// 								placeholder="Birth Date"
// 								value={personalInfo.birth_date}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({
// 										...prev,
// 										birth_date: e.target.value,
// 									}))
// 								}
// 								className="w-full p-2 border rounded"
// 							/>
// 							<select
// 								value={personalInfo.gender}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({...prev, gender: e.target.value}))
// 								}
// 								className="w-full p-2 border rounded">
// 								<option value="">Select Gender</option>
// 								<option value="Male">Male</option>
// 								<option value="Female">Female</option>
// 								<option value="Other">Other</option>
// 							</select>
// 							<input
// 								type="datetime-local"
// 								placeholder="Appointment Time"
// 								value={personalInfo.appointment_time}
// 								onChange={(e) =>
// 									setPersonalInfo((prev) => ({
// 										...prev,
// 										appointment_time: e.target.value,
// 									}))
// 								}
// 								className="w-full p-2 border rounded"
// 							/>

// 							<Button
// 								onClick={handleCompleteAppointment}
// 								disabled={
// 									isCompletingAppointment ||
// 									!personalInfo.full_name ||
// 									!personalInfo.nic
// 								}
// 								className="w-full">
// 								{isCompletingAppointment
// 									? "Completing..."
// 									: "Complete Appointment"}
// 							</Button>
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight, ClipboardList, MapPin, Phone, Mail, Clock } from "lucide-react";
import ApiService from "@/lib/api-service";
import type { Department, Service } from "@/lib/api-service";

const BookingFlow = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const data = await ApiService.getDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load departments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle department selection
  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setSelectedService(null);
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  // Reset selection to go back to department list
  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedService(null);
  };

  // Reset selection to go back to service list
  const handleBackToServices = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#8D153A] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Book Government Appointments</h1>
          <p className="text-lg">Select a department, service, and schedule your appointment</p>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-4 px-6">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#8D153A]">Home</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-500">Book Appointment</span>
            {selectedDepartment && (
              <>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <button 
                  onClick={handleBackToDepartments} 
                  className="text-[#8D153A] hover:underline"
                >
                  {selectedDepartment.name}
                </button>
              </>
            )}
            {selectedService && (
              <>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <button 
                  onClick={handleBackToServices} 
                  className="text-[#8D153A] hover:underline"
                >
                  {selectedService.name}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D153A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Step 1: Select Department */}
            {!selectedDepartment && (
              <div>
                <div className="flex items-center mb-6">
                  <Building2 size={24} className="mr-3 text-[#8D153A]" />
                  <h2 className="text-2xl font-bold">Select a Department</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departments.map((department) => (
                    <div 
                      key={department.department_id} 
                      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleDepartmentSelect(department)}
                    >
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-3 text-[#8D153A]">{department.name}</h3>
                        
                        <div className="space-y-3 mb-4 text-gray-600">
                          {department.address && (
                            <div className="flex items-start">
                              <MapPin size={18} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span>{department.address}</span>
                            </div>
                          )}
                          {department.contact_email && (
                            <div className="flex items-center">
                              <Mail size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                              <span className="text-sm">{department.contact_email}</span>
                            </div>
                          )}
                          {department.contact_phone && (
                            <div className="flex items-center">
                              <Phone size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                              <span>{department.contact_phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {department.services.length} Services
                          </span>
                          <ChevronRight size={20} className="text-[#8D153A]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Service */}
            {selectedDepartment && !selectedService && (
              <div>
                <div className="flex items-center mb-6">
                  <ClipboardList size={24} className="mr-3 text-[#8D153A]" />
                  <h2 className="text-2xl font-bold">Select a Service</h2>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                  <h3 className="font-bold text-xl mb-3 text-[#8D153A]">{selectedDepartment.name}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    {selectedDepartment.address && (
                      <div className="flex items-start">
                        <MapPin size={18} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{selectedDepartment.address}</span>
                      </div>
                    )}
                    {selectedDepartment.contact_email && (
                      <div className="flex items-center">
                        <Mail size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">{selectedDepartment.contact_email}</span>
                      </div>
                    )}
                    {selectedDepartment.contact_phone && (
                      <div className="flex items-center">
                        <Phone size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>{selectedDepartment.contact_phone}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="text-[#8D153A] border-[#8D153A]"
                    onClick={handleBackToDepartments}
                  >
                    Choose Different Department
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Available Services</h3>
                  
                  {selectedDepartment.services.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
                      No services available for this department at the moment.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDepartment.services.map((service) => (
                        <div 
                          key={service.service_id}
                          className="bg-white p-6 rounded-lg border hover:border-[#8D153A] hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <h4 className="text-lg font-bold text-[#8D153A] mb-2">{service.name}</h4>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          
                          <div className="flex flex-wrap gap-3">
                            <div className="bg-gray-100 px-3 py-1 rounded text-sm flex items-center">
                              <Clock size={14} className="mr-1 text-gray-500" />
                              {service.estimated_total_completion_time}
                            </div>
                            {service.category && (
                              <div className="bg-gray-100 px-3 py-1 rounded text-sm">
                                {service.category}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: View Availability */}
            {selectedService && (
              <div>
                <div className="flex items-center mb-6">
                  <Clock size={24} className="mr-3 text-[#8D153A]" />
                  <h2 className="text-2xl font-bold">Service Details & Availability</h2>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                  <h3 className="font-bold text-xl mb-2 text-[#8D153A]">{selectedService.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedService.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 font-medium">Department:</span>{" "}
                      <span className="text-gray-800">{selectedDepartment?.name}</span>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 font-medium">Category:</span>{" "}
                      <span className="text-gray-800">{selectedService.category}</span>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 font-medium">Estimated Time:</span>{" "}
                      <span className="text-gray-800">{selectedService.estimated_total_completion_time}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="text-[#8D153A] border-[#8D153A]"
                      onClick={handleBackToServices}
                    >
                      Choose Different Service
                    </Button>
                    
                    <Link to={`/calendar/${selectedService.service_id}`}>
                      <Button className="bg-[#8D153A] hover:bg-[#8D153A]/90">
                        View Available Slots
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BookingFlow;
