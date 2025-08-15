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

// Helper function to generate time slots between start and end time (excluding past slots for today)
const generateTimeSlots = (
	startTime: string,
	endTime: string,
	durationMinutes: number,
	isToday: boolean = false
): string[] => {
	const slots: string[] = [];
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const [endHour, endMinute] = endTime.split(":").map(Number);

	const startTotalMinutes = startHour * 60 + startMinute;
	const endTotalMinutes = endHour * 60 + endMinute;

	// Get current time in minutes for filtering past slots
	const now = new Date();
	const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

	for (
		let minutes = startTotalMinutes;
		minutes < endTotalMinutes;
		minutes += durationMinutes
	) {
		// Skip past time slots if this is for today
		if (isToday && minutes <= currentTotalMinutes) {
			continue;
		}

		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;
		const timeString = `${hour.toString().padStart(2, "0")}:${minute
			.toString()
			.padStart(2, "0")}`;
		slots.push(timeString);
	}

	return slots;
};

const CalendarView = () => {
	const {serviceId} = useParams<{serviceId: string}>();
	const navigate = useNavigate();
	const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<
		string | null
	>(null);
	const {isSignedIn, getToken} = useAuth();
	const [isBooking, setIsBooking] = useState(false);

	useEffect(() => {
		const fetchServiceAvailability = async () => {
			try {
				setIsLoading(true);
				const data = await getServiceAvailability(serviceId!);
				setAvailability(data);
				setError(null);
			} catch (err) {
				setError(
					"Failed to load service availability. Please try again later."
				);
				setAvailability([]); // No sample data fallback
			} finally {
				setIsLoading(false);
			}
		};

		if (serviceId) {
			fetchServiceAvailability();
		}
	}, [serviceId]);

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

	// Order days of week for better display
	const orderDays = (days: ServiceAvailability[]): ServiceAvailability[] => {
		const daysOrder = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		return [...days].sort(
			(a, b) =>
				daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week)
		);
	};

	const orderedAvailability = orderDays(processedAvailability);

	// Build a calendar grid
	const renderCalendarGrid = () => {
		const daysOfWeek = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		const timeSlots = [];

		// Create time slots from 8 AM to 6 PM
		for (let hour = 8; hour <= 18; hour++) {
			timeSlots.push(`${hour}:00`);
			if (hour < 18) timeSlots.push(`${hour}:30`);
		}

		return (
			<div className="overflow-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-primary-600 text-white">
							<th className="border p-2">Time</th>
							{daysOfWeek.map((day) => (
								<th key={day} className="border p-2">
									{day}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{timeSlots.map((timeSlot) => (
							<tr key={timeSlot}>
								<td className="border p-2 font-medium bg-gray-100">
									{formatTime(`${timeSlot}:00`)}
								</td>
								{daysOfWeek.map((day) => {
									const available = orderedAvailability.find(
										(a) =>
											a.day_of_week === day &&
											isTimeInRange(timeSlot, a.start_time, a.end_time, day)
									);
									// Check if this is a past time slot for today
									const today = new Date();
									const todayDayName = today.toLocaleDateString("en-US", {
										weekday: "long",
									});
									const isToday = day === todayDayName;
									const [hour, minute] = timeSlot.split(":");
									const timeSlotMinutes =
										parseInt(hour) * 60 + parseInt(minute);
									const currentTotalMinutes =
										today.getHours() * 60 + today.getMinutes();
									const isPastSlot =
										isToday && timeSlotMinutes <= currentTotalMinutes;

									return (
										<td
											key={`${day}-${timeSlot}`}
											className={`border p-2 ${
												available
													? "bg-green-100"
													: isPastSlot
													? "bg-red-50"
													: "bg-gray-50"
											}`}>
											{available && (
												<div className="h-full w-full flex items-center justify-center">
													<span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
													Available
												</div>
											)}
											{isPastSlot && !available && (
												<div className="h-full w-full flex items-center justify-center text-red-400 text-xs">
													Past
												</div>
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// Check if time is within range and not in the past (for today)
	const isTimeInRange = (
		timeSlot: string,
		startTime: string,
		endTime: string,
		dayName: string
	): boolean => {
		const [hour, minute] = timeSlot.split(":");
		const timeSlotMinutes = parseInt(hour) * 60 + parseInt(minute);

		const [startHour, startMinute] = startTime.split(":");
		const startTimeMinutes = parseInt(startHour) * 60 + parseInt(startMinute);

		const [endHour, endMinute] = endTime.split(":");
		const endTimeMinutes = parseInt(endHour) * 60 + parseInt(endMinute);

		// Check if this day is today
		const today = new Date();
		const todayDayName = today.toLocaleDateString("en-US", {weekday: "long"});
		const isToday = dayName === todayDayName;

		// If it's today, check if the time slot is in the past
		if (isToday) {
			const currentTotalMinutes = today.getHours() * 60 + today.getMinutes();
			if (timeSlotMinutes <= currentTotalMinutes) {
				return false; // Hide past time slots
			}
		}

		return (
			timeSlotMinutes >= startTimeMinutes && timeSlotMinutes < endTimeMinutes
		);
	};

	const handleTimeSlotSelect = (time: string, availabilityId: string) => {
		setSelectedTime(time);
		setSelectedAvailabilityId(availabilityId);
	};

	const handleBookAppointment = async () => {
		if (!isSignedIn) {
			// Redirect to sign in page if user is not signed in
			window.location.href = `/sign-in?redirect=/calendar/${serviceId}&time=${selectedTime}&day=${selectedDay}`;
			return;
		}

		if (!selectedTime || !selectedAvailabilityId || !serviceId) {
			alert("Please select a time slot before booking.");
			return;
		}

		try {
			setIsBooking(true);

			// Get authentication token
			const token = await getToken();
			if (!token) {
				throw new Error("Authentication required");
			}

			// Step 1: Create a draft appointment
			const draft = await createDraftAppointment({}, token);

			// Step 2: Update the draft with service, availability, and specific time
			// Construct the full appointment datetime using today's date + selected time
			const today = new Date();
			const [hours, minutes] = selectedTime.split(":").map(Number);
			const appointmentDateTime = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				hours,
				minutes,
				0
			);

			await updateDraftWithService(
				draft.appointment_id,
				serviceId,
				selectedAvailabilityId,
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
							<h1 className="text-3xl font-bold mb-2">
								{availability[0].service?.name}
							</h1>
							<p className="text-lg mb-1">
								{availability[0].service?.description}
							</p>
							<div className="flex flex-wrap gap-4 mt-4">
								<div className="bg-white/10 px-4 py-2 rounded-lg">
									<span className="text-amber-300 font-medium">
										Department:
									</span>{" "}
									{availability[0].service.department.name}
								</div>
								<div className="bg-white/10 px-4 py-2 rounded-lg">
									<span className="text-amber-300 font-medium">Category:</span>{" "}
									{availability[0].service.category}
								</div>
								<div className="bg-white/10 px-4 py-2 rounded-lg">
									<span className="text-amber-300 font-medium">
										Estimated Time:
									</span>{" "}
									{availability[0].service.estimated_total_completion_time}
								</div>
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
				<h2 className="text-2xl font-bold mb-4">
					Service Availability Calendar
				</h2>

				{isLoading ? (
					<div className="flex justify-center p-10">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
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
						<div className="mb-6">
							<h3 className="text-xl font-bold mb-4">Select a Day</h3>
							<div className="flex flex-wrap gap-3">
								{/* Use array of unique days instead of mapping each availability item */}
								{[
									...new Set(
										orderedAvailability.map((item) => item.day_of_week)
									),
								].map((day) => (
									<Button
										key={day}
										variant={selectedDay === day ? "default" : "outline"}
										className={selectedDay === day ? "bg-primary-600" : ""}
										onClick={() => setSelectedDay(day)}>
										{day}
									</Button>
								))}
							</div>
						</div>

						{/* Time slot selector */}
						{selectedDay && (
							<div className="mt-6">
								<h3 className="text-xl font-bold mb-4">Select a Time Slot</h3>
								{orderedAvailability
									.filter((item) => item.day_of_week === selectedDay)
									.map((item) => {
										// Check if the selected day is today
										const today = new Date();
										const todayDayName = today.toLocaleDateString("en-US", {
											weekday: "long",
										});
										const isToday = selectedDay === todayDayName;

										// Generate time slots for this availability (filter past slots if today)
										const timeSlots = generateTimeSlots(
											item.start_time,
											item.end_time,
											item.duration_minutes,
											isToday
										);

										return (
											<div
												key={item.availability_id}
												className="mb-6 p-4 border rounded-lg">
												<h4 className="font-semibold mb-3">
													{formatTime(item.start_time)} -{" "}
													{formatTime(item.end_time)}
													<span className="text-sm text-gray-500 ml-2">
														({item.duration_minutes} min slots)
													</span>
													{isToday && (
														<span className="text-xs text-blue-600 ml-2">
															(Today - past slots hidden)
														</span>
													)}
												</h4>
												{timeSlots.length === 0 ? (
													<div className="text-center p-4 text-gray-500 bg-gray-50 rounded">
														{isToday
															? "No more time slots available today. Please select another day."
															: "No time slots available for this time period."}
													</div>
												) : (
													<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
														{timeSlots.map((timeSlot) => (
															<Button
																key={timeSlot}
																variant={
																	selectedTime === timeSlot
																		? "default"
																		: "outline"
																}
																className={`text-sm ${
																	selectedTime === timeSlot
																		? "bg-primary-600 text-white"
																		: "hover:bg-primary-50"
																}`}
																onClick={() =>
																	handleTimeSlotSelect(
																		timeSlot,
																		item.availability_id
																	)
																}>
																{formatTime(`${timeSlot}:00`)}
															</Button>
														))}
													</div>
												)}
											</div>
										);
									})}

								{/* Book Appointment Button */}
								{selectedTime && (
									<div className="mt-6 p-4 bg-primary-50 rounded-lg">
										<div className="flex items-center justify-between">
											<div>
												<h4 className="font-semibold text-primary-800">
													Selected: {selectedDay} at{" "}
													{formatTime(`${selectedTime}:00`)}
												</h4>
												<p className="text-sm text-primary-600">
													Ready to proceed with your appointment booking
												</p>
											</div>
											<Button
												onClick={handleBookAppointment}
												disabled={isBooking}
												className="bg-primary-600 hover:bg-primary-700 text-white px-6">
												{isBooking ? "Processing..." : "Book Appointment"}
											</Button>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Availability summary */}
						{!selectedDay && (
							<div className="mt-8">
								<h3 className="text-xl font-bold mb-4">
									Weekly Availability Summary
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
									{[
										...new Set(
											orderedAvailability.map((item) => item.day_of_week)
										),
									].map((day) => {
										// Get all availabilities for this day
										const dayAvailabilities = orderedAvailability.filter(
											(item) => item.day_of_week === day
										);
										return (
											<div
												key={day}
												className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
												onClick={() => setSelectedDay(day)}>
												<h3 className="font-bold text-lg">{day}</h3>
												{dayAvailabilities.map((item, index) => (
													<p key={index} className="text-gray-700">
														{formatTime(item.start_time)} -{" "}
														{formatTime(item.end_time)}
													</p>
												))}
												<p className="text-sm text-gray-500">
													{dayAvailabilities[0].duration_minutes} minute
													appointments
												</p>
												<Button
													variant="outline"
													className="mt-3 text-primary-600 border-primary-600 hover:bg-primary-700 hover:text-white">
													Select Time Slot
												</Button>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Weekly Calendar View */}
						{!selectedDay && (
							<div className="mt-8">
								<h3 className="text-xl font-bold mb-4">Weekly Calendar</h3>
								{renderCalendarGrid()}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default CalendarView;
