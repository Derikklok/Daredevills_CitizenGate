import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {Calendar} from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {
	Calendar as CalendarIcon,
	Clock,
	AlertCircle,
	CheckCircle,
} from "lucide-react";
import {getAvailableTimeSlots, rescheduleAppointment} from "@/lib/api";
import {useAuth} from "@clerk/clerk-react";
import type {Appointment} from "@/lib/types";

interface RescheduleModalProps {
	appointment: Appointment | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface TimeSlot {
	id: string;
	availability_id: string;
	start_time: string;
	end_time: string;
	available: boolean;
}

export function RescheduleModal({
	appointment,
	isOpen,
	onClose,
	onSuccess,
}: RescheduleModalProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		appointment ? new Date(appointment.appointment_time) : undefined
	);
	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [selectedSlot, setSelectedSlot] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {getToken} = useAuth();

	// Reset state when modal opens
	useEffect(() => {
		if (isOpen && appointment) {
			setSelectedDate(new Date(appointment.appointment_time));
			setSelectedSlot("");
			setError(null);
			setAvailableSlots([]);
		}
	}, [isOpen, appointment]);

	// Fetch available slots when date changes
	useEffect(() => {
		const fetchSlots = async () => {
			if (!selectedDate || !appointment) return;

			setLoading(true);
			setError(null);
			setSelectedSlot("");

			try {
				const token = await getToken();
				if (!token) throw new Error("Authentication required");

				const dateString = selectedDate.toISOString().split("T")[0];
				const slots = await getAvailableTimeSlots(
					appointment.service_id,
					dateString,
					token
				);
				setAvailableSlots(slots);
			} catch (err) {
				console.error("Error fetching time slots:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load available times"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchSlots();
	}, [selectedDate, appointment, getToken]);

	const handleReschedule = async () => {
		if (!appointment || !selectedDate || !selectedSlot) return;

		setSubmitting(true);
		setError(null);

		try {
			const token = await getToken();
			if (!token) throw new Error("Authentication required");

			const selectedSlotData = availableSlots.find(
				(slot) => slot.id === selectedSlot
			);
			if (!selectedSlotData) throw new Error("Selected time slot not found");

			// Combine date and time
			const appointmentDateTime = new Date(selectedDate);
			const slotTime = new Date(`1970-01-01T${selectedSlotData.start_time}`);
			appointmentDateTime.setHours(
				slotTime.getHours(),
				slotTime.getMinutes(),
				0,
				0
			);

			await rescheduleAppointment(
				appointment.appointment_id,
				appointmentDateTime.toISOString(),
				selectedSlotData.availability_id,
				token
			);

			onSuccess();
			onClose();
		} catch (err) {
			console.error("Error rescheduling appointment:", err);
			setError(
				err instanceof Error ? err.message : "Failed to reschedule appointment"
			);
		} finally {
			setSubmitting(false);
		}
	};

	const formatTimeSlot = (startTime: string, endTime: string) => {
		const start = new Date(`1970-01-01T${startTime}`);
		const end = new Date(`1970-01-01T${endTime}`);
		return `${start.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})} - ${end.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})}`;
	};

	const isDateDisabled = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	};

	if (!appointment) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CalendarIcon className="h-5 w-5" />
						Reschedule Appointment
					</DialogTitle>
					<DialogDescription>
						Reschedule your appointment for "{appointment.service?.name}".
						Select a new date and time below.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Current Appointment Info */}
					<Card className="bg-blue-50 border-blue-200">
						<CardContent className="p-4">
							<h3 className="font-medium text-blue-800 mb-2">
								Current Appointment
							</h3>
							<div className="flex items-center gap-4 text-sm text-blue-700">
								<div className="flex items-center gap-1">
									<CalendarIcon className="h-4 w-4" />
									{new Date(appointment.appointment_time).toLocaleDateString()}
								</div>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{new Date(appointment.appointment_time).toLocaleTimeString(
										"en-US",
										{
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										}
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Date Selection */}
					<div>
						<h3 className="font-medium mb-3">Select New Date</h3>
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={setSelectedDate}
							disabled={isDateDisabled}
							className="rounded-md border"
						/>
					</div>

					{/* Time Slot Selection */}
					{selectedDate && (
						<div>
							<h3 className="font-medium mb-3">Select Time Slot</h3>
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm text-gray-600">
										Loading available times...
									</span>
								</div>
							) : availableSlots.length > 0 ? (
								<Select value={selectedSlot} onValueChange={setSelectedSlot}>
									<SelectTrigger>
										<SelectValue placeholder="Choose a time slot" />
									</SelectTrigger>
									<SelectContent>
										{availableSlots.map((slot) => (
											<SelectItem
												key={slot.id}
												value={slot.id}
												disabled={!slot.available}>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4" />
													{formatTimeSlot(slot.start_time, slot.end_time)}
													{!slot.available && (
														<span className="text-xs text-gray-500">
															(Unavailable)
														</span>
													)}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<Card className="bg-yellow-50 border-yellow-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-2 text-yellow-800">
											<AlertCircle className="h-4 w-4" />
											<span className="text-sm">
												No available time slots for this date
											</span>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}

					{/* Error Display */}
					{error && (
						<Card className="bg-red-50 border-red-200">
							<CardContent className="p-4">
								<div className="flex items-center gap-2 text-red-800">
									<AlertCircle className="h-4 w-4" />
									<span className="text-sm">{error}</span>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Confirmation */}
					{selectedDate && selectedSlot && (
						<Card className="bg-green-50 border-green-200">
							<CardContent className="p-4">
								<div className="flex items-center gap-2 text-green-800 mb-2">
									<CheckCircle className="h-4 w-4" />
									<span className="text-sm font-medium">
										New Appointment Details
									</span>
								</div>
								<div className="text-sm text-green-700">
									<p>Date: {selectedDate.toLocaleDateString()}</p>
									<p>
										Time:{" "}
										{availableSlots.find((slot) => slot.id === selectedSlot) &&
											formatTimeSlot(
												availableSlots.find((slot) => slot.id === selectedSlot)!
													.start_time,
												availableSlots.find((slot) => slot.id === selectedSlot)!
													.end_time
											)}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onClose} disabled={submitting}>
						Cancel
					</Button>
					<Button
						onClick={handleReschedule}
						disabled={!selectedDate || !selectedSlot || submitting}
						className="bg-primary hover:bg-primary/90">
						{submitting ? "Rescheduling..." : "Confirm Reschedule"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
