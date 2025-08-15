import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import type {Appointment} from "@/lib/types";
import {Calendar, Clock, MapPin, ChevronDown, ChevronUp} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface MyAppointmentCardProps {
	appointment: Appointment;
	onReschedule?: (appointmentId: string) => void;
	onCancel?: (appointmentId: string) => void;
}

export function MyAppointmentCard({
	appointment,
	onReschedule,
	onCancel,
}: MyAppointmentCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

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
			case "upcoming":
				return "bg-gray-100 text-gray-800";
			case "completed":
				return "bg-green-100 text-green-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<Card className="w-full bg-white rounded-lg shadow-sm border-1 border-primary-700">
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-left text-lg font-semibold text-gray-900 mb-1">
							{appointment.service?.name || "Service Name Unavailable"}
						</CardTitle>
						<p className="text-left text-sm text-gray-500">
							Ref: {appointment.appointment_id}
						</p>
					</div>
					<Badge
						className={`px-3 py-1 ${getStatusColor(
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
						{appointment.service?.department?.name || "Department Unavailable"}
					</div>
				</div>

				{isExpanded && (
					<div className="mt-6 pt-6 border-t border-gray-100">
						<h3 className=" font-semibold text-primary-600 mb-3 text-left">
							Description
						</h3>
						<p className="text-sm text-gray-700 mb-6 text-left font-light">
							{appointment.notes ||
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."}
						</p>

						<div className="flex gap-3 justify-center">
							<Button
								onClick={() => onReschedule?.(appointment.appointment_id)}
								className="flex-1 bg-primary-500 hover:bg-primary-700 text-white">
								Reschedule
							</Button>
							<Button
								onClick={() => onCancel?.(appointment.appointment_id)}
								variant="outline"
								className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
								Cancel
							</Button>
						</div>
					</div>
				)}

				<div className="mt-4 flex justify-center">
					<Button
						onClick={toggleExpanded}
						variant="ghost"
						size="sm"
						className="text-primary-600 hover:text-primary-700">
						{isExpanded ? (
							<>
								Show Less
								<ChevronUp className="w-4 h-4 ml-1" />
							</>
						) : (
							<>
								Show details
								<ChevronDown className="w-4 h-4 ml-1" />
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
