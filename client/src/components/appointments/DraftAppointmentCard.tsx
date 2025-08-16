import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import type {Appointment} from "@/lib/types";
import {
	Calendar,
	Clock,
	MapPin,
	ChevronRight,
	FileText,
	AlertCircle,
	Trash2,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {cancelAppointment} from "@/lib/api";

interface DraftAppointmentCardProps {
	appointment: Appointment;
	onUpdate?: () => void;
}

export function DraftAppointmentCard({
	appointment,
	onUpdate,
}: DraftAppointmentCardProps) {
	const navigate = useNavigate();
	const {getToken} = useAuth();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleContinueBooking = () => {
		navigate(
			`/book-appointment/new?appointmentId=${appointment.appointment_id}`
		);
	};

	const handleDeleteDraft = async () => {
		try {
			setIsDeleting(true);
			const token = await getToken();
			if (!token) throw new Error("Authentication required");

			await cancelAppointment(appointment.appointment_id, token);
			onUpdate?.();
		} catch (error) {
			console.error("Failed to delete draft:", error);
			alert("Failed to delete draft. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString || dateString === new Date("1900-01-01").toISOString()) {
			return "Date not set";
		}
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		if (!dateString || dateString === new Date("1900-01-01").toISOString()) {
			return "Time not set";
		}
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const getCompletionPercentage = () => {
		let completed = 0;
		let total = 5; // Total steps: service, time, details, documents, confirmation

		if (appointment.service_id && appointment.service_id !== "DRAFT_PENDING")
			completed++;
		if (
			appointment.appointment_time &&
			appointment.appointment_time !== new Date("1900-01-01").toISOString()
		)
			completed++;
		if (appointment.full_name && appointment.full_name !== "DRAFT_PENDING")
			completed++;
		if (appointment.nic && appointment.nic !== "DRAFT_PENDING") completed++;
		if (
			appointment.phone_number &&
			appointment.phone_number !== "DRAFT_PENDING"
		)
			completed++;

		return Math.round((completed / total) * 100);
	};

	const getNextStep = () => {
		if (!appointment.service_id || appointment.service_id === "DRAFT_PENDING") {
			return "Select Service";
		}
		if (
			!appointment.appointment_time ||
			appointment.appointment_time === new Date("1900-01-01").toISOString()
		) {
			return "Choose Date & Time";
		}
		if (!appointment.full_name || appointment.full_name === "DRAFT_PENDING") {
			return "Complete Personal Details";
		}
		if (!appointment.nic || appointment.nic === "DRAFT_PENDING") {
			return "Complete Personal Details";
		}
		if (
			!appointment.phone_number ||
			appointment.phone_number === "DRAFT_PENDING"
		) {
			return "Complete Personal Details";
		}
		return "Review & Submit";
	};

	const completionPercentage = getCompletionPercentage();

	return (
		<Card className="w-full bg-amber-50 border border-amber-200 hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-left text-lg font-semibold text-gray-900 mb-1">
							{appointment.service?.name || "Draft Appointment"}
						</CardTitle>
						<p className="text-left text-sm text-gray-500 flex items-center gap-2">
							<span>Ref: {appointment.appointment_id.slice(0, 8)}</span>
						</p>
					</div>
					<Badge className="px-3 py-1 bg-amber-100 text-amber-800 border-amber-200">
						Draft
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				{/* Progress Bar */}
				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-gray-600">Completion Progress</span>
						<span className="text-sm font-medium text-amber-700">
							{completionPercentage}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-amber-500 h-2 rounded-full transition-all duration-300"
							style={{width: `${completionPercentage}%`}}></div>
					</div>
				</div>

				{/* Current Info */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center text-sm text-gray-600">
						<Calendar className="w-4 h-4 mr-2 text-gray-400" />
						{formatDate(appointment.appointment_time)}
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Clock className="w-4 h-4 mr-2 text-gray-400" />
						{formatTime(appointment.appointment_time)}
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<MapPin className="w-4 h-4 mr-2 text-gray-400" />
						{appointment.service?.department?.name || "Service not selected"}
					</div>
				</div>

				{/* Next Step */}
				<div className="bg-amber-100 rounded-lg p-3 mb-4">
					<div className="flex items-center gap-2 text-amber-800">
						<AlertCircle className="w-4 h-4" />
						<span className="text-sm font-medium">Next Step</span>
					</div>
					<p className="text-sm text-amber-700 mt-1">{getNextStep()}</p>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button
						onClick={handleContinueBooking}
						className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
						disabled={isDeleting}>
						<ChevronRight className="w-4 h-4 mr-2" />
						Continue Booking
					</Button>
					<Button
						onClick={handleDeleteDraft}
						variant="outline"
						size="sm"
						className="border-red-300 text-red-700 hover:bg-red-50"
						disabled={isDeleting}>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>

				{/* Notes if any */}
				{appointment.notes &&
					!appointment.notes.startsWith("Draft appointment for user:") && (
						<div className="mt-3 pt-3 border-t border-amber-200">
							<div className="flex items-center gap-2 text-amber-800 mb-1">
								<FileText className="w-4 h-4" />
								<span className="text-sm font-medium">Notes</span>
							</div>
							<p className="text-sm text-gray-700">{appointment.notes}</p>
						</div>
					)}
			</CardContent>
		</Card>
	);
}
