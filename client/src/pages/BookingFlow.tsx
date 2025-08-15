import {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {
	createDraftAppointment,
	uploadDocument,
	completeAppointment,
} from "@/lib/api";

// Example booking flow component demonstrating the 3-step process
const BookingFlow = () => {
	const navigate = useNavigate();
	const {getToken} = useAuth();
	const [searchParams] = useSearchParams();

	// Step tracking
	const [currentStep, setCurrentStep] = useState(1);
	const [appointmentId, setAppointmentId] = useState<string | null>(
		searchParams.get("appointmentId")
	);

	// Form data
	const [selectedService, setSelectedService] = useState("");
	const [selectedAvailability, setSelectedAvailability] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [personalInfo, setPersonalInfo] = useState({
		full_name: "",
		nic: "",
		phone_number: "",
		birth_date: "",
		gender: "",
		email: "",
		appointment_time: "",
		notes: "",
	});

	// Loading states
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [isUploadingFiles, setIsUploadingFiles] = useState(false);
	const [isCompletingAppointment, setIsCompletingAppointment] = useState(false);

	// Step 1: Service & Availability Selection + Draft Creation
	const handleServiceSelection = async (
		serviceId: string,
		availabilityId: string
	) => {
		try {
			setIsCreatingDraft(true);
			const token = await getToken();
			if (!token) throw new Error("No authentication token");

			const draft = await createDraftAppointment(
				{
					service_id: serviceId,
					availability_id: availabilityId,
				},
				token
			);

			setAppointmentId(draft.appointment_id);
			setSelectedService(serviceId);
			setSelectedAvailability(availabilityId);

			// Update URL with appointment ID
			navigate(`?appointmentId=${draft.appointment_id}`, {replace: true});

			setCurrentStep(2);
		} catch (error) {
			console.error("Failed to create draft appointment:", error);
			alert("Failed to start appointment. Please try again.");
		} finally {
			setIsCreatingDraft(false);
		}
	};

	// Step 2: Document Upload
	const handleFileUpload = async (file: File, requiredDocumentId: string) => {
		if (!appointmentId) return;

		try {
			setIsUploadingFiles(true);
			const token = await getToken();
			if (!token) throw new Error("No authentication token");

			await uploadDocument(
				{
					file,
					serviceId: selectedService,
					requiredDocumentId,
					appointmentId,
				},
				token
			);

			setUploadedFiles((prev) => [...prev, file]);

			// Auto-advance to step 3 after first file upload
			if (uploadedFiles.length === 0) {
				setCurrentStep(3);
			}
		} catch (error) {
			console.error("Failed to upload file:", error);
			alert("Failed to upload file. Please try again.");
		} finally {
			setIsUploadingFiles(false);
		}
	};

	// Step 3: Complete Appointment
	const handleCompleteAppointment = async () => {
		if (!appointmentId) return;

		try {
			setIsCompletingAppointment(true);
			const token = await getToken();
			if (!token) throw new Error("No authentication token");

			await completeAppointment(appointmentId, personalInfo, token);

			// Success! Navigate to confirmation or appointments list
			navigate("/my-appointments?success=true");
		} catch (error) {
			console.error("Failed to complete appointment:", error);
			alert("Failed to complete appointment. Please try again.");
		} finally {
			setIsCompletingAppointment(false);
		}
	};

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-md mx-auto">
				{/* Progress Indicator */}
				<div className="mb-6">
					<div className="flex justify-between items-center">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								currentStep >= 1 ? "bg-primary-500 text-white" : "bg-gray-200"
							}`}>
							1
						</div>
						<div
							className={`flex-1 h-1 mx-2 ${
								currentStep >= 2 ? "bg-primary-500" : "bg-gray-200"
							}`}
						/>
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								currentStep >= 2 ? "bg-primary-500 text-white" : "bg-gray-200"
							}`}>
							2
						</div>
						<div
							className={`flex-1 h-1 mx-2 ${
								currentStep >= 3 ? "bg-primary-500" : "bg-gray-200"
							}`}
						/>
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								currentStep >= 3 ? "bg-primary-500 text-white" : "bg-gray-200"
							}`}>
							3
						</div>
					</div>
					<div className="flex justify-between text-xs mt-2">
						<span>Select Service</span>
						<span>Upload Docs</span>
						<span>Complete</span>
					</div>
				</div>

				{/* Step 1: Service Selection */}
				{currentStep === 1 && (
					<div>
						<h2 className="text-lg font-semibold mb-4">
							Select Service & Time
						</h2>
						<div className="space-y-4">
							{/* Example service selection buttons */}
							<Button
								onClick={() =>
									handleServiceSelection("service-1", "availability-1")
								}
								disabled={isCreatingDraft}
								className="w-full">
								{isCreatingDraft
									? "Creating..."
									: "Passport Renewal - 10:00 AM"}
							</Button>
							<Button
								onClick={() =>
									handleServiceSelection("service-2", "availability-2")
								}
								disabled={isCreatingDraft}
								className="w-full">
								{isCreatingDraft
									? "Creating..."
									: "Birth Certificate - 2:00 PM"}
							</Button>
						</div>
						{appointmentId && (
							<div className="mt-4 p-3 bg-green-50 rounded">
								<p className="text-sm text-green-700">
									Draft created! ID: {appointmentId.slice(0, 8)}...
								</p>
							</div>
						)}
					</div>
				)}

				{/* Step 2: Document Upload */}
				{currentStep === 2 && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
						<div className="space-y-4">
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
								<input
									type="file"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											handleFileUpload(file, "required-doc-1");
										}
									}}
									accept=".pdf,.jpg,.jpeg,.png"
									className="w-full"
								/>
							</div>

							{uploadedFiles.length > 0 && (
								<div className="space-y-2">
									<h3 className="font-medium">Uploaded Files:</h3>
									{uploadedFiles.map((file, index) => (
										<div key={index} className="p-2 bg-gray-50 rounded">
											{file.name}
										</div>
									))}
								</div>
							)}

							<Button onClick={() => setCurrentStep(3)} className="w-full">
								Continue to Personal Info
							</Button>
						</div>
					</div>
				)}

				{/* Step 3: Personal Information */}
				{currentStep === 3 && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Personal Information</h2>
						<div className="space-y-4">
							<input
								type="text"
								placeholder="Full Name"
								value={personalInfo.full_name}
								onChange={(e) =>
									setPersonalInfo((prev) => ({
										...prev,
										full_name: e.target.value,
									}))
								}
								className="w-full p-2 border rounded"
							/>
							<input
								type="text"
								placeholder="NIC"
								value={personalInfo.nic}
								onChange={(e) =>
									setPersonalInfo((prev) => ({...prev, nic: e.target.value}))
								}
								className="w-full p-2 border rounded"
							/>
							<input
								type="tel"
								placeholder="Phone Number"
								value={personalInfo.phone_number}
								onChange={(e) =>
									setPersonalInfo((prev) => ({
										...prev,
										phone_number: e.target.value,
									}))
								}
								className="w-full p-2 border rounded"
							/>
							<input
								type="date"
								placeholder="Birth Date"
								value={personalInfo.birth_date}
								onChange={(e) =>
									setPersonalInfo((prev) => ({
										...prev,
										birth_date: e.target.value,
									}))
								}
								className="w-full p-2 border rounded"
							/>
							<select
								value={personalInfo.gender}
								onChange={(e) =>
									setPersonalInfo((prev) => ({...prev, gender: e.target.value}))
								}
								className="w-full p-2 border rounded">
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
							<input
								type="datetime-local"
								placeholder="Appointment Time"
								value={personalInfo.appointment_time}
								onChange={(e) =>
									setPersonalInfo((prev) => ({
										...prev,
										appointment_time: e.target.value,
									}))
								}
								className="w-full p-2 border rounded"
							/>

							<Button
								onClick={handleCompleteAppointment}
								disabled={
									isCompletingAppointment ||
									!personalInfo.full_name ||
									!personalInfo.nic
								}
								className="w-full">
								{isCompletingAppointment
									? "Completing..."
									: "Complete Appointment"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BookingFlow;
