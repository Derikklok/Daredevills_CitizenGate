import {Bus, Heart, GraduationCap, FileText} from "lucide-react";
import ServiceCard from "@/components/booking/ServiceCard";
import {useNavigate} from "react-router-dom";

const BookingAppointments = () => {
	return (
		<div className="p-4 bg-gray-50 min-h-screen">
			<h1 className="text-xl font-semibold pb-6">Book an appointment</h1>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-normal text-gray-900">Select a service</h2>
			</div>
			<div>
				<ServicesGrid />
			</div>
		</div>
	);
};

const ServicesGrid = () => {
	const navigate = useNavigate();

	const services = [
		{icon: Bus, title: "Transport", id: "transport"},
		{icon: Heart, title: "Health Services", id: "health"},
		{icon: GraduationCap, title: "Education", id: "education"},
		{icon: FileText, title: "Land Permits", id: "permits"},
	];

	return (
		<div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
			{services.map((service) => (
				<ServiceCard
					key={service.id}
					icon={service.icon}
					title={service.title}
					onClick={() => {
						navigate(`/service-details/${service.id}`);
					}}
				/>
			))}
		</div>
	);
};

export default BookingAppointments;
