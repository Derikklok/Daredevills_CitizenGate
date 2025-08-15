import {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {ArrowLeft, CheckCircle, Calendar, Clock, User} from "lucide-react";
import {
	completeAppointment,
	getAppointmentDocuments,
	getAppointment,
} from "@/lib/api";

export default function CompleteAppointment() {
	const navigate = useNavigate();
	const {getToken} = useAuth();
	const [searchParams] = useSearchParams();

	// Get appointment and service IDs from URL parameters
	const appointmentId = searchParams.get("appointmentId");
	const serviceId = searchParams.get("serviceId");

	const [formData, setFormData] = useState({
		full_name: "",
		nic: "",
		phone_number: "",
		address: "",
		birth_date: "",
		gender: "",
		email: "",
		notes: "",
	});

	const [appointmentTime, setAppointmentTime] = useState<string>("");
	const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCompleting, setIsCompleting] = useState(false);
	const [errors, setErrors] = useState<{[key: string]: string}>({});

	// Load appointment details and uploaded documents
	useEffect(() => {
		if (appointmentId) {
			loadAppointmentDetails();
			loadUploadedDocuments();
		}
	}, [appointmentId]);

	const loadAppointmentDetails = async () => {
		if (!appointmentId) return;

		try {
			const token = await getToken();
			if (!token) return;

			const appointment = await getAppointment(appointmentId, token);
			// Set the appointment time that was already chosen in previous step
			if (appointment.appointment_time) {
				setAppointmentTime(appointment.appointment_time);
			}
		} catch (error) {
			console.error("Failed to load appointment details:", error);
		}
	};

	const loadUploadedDocuments = async () => {
		if (!appointmentId) return;

		try {
			setIsLoading(true);
			const token = await getToken();
			if (!token) return;

			const docs = await getAppointmentDocuments(appointmentId, token);
			setUploadedDocuments(docs);
		} catch (error) {
			console.error("Failed to load documents:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({...prev, [name]: ""}));
		}
	};

	const validateForm = () => {
		const newErrors: {[key: string]: string} = {};

		if (!formData.full_name.trim())
			newErrors.full_name = "Full name is required";
		if (!formData.nic.trim()) newErrors.nic = "NIC is required";
		if (!formData.phone_number.trim())
			newErrors.phone_number = "Phone number is required";
		if (!formData.birth_date) newErrors.birth_date = "Birth date is required";
		if (!formData.gender) newErrors.gender = "Gender is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		if (!appointmentId) {
			alert(
				"Missing appointment information. Please start the booking process again."
			);
			return;
		}

		try {
			setIsCompleting(true);

			const token = await getToken();
			if (!token) {
				throw new Error("Authentication required");
			}

			// The completion API expects appointment_time but not documents_submitted
			// Documents are already linked to the appointment via the upload API
			const completionData = {
				...formData,
				appointment_time: appointmentTime, // Use the pre-selected appointment time
			};

			await completeAppointment(appointmentId, completionData, token);

			// Success! Navigate to confirmation
			navigate(`/appointment-confirmation?appointmentId=${appointmentId}`);
		} catch (error) {
			console.error("Failed to complete appointment:", error);
			alert(`Failed to complete appointment: ${error}`);
		} finally {
			setIsCompleting(false);
		}
	};

	// Early return if missing required parameters
	if (!appointmentId || !serviceId) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Missing Information
					</h2>
					<p className="text-gray-600 mb-4">
						Appointment information is missing. Please start the booking process
						again.
					</p>
					<Button onClick={() => navigate("/my-appointments")}>
						Back to Appointments
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex flex-col gap-4 px-2 pt-4">
				<div className="flex items-center">
					<Button
						variant="ghost"
						onClick={() => navigate(-1)}
						className="mr-4 p-2">
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<h1 className="text-xl font-semibold text-gray-900">
						Complete Appointment
					</h1>
				</div>

				{/* Progress Bar */}
				<Progress value={100} className="w-full" />
				<div className="text-sm text-gray-600 text-center">
					Step 3 of 3: Personal Details
				</div>
			</div>

			<div className="p-4 space-y-6">
				{/* Appointment Time Summary */}
				{appointmentTime && (
					<Card className="bg-white border-0">
						<CardContent className="p-6">
							<div className="flex items-center mb-4">
								<Calendar className="w-5 h-5 text-blue-600 mr-2" />
								<h2 className="text-lg font-semibold text-gray-900">
									Scheduled Appointment
								</h2>
							</div>
							<div className="flex items-center p-3 bg-blue-50 rounded-lg">
								<Clock className="w-4 h-4 text-blue-600 mr-2" />
								<span className="text-sm text-gray-700">
									{new Date(appointmentTime).toLocaleDateString()} at{" "}
									{new Date(appointmentTime).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Documents Summary */}
				<Card className="bg-white border-0">
					<CardContent className="p-6">
						<div className="flex items-center mb-4">
							<CheckCircle className="w-5 h-5 text-green-600 mr-2" />
							<h2 className="text-lg font-semibold text-gray-900">
								Documents Uploaded
							</h2>
						</div>

						{isLoading ? (
							<div className="text-sm text-gray-600">Loading documents...</div>
						) : uploadedDocuments.length > 0 ? (
							<div className="space-y-2">
								{uploadedDocuments.map((doc, index) => (
									<div
										key={index}
										className="flex items-center p-2 bg-green-50 rounded">
										<CheckCircle className="w-4 h-4 text-green-600 mr-2" />
										<span className="text-sm text-gray-700">
											{doc.fileName}
										</span>
									</div>
								))}
							</div>
						) : (
							<div className="text-sm text-amber-600">
								No documents uploaded yet. You can continue and upload them
								later.
							</div>
						)}
					</CardContent>
				</Card>

				{/* Personal Information Form */}
				<Card className="bg-white border-0">
					<CardContent className="p-6">
						<div className="flex items-center mb-4">
							<User className="w-5 h-5 text-primary-600 mr-2" />
							<h2 className="text-lg font-semibold text-gray-900">
								Personal Information
							</h2>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name *
								</label>
								<input
									type="text"
									name="full_name"
									value={formData.full_name}
									onChange={handleInputChange}
									className={`w-full p-3 border rounded-lg ${
										errors.full_name ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Enter your full name"
								/>
								{errors.full_name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.full_name}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									NIC Number *
								</label>
								<input
									type="text"
									name="nic"
									value={formData.nic}
									onChange={handleInputChange}
									className={`w-full p-3 border rounded-lg ${
										errors.nic ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Enter your NIC number"
								/>
								{errors.nic && (
									<p className="text-red-500 text-xs mt-1">{errors.nic}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Phone Number *
								</label>
								<input
									type="tel"
									name="phone_number"
									value={formData.phone_number}
									onChange={handleInputChange}
									className={`w-full p-3 border rounded-lg ${
										errors.phone_number ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Enter your phone number"
								/>
								{errors.phone_number && (
									<p className="text-red-500 text-xs mt-1">
										{errors.phone_number}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Address
								</label>
								<input
									type="text"
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									className="w-full p-3 border border-gray-300 rounded-lg"
									placeholder="Enter your address"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Birth Date *
								</label>
								<input
									type="date"
									name="birth_date"
									value={formData.birth_date}
									onChange={handleInputChange}
									className={`w-full p-3 border rounded-lg ${
										errors.birth_date ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.birth_date && (
									<p className="text-red-500 text-xs mt-1">
										{errors.birth_date}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Gender *
								</label>
								<select
									name="gender"
									value={formData.gender}
									onChange={handleInputChange}
									className={`w-full p-3 border rounded-lg ${
										errors.gender ? "border-red-500" : "border-gray-300"
									}`}>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
								{errors.gender && (
									<p className="text-red-500 text-xs mt-1">{errors.gender}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full p-3 border border-gray-300 rounded-lg"
									placeholder="Enter your email address"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Additional Notes
								</label>
								<textarea
									name="notes"
									value={formData.notes}
									onChange={handleInputChange}
									rows={3}
									className="w-full p-3 border border-gray-300 rounded-lg"
									placeholder="Any additional information or special requests"
								/>
							</div>

							<Button
								type="submit"
								disabled={isCompleting}
								className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 mt-6">
								{isCompleting
									? "Completing Appointment..."
									: "Complete Appointment"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
