import {useEffect, useState} from "react";
import {MyAppointmentCard} from "@/components/appointments/MyAppointmentCard";
import {Button} from "@/components/ui/button";
import type {Appointment} from "@/lib/types";
import {useNavigate} from "react-router-dom";
import {useApi} from "@/lib/api";
import {useUserContext} from "@/lib/contexts/UserContext";

const MyAppointments = () => {
	const navigate = useNavigate();
	const {userId} = useUserContext();
	const api = useApi();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				// Use userId from context if you want to filter appointments by user
				const data: Appointment[] = await api.get('/appointments');
				setAppointments(data);
				setError(null);
			} catch (err) {
				console.error('Failed to fetch appointments:', err);
				setError('Failed to load appointments. Please try again.');
			} finally {
				setLoading(false);
			}
		};
		
		fetchAppointments();
	}, [api, userId]);

	return (
		<div className="min-h-screen pb-20">
			<div>
				<h1 className="text-xl font-semibold text-primary-600 mb-2 text-left">
					My Appointments
				</h1>
				<p className="text-sm font-light text-gray-600 mb-6 text-left">
					The bookings you've made through the app are shown below.
				</p>
			</div>
			
			{loading && (
				<div className="flex justify-center items-center p-8">
					<div className="animate-pulse text-primary-600">Loading appointments...</div>
				</div>
			)}
			
			{error && (
				<div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
					{error}
				</div>
			)}
			
			{!loading && !error && appointments.length === 0 && (
				<div className="text-center p-8 bg-gray-50 rounded-md">
					<p className="text-gray-600 mb-4">You don't have any appointments yet.</p>
				</div>
			)}
			
			{!loading && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{appointments.map((appointment) => (
						<MyAppointmentCard
							key={appointment.appointment_id}
							appointment={appointment}
						/>
					))}
				</div>
			)}
			
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
				<Button
					className="w-full bg-primary-500 hover:bg-primary-700 text-white"
					onClick={() => {
						navigate("/booking-appointments");
					}}>
					Book Appointment
				</Button>
			</div>
		</div>
	);
};

export default MyAppointments;
