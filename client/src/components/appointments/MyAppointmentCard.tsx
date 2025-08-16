import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type {Appointment} from "@/lib/types";
import {
	Calendar,
	Clock,
	MapPin,
	ChevronDown,
	ChevronUp,
	QrCode,
	User,
	Phone,
	Mail,
	FileText,
	AlertTriangle,
	CalendarX,
	Users,
	CheckCircle,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import QRCode from "react-qr-code";
import {RescheduleModal} from "./RescheduleModal";
import {cancelAppointment} from "@/lib/api";
import {useAuth} from "@clerk/clerk-react";

interface MyAppointmentCardProps {
	appointment: Appointment;
	onCancel?: (appointmentId: string) => void;
	onUpdate?: () => void;
}

export function MyAppointmentCard({
	appointment,
	onCancel,
	onUpdate,
}: MyAppointmentCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showQRCode, setShowQRCode] = useState(false);
	const [showRescheduleModal, setShowRescheduleModal] = useState(false);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {getToken} = useAuth();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "pending":
			case "draft":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "confirmed":
			case "scheduled":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "completed":
				return "bg-green-100 text-green-800 border-green-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const handleCancelAppointment = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) throw new Error("Authentication required");

			await cancelAppointment(appointment.appointment_id, token);
			onCancel?.(appointment.appointment_id);
			onUpdate?.();
			setShowCancelDialog(false);
		} catch (error) {
			console.error("Failed to cancel appointment:", error);
			alert("Failed to cancel appointment. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRescheduleSuccess = () => {
		onUpdate?.();
		setShowRescheduleModal(false);
	};

	const canCancelOrReschedule = () => {
		const status = appointment.appointment_status?.toLowerCase();
		return (
			status === "pending" || status === "confirmed" || status === "scheduled"
		);
	};

	const isCompleted = () => {
		const status = appointment.appointment_status?.toLowerCase();
		return status === "completed";
	};

	const isCancelled = () => {
		const status = appointment.appointment_status?.toLowerCase();
		return status === "cancelled";
	};

	// Generate QR code data
	const qrCodeData = JSON.stringify({
		appointmentId: appointment.appointment_id,
		serviceId: appointment.service_id,
		appointmentTime: appointment.appointment_time,
		customerName: appointment.full_name,
		serviceName: appointment.service?.name || "Service",
	});

	return (
		<>
			<Card
				className={`w-full rounded-lg shadow-sm border transition-shadow ${
					isCompleted()
						? "bg-green-50 border-green-200 hover:shadow-md"
						: isCancelled()
						? "bg-red-50 border-red-200 opacity-75"
						: "bg-white border-gray-200 hover:shadow-md"
				}`}>
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<CardTitle className="text-left text-lg font-semibold text-gray-900 mb-1">
								{appointment.service?.name || "Service Name Unavailable"}
							</CardTitle>
							<p className="text-left text-sm text-gray-500 flex items-center gap-2">
								<span>Ref: {appointment.appointment_id.slice(0, 8)}</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowQRCode(true)}
									className="h-auto p-1 text-gray-400 hover:text-gray-600">
									<QrCode className="w-4 h-4" />
								</Button>
							</p>
						</div>
						<Badge
							className={`px-3 py-1 border ${getStatusColor(
								appointment.appointment_status
							)}`}>
							{appointment.appointment_status}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<div className="space-y-3">
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
							{appointment.service?.department?.name ||
								"Department Unavailable"}
						</div>
					</div>

					{isExpanded && (
						<div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
							{/* Appointment Details */}
							<div>
								<h3 className="font-semibold text-gray-800 mb-3 text-left">
									Appointment Details
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4 text-gray-400" />
										<span className="text-gray-600">Name:</span>
										<span className="font-medium">{appointment.full_name}</span>
									</div>
									<div className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-gray-400" />
										<span className="text-gray-600">Phone:</span>
										<span className="font-medium">
											{appointment.phone_number}
										</span>
									</div>
									{appointment.email && (
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4 text-gray-400" />
											<span className="text-gray-600">Email:</span>
											<span className="font-medium">{appointment.email}</span>
										</div>
									)}
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4 text-gray-400" />
										<span className="text-gray-600">NIC:</span>
										<span className="font-medium">{appointment.nic}</span>
									</div>
								</div>
							</div>

							{/* Service Information */}
							<div>
								<h3 className="font-semibold text-gray-800 mb-3 text-left">
									Service Information
								</h3>
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-700 mb-2">
										<span className="font-medium">Service:</span>{" "}
										{appointment.service?.name}
									</p>
									<p className="text-sm text-gray-700 mb-2">
										<span className="font-medium">Department:</span>{" "}
										{appointment.service?.department?.name}
									</p>
									{appointment.service?.description && (
										<p className="text-sm text-gray-700">
											<span className="font-medium">Description:</span>{" "}
											{appointment.service.description}
										</p>
									)}
								</div>
							</div>

							{/* Notes */}
							{appointment.notes && (
								<div>
									<h3 className="font-semibold text-gray-800 mb-3 text-left flex items-center gap-2">
										<FileText className="w-4 h-4" />
										Notes
									</h3>
									<div className="bg-blue-50 rounded-lg p-4">
										<p className="text-sm text-gray-700">{appointment.notes}</p>
									</div>
								</div>
							)}

							{/* Documents */}
							{appointment.documents_submitted &&
								appointment.documents_submitted.length > 0 && (
									<div>
										<h3 className="font-semibold text-gray-800 mb-3 text-left flex items-center gap-2">
											<FileText className="w-4 h-4" />
											Submitted Documents
										</h3>
										<div className="space-y-2">
											{appointment.documents_submitted.map((doc, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-sm">
													<FileText className="w-4 h-4 text-gray-400" />
													<span>{doc.name}</span>
													<Badge variant="outline" className="text-xs">
														{doc.verification_status || "pending"}
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}

							{/* Status Information for Completed/Cancelled */}
							{(isCompleted() || isCancelled()) && (
								<div
									className={`mt-4 pt-4 border-t ${
										isCompleted() ? "border-green-200" : "border-red-200"
									}`}>
									<div
										className={`flex items-center gap-2 text-sm ${
											isCompleted() ? "text-green-700" : "text-red-700"
										}`}>
										{isCompleted() ? (
											<CheckCircle className="w-4 h-4" />
										) : (
											<AlertTriangle className="w-4 h-4" />
										)}
										<span className="font-medium">
											{isCompleted()
												? "Service Completed"
												: "Appointment Cancelled"}
										</span>
									</div>
									{isCompleted() && (
										<p className="text-xs text-green-600 mt-1">
											Thank you for using our services!
										</p>
									)}
								</div>
							)}

							{/* Action Buttons */}
							{canCancelOrReschedule() && (
								<div className="flex gap-3 justify-center pt-4">
									<Button
										onClick={() => setShowRescheduleModal(true)}
										className="flex-1 bg-primary hover:bg-primary/90 text-white"
										disabled={isLoading}>
										<Calendar className="w-4 h-4 mr-2" />
										Reschedule
									</Button>
									<Button
										onClick={() => setShowCancelDialog(true)}
										variant="outline"
										className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
										disabled={isLoading}>
										<CalendarX className="w-4 h-4 mr-2" />
										Cancel
									</Button>
								</div>
							)}
						</div>
					)}

					<div className="mt-4 flex justify-center">
						<Button
							onClick={toggleExpanded}
							variant="ghost"
							size="sm"
							className="text-primary hover:text-primary/80">
							{isExpanded ? (
								<>
									Show Less
									<ChevronUp className="w-4 h-4 ml-1" />
								</>
							) : (
								<>
									Show Details
									<ChevronDown className="w-4 h-4 ml-1" />
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* QR Code Modal */}
			<Dialog open={showQRCode} onOpenChange={setShowQRCode}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<QrCode className="h-5 w-5" />
							Appointment QR Code
						</DialogTitle>
						<DialogDescription>
							Present this QR code to the service provider for quick reference.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-center py-6">
						<div className="bg-white p-4 rounded-lg border">
							<QRCode value={qrCodeData} size={200} />
						</div>
					</div>
					<div className="text-center text-sm text-gray-600">
						<p className="font-medium">Appointment ID</p>
						<p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">
							{appointment.appointment_id}
						</p>
					</div>
				</DialogContent>
			</Dialog>

			{/* Cancel Confirmation Dialog */}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-red-600">
							<AlertTriangle className="h-5 w-5" />
							Cancel Appointment
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this appointment? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
						<p className="text-sm text-yellow-800">
							<strong>Service:</strong> {appointment.service?.name}
						</p>
						<p className="text-sm text-yellow-800">
							<strong>Date & Time:</strong>{" "}
							{formatDate(appointment.appointment_time)} at{" "}
							{formatTime(appointment.appointment_time)}
						</p>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowCancelDialog(false)}
							disabled={isLoading}>
							Keep Appointment
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancelAppointment}
							disabled={isLoading}>
							{isLoading ? "Cancelling..." : "Cancel Appointment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reschedule Modal */}
			<RescheduleModal
				appointment={appointment}
				isOpen={showRescheduleModal}
				onClose={() => setShowRescheduleModal(false)}
				onSuccess={handleRescheduleSuccess}
			/>
		</>
	);
}
