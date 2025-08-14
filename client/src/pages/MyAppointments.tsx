import {useEffect, useState} from "react";
import {MyAppointmentCard} from "@/components/appointments/MyAppointmentCard";
import {Button} from "@/components/ui/button";
import type {Appointment} from "@/lib/types";
import {useNavigate} from "react-router-dom";

const MyAppointments = () => {
	const navigate = useNavigate();
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/appointments`
			);
			const data: Appointment[] = await response.json();
			setAppointments(data);
		};
		fetchAppointments();
	}, []);

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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{appointments.map((appointment) => (
					<MyAppointmentCard
						key={appointment.appointment_id}
						appointment={appointment}
					/>
				))}
			</div>
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
				<Button
					className="w-full bg-primary-500 hover:bg-primary-700 text-white"
					onClick={() => {
						navigate("/book-appointment/new");
					}}>
					Book Appointment
				</Button>
			</div>
		</div>
	);
};

export default MyAppointments;
