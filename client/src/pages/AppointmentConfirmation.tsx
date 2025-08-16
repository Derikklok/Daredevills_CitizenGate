import {useSearchParams, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {CheckCircle, Calendar, Clock, FileText} from "lucide-react";

export default function AppointmentConfirmation() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const appointmentId = searchParams.get("appointmentId");

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-white shadow-lg">
				<CardContent className="p-8 text-center">
					<div className="mb-6">
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Appointment Booked!
						</h1>
						<p className="text-gray-600">
							Your appointment has been successfully created.
						</p>
					</div>

					{appointmentId && (
						<div className="mb-6 p-4 bg-gray-50 rounded-lg">
							<p className="text-sm text-gray-600 mb-1">
								Appointment Reference
							</p>
							<p className="font-mono text-sm font-medium text-gray-900">
								{appointmentId.slice(0, 8).toUpperCase()}
							</p>
						</div>
					)}

					<div className="space-y-4 mb-8">
						<div className="flex items-center text-left">
							<Calendar className="w-5 h-5 text-primary-600 mr-3" />
							<div>
								<p className="font-medium text-gray-900">Next Steps</p>
								<p className="text-sm text-gray-600">
									Check your email for confirmation details
								</p>
							</div>
						</div>

						<div className="flex items-center text-left">
							<Clock className="w-5 h-5 text-primary-600 mr-3" />
							<div>
								<p className="font-medium text-gray-900">Reminder</p>
								<p className="text-sm text-gray-600">
									You'll receive reminders before your appointment
								</p>
							</div>
						</div>

						<div className="flex items-center text-left">
							<FileText className="w-5 h-5 text-primary-600 mr-3" />
							<div>
								<p className="font-medium text-gray-900">Documents</p>
								<p className="text-sm text-gray-600">
									Bring all required documents to your appointment
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<Button
							onClick={() => navigate("/my-appointments")}
							className="w-full bg-primary-600 hover:bg-primary-700 text-white">
							View My Appointments
						</Button>

						<Button
							onClick={() => navigate("/")}
							variant="outline"
							className="w-full">
							Back to Home
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
