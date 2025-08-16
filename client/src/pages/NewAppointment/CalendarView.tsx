import {useState, useEffect} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {
	getServiceAvailability,
	createDraftAppointment,
	updateDraftWithService,
} from "@/lib/api";
import type {ServiceAvailability} from "@/lib/types";

// Helper function to format time (HH:MM:SS to HH:MM AM/PM)
const formatTime = (timeStr: string): string => {
	const [hours, minutes] = timeStr.split(":");
	const hoursNum = parseInt(hours);
	const period = hoursNum >= 12 ? "PM" : "AM";
	const displayHours =
		hoursNum > 12 ? hoursNum - 12 : hoursNum === 0 ? 12 : hoursNum;
	return `${displayHours}:${minutes} ${period}`;
};

// Helper function to generate time slots between start and end time
const generateTimeSlots = (
	startTime: string,
	endTime: string,
	durationMinutes: number
): string[] => {
	const slots: string[] = [];
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const [endHour, endMinute] = endTime.split(":").map(Number);

	const startTotalMinutes = startHour * 60 + startMinute;
	const endTotalMinutes = endHour * 60 + endMinute;

	for (
		let minutes = startTotalMinutes;
		minutes < endTotalMinutes;
		minutes += durationMinutes
	) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		const timeSlot = `${hours.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}`;
		slots.push(timeSlot);
	}

	return slots;
};

const CalendarView = () => {
	const {serviceId} = useParams<{serviceId: string}>();
	const navigate = useNavigate();
	const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
		time: string;
		availabilityId: string;
		date: Date;
	} | null>(null);
	const {isSignedIn, getToken} = useAuth();
	const [isBooking, setIsBooking] = useState(false);

	useEffect(() => {
		const fetchServiceAvailability = async () => {
			try {
				setIsLoading(true);
				const token = await getToken();
				if (!token) {
					throw new Error("Authentication required");
				}
				const data = await getServiceAvailability(serviceId!, token);
				setAvailability(data);
				setError(null);
			} catch (err) {
				setError(
					"Failed to load service availability. Please try again later."
				);
				setAvailability([]);
			} finally {
				setIsLoading(false);
			}
		};

		if (serviceId) {
			fetchServiceAvailability();
		}
	}, [serviceId, getToken]);

	// Process and normalize day_of_week field, splitting multiple days
	const processAvailabilityDays = (
		availabilityData: ServiceAvailability[]
	): ServiceAvailability[] => {
		const processedAvailability: ServiceAvailability[] = [];

		availabilityData.forEach((item) => {
			// Check if day_of_week contains multiple days (split by spaces)
			const days = item.day_of_week
				.split(/\s+/)
				.filter((day) => day.trim().length > 0);

			if (days.length > 1) {
				// Create a separate availability entry for each day
				days.forEach((day) => {
					processedAvailability.push({
						...item,
						day_of_week: day,
					});
				});
			} else {
				// Single day, add as is
				processedAvailability.push(item);
			}
		});

		return processedAvailability;
	};

	// Process availability to split multi-day entries
	const processedAvailability = processAvailabilityDays(availability);

	// Generate next 14 days starting from today
	const getNext14Days = () => {
		const days = [];
		const today = new Date();

		for (let i = 0; i < 14; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			days.push(date);
		}
		return days;
	};

	// Get available time slots for a specific date
	const getTimeSlotsForDate = (date: Date) => {
		const dayName = date.toLocaleDateString("en-US", {weekday: "long"});
		const isToday = date.toDateString() === new Date().toDateString();
		const currentTime = new Date();

		// Filter availability for this day
		const dayAvailabilities = processedAvailability.filter(
			(item) => item.day_of_week === dayName
		);

		const timeSlots: Array<{
			time: string;
			availabilityId: string;
			isPast: boolean;
		}> = [];

		dayAvailabilities.forEach((availability) => {
			const slots = generateTimeSlots(
				availability.start_time,
				availability.end_time,
				availability.duration_minutes
			);

			slots.forEach((slot) => {
				// Check if this slot is in the past for today
				let isPast = false;
				if (isToday) {
					const [hours, minutes] = slot.split(":").map(Number);
					const slotTime = new Date(date);
					slotTime.setHours(hours, minutes, 0, 0);
					isPast = slotTime <= currentTime;
				}

				timeSlots.push({
					time: slot,
					availabilityId: availability.availability_id,
					isPast,
				});
			});
		});

		return timeSlots.filter((slot) => !slot.isPast); // Only return future slots
	};

	const handleTimeSlotSelect = (
		time: string,
		availabilityId: string,
		date: Date
	) => {
		setSelectedTimeSlot({
			time,
			availabilityId,
			date,
		});
	};

	const handleBookAppointment = async () => {
		if (!isSignedIn) {
			window.location.href = `/sign-in?redirect=/calendar/${serviceId}`;
			return;
		}

		if (!selectedTimeSlot || !serviceId) {
			alert("Please select a time slot before booking.");
			return;
		}

		try {
			setIsBooking(true);

			const token = await getToken();
			if (!token) {
				throw new Error("Authentication required");
			}

			// Step 1: Create a draft appointment
			const draft = await createDraftAppointment({}, token);

			// Step 2: Update the draft with service, availability, and specific time
			const [hours, minutes] = selectedTimeSlot.time.split(":").map(Number);
			const appointmentDateTime = new Date(selectedTimeSlot.date);
			appointmentDateTime.setHours(hours, minutes, 0, 0);

			await updateDraftWithService(
				draft.appointment_id,
				serviceId,
				selectedTimeSlot.availabilityId,
				appointmentDateTime.toISOString(),
				token
			);

			// Step 3: Navigate to document upload page
			navigate(
				`/book-appointment/documents?appointmentId=${draft.appointment_id}&serviceId=${serviceId}`
			);
		} catch (error) {
			alert(`Failed to start booking process: ${error}`);
		} finally {
			setIsBooking(false);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header with service details */}
			<div className="bg-primary-600 text-white p-6">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center mb-6">
						<Link
							to="/booking-appointments"
							className="text-white flex items-center">
							<ArrowLeft size={20} className="mr-2" />
							<span>Back to Services</span>
						</Link>
					</div>

					{isLoading ? (
						<h1 className="text-2xl font-bold">Loading service details...</h1>
					) : error ? (
						<h1 className="text-2xl font-bold">Error loading service</h1>
					) : availability.length > 0 ? (
						<>
							<h1 className="text-3xl font-bold mb-2">Service Booking</h1>
							<p className="text-lg mb-1">
								Select an available time slot for your appointment.
							</p>
							<div className="flex flex-wrap gap-4 mt-4">
								<div className="bg-white/10 px-4 py-2 rounded-lg">
									<span className="text-amber-300 font-medium">
										Appointment Duration:
									</span>{" "}
									{availability[0].duration_minutes} minutes
								</div>
							</div>
						</>
					) : (
						<h1 className="text-2xl font-bold">
							No availability for this service
						</h1>
					)}
				</div>
			</div>

			{/* Calendar section */}
			<div className="max-w-6xl mx-auto p-6">
				<h2 className="text-2xl font-bold mb-6">
					Service Availability Calendar
				</h2>

				{isLoading ? (
					<div className="flex justify-center p-10">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
					</div>
				) : error ? (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				) : availability.length === 0 ? (
					<div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
						No availability information found for this service.
					</div>
				) : (
					<>
						{/* Date Selection - Next 14 Days */}
						<div className="mb-8">
							<h3 className="text-xl font-bold mb-4">Select a Date</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
								{getNext14Days().map((date) => {
									const timeSlots = getTimeSlotsForDate(date);
									const isToday =
										date.toDateString() === new Date().toDateString();
									const isSelected =
										selectedDate?.toDateString() === date.toDateString();

									return (
										<div
											key={date.toISOString()}
											className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
												isSelected
													? "border-primary-500 bg-primary-50"
													: timeSlots.length > 0
													? "border-gray-200 hover:border-primary-300"
													: "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
											}`}
											onClick={() =>
												timeSlots.length > 0 ? setSelectedDate(date) : null
											}>
											<div className="text-center">
												<div
													className={`text-sm font-medium ${
														isSelected ? "text-primary-700" : "text-gray-600"
													}`}>
													{isToday
														? "Today"
														: date.toLocaleDateString("en-US", {
																weekday: "short",
														  })}
												</div>
												<div
													className={`text-lg font-bold ${
														isSelected ? "text-primary-800" : "text-gray-900"
													}`}>
													{date.getDate()}
												</div>
												<div
													className={`text-xs ${
														isSelected ? "text-primary-600" : "text-gray-500"
													}`}>
													{date.toLocaleDateString("en-US", {month: "short"})}
												</div>
												<div
													className={`text-xs mt-1 ${
														timeSlots.length > 0
															? isSelected
																? "text-primary-600"
																: "text-green-600"
															: "text-gray-400"
													}`}>
													{timeSlots.length > 0
														? `${timeSlots.length} slots`
														: "No slots"}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Time Slot Selection */}
						{selectedDate && (
							<div className="mb-8">
								<h3 className="text-xl font-bold mb-4">
									Select a Time Slot for{" "}
									{selectedDate.toLocaleDateString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
									})}
								</h3>

								{(() => {
									const timeSlots = getTimeSlotsForDate(selectedDate);

									if (timeSlots.length === 0) {
										return (
											<div className="text-center p-8 bg-gray-50 rounded-lg">
												<p className="text-gray-600">
													No available time slots for this date.
												</p>
												<p className="text-sm text-gray-500 mt-1">
													Please select a different date.
												</p>
											</div>
										);
									}

									return (
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
											{timeSlots.map((slot) => {
												const isSelected =
													selectedTimeSlot?.time === slot.time &&
													selectedTimeSlot?.date.toDateString() ===
														selectedDate.toDateString();

												return (
													<Button
														key={`${slot.time}-${slot.availabilityId}`}
														variant={isSelected ? "default" : "outline"}
														className={`h-12 text-sm font-medium ${
															isSelected
																? "bg-primary-600 text-white border-primary-600"
																: "hover:bg-primary-50 hover:border-primary-300"
														}`}
														onClick={() =>
															handleTimeSlotSelect(
																slot.time,
																slot.availabilityId,
																selectedDate
															)
														}>
														{formatTime(`${slot.time}:00`)}
													</Button>
												);
											})}
										</div>
									);
								})()}
							</div>
						)}

						{/* Selected Appointment Summary */}
						{selectedTimeSlot && (
							<div className="mb-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-lg font-bold text-primary-800 mb-2">
											Appointment Summary
										</h4>
										<div className="space-y-1">
											<p className="text-primary-700">
												<span className="font-medium">Date:</span>{" "}
												{selectedTimeSlot.date.toLocaleDateString("en-US", {
													weekday: "long",
													month: "long",
													day: "numeric",
													year: "numeric",
												})}
											</p>
											<p className="text-primary-700">
												<span className="font-medium">Time:</span>{" "}
												{formatTime(`${selectedTimeSlot.time}:00`)}
											</p>
										</div>
									</div>
									<Button
										onClick={handleBookAppointment}
										disabled={isBooking}
										className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg font-medium">
										{isBooking ? "Processing..." : "Book Appointment"}
									</Button>
								</div>
							</div>
						)}

						{/* Weekly Availability Overview */}
						{!selectedDate && (
							<div className="mt-8">
								<h3 className="text-xl font-bold mb-4">
									Weekly Availability Overview
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{[
										...new Set(
											processedAvailability.map((item) => item.day_of_week)
										),
									].map((day) => {
										// Get all availabilities for this day
										const dayAvailabilities = processedAvailability.filter(
											(item) => item.day_of_week === day
										);

										return (
											<div
												key={day}
												className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all">
												<h4 className="font-bold text-lg text-gray-900 mb-2">
													{day}
												</h4>
												{dayAvailabilities.map((item, index) => (
													<div
														key={index}
														className="text-sm text-gray-600 mb-1">
														{formatTime(item.start_time)} -{" "}
														{formatTime(item.end_time)}
														<span className="text-xs text-gray-500 ml-1">
															({item.duration_minutes} min slots)
														</span>
													</div>
												))}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default CalendarView;
