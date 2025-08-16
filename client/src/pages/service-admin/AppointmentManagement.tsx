import {useState, useEffect} from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {useAuth, useOrganization} from "@clerk/clerk-react";
import {fetchOrganizationAppointments} from "@/lib/serviceApi";
import {
	Calendar,
	Clock,
	User,
	MapPin,
	CheckCircle,
	XCircle,
	AlertCircle,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

// Types
interface Appointment {
	appointment_id: string;
	service_id: string;
	user_id: string;
	full_name: string;
	nic: string;
	phone_number: string;
	email: string;
	appointment_time: string;
	appointment_status:
		| "confirmed"
		| "pending"
		| "cancelled"
		| "completed"
		| "drafted";
	notes?: string;
	created_at: string;
	service: {
		service_id: string;
		name: string;
		description: string;
		department: {
			department_id: number;
			name: string;
		};
	};
	availability: {
		availability_id: string;
		day_of_week: string;
		start_time: string;
		end_time: string;
	};
}

const AppointmentManagement = () => {
	const {getToken} = useAuth();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const {organization} = useOrganization();

	console.log(organization?.name);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);

				// Get authentication token
				const token = await getToken();
				if (!token) {
					throw new Error("No authentication token available");
				}

				// Fetch all appointments for the organization
				const appointmentsData = await fetchOrganizationAppointments(token);
				setAppointments(appointmentsData);
			} catch (error) {
				console.error("Error fetching appointments:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [getToken]);

	// Filter appointments based on search term and status
	const filteredAppointments = appointments.filter((appointment) => {
		const appointmentDate = new Date(appointment.appointment_time)
			.toISOString()
			.split("T")[0];
		const appointmentTime = new Date(
			appointment.appointment_time
		).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		const matchesSearch =
			appointment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.service?.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.nic.includes(searchTerm) ||
			appointmentDate.includes(searchTerm) ||
			appointmentTime.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || appointment.appointment_status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Calculate counts for dashboard metrics
	const today = new Date().toISOString().split("T")[0];
	const todayCount = appointments.filter((a) => {
		const appointmentDate = new Date(a.appointment_time)
			.toISOString()
			.split("T")[0];
		return appointmentDate === today;
	}).length;

	const pendingCount = appointments.filter(
		(a) => a.appointment_status === "pending"
	).length;
	const confirmedCount = appointments.filter(
		(a) => a.appointment_status === "confirmed"
	).length;
	const cancelledCount = appointments.filter(
		(a) => a.appointment_status === "cancelled"
	).length;

	// Get status badge styling
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "confirmed":
				return (
					<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
						Confirmed
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
						Pending
					</Badge>
				);
			case "cancelled":
				return (
					<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
						Cancelled
					</Badge>
				);
			case "completed":
				return (
					<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
						Completed
					</Badge>
				);
			case "drafted":
				return (
					<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
						Draft
					</Badge>
				);
			default:
				return (
					<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
						{status}
					</Badge>
				);
		}
	};

	return (
		<ServiceAdminLayout>
			<div className="container mx-auto p-6">
				<header className="mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Appointment Management
					</h1>
					<p className="text-gray-600">
						Manage service appointments for your organization
					</p>
				</header>

				{/* Dashboard Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-500">
								Today's Appointments
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center">
								<Calendar className="h-4 w-4 text-blue-600 mr-2" />
								<span className="text-2xl font-bold">{todayCount}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-500">
								Pending
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center">
								<AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
								<span className="text-2xl font-bold">{pendingCount}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-500">
								Confirmed
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center">
								<CheckCircle className="h-4 w-4 text-green-600 mr-2" />
								<span className="text-2xl font-bold">{confirmedCount}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-500">
								Cancelled
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center">
								<XCircle className="h-4 w-4 text-red-600 mr-2" />
								<span className="text-2xl font-bold">{cancelledCount}</span>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-between items-center mb-6">
					<div className="flex-1 max-w-md">
						<Input
							placeholder="Search appointments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full"
						/>
					</div>
					<div className="w-40 mx-4">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="drafted">Draft</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="confirmed">Confirmed</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<Button>Create Appointment</Button>
				</div>

				<Tabs defaultValue="list" className="w-full">
					<TabsList className="mb-4">
						<TabsTrigger value="list">List View</TabsTrigger>
						<TabsTrigger value="calendar">Calendar View</TabsTrigger>
					</TabsList>

					<TabsContent value="list">
						{loading ? (
							<div className="text-center py-10">Loading appointments...</div>
						) : filteredAppointments.length === 0 ? (
							<div className="text-center py-10">
								<p className="text-gray-500">
									No appointments found matching your criteria.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{filteredAppointments.map((appointment) => {
									const appointmentDate = new Date(
										appointment.appointment_time
									).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									});
									const appointmentTime = new Date(
										appointment.appointment_time
									).toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									});

									return (
										<Card
											key={appointment.appointment_id}
											className="overflow-hidden">
											<CardContent className="p-4">
												<div className="flex flex-col md:flex-row justify-between">
													<div className="mb-4 md:mb-0">
														<div className="flex items-center mb-2">
															<User className="h-4 w-4 mr-2" />
															<h3 className="font-medium text-lg">
																{appointment.full_name}
															</h3>
														</div>
														<div className="flex items-center text-sm text-gray-600 mb-2">
															<Calendar className="h-4 w-4 mr-2" />
															<span>{appointmentDate}</span>
															<Clock className="h-4 w-4 ml-4 mr-2" />
															<span>{appointmentTime}</span>
														</div>
														<div className="flex items-center text-sm text-gray-600 mb-1">
															<MapPin className="h-4 w-4 mr-2" />
															<span>
																{appointment.service?.name ||
																	"Service Name N/A"}
															</span>
														</div>
														<div className="text-sm text-gray-500 mb-1">
															<span>📧 {appointment.email}</span>
														</div>
														<div className="text-sm text-gray-500 mb-1">
															<span>📱 {appointment.phone_number}</span>
														</div>
														<div className="text-sm text-gray-500">
															<span>🆔 {appointment.nic}</span>
														</div>
														{appointment.notes && (
															<p className="mt-2 text-sm text-gray-500">
																Note: {appointment.notes}
															</p>
														)}
													</div>
													<div className="flex flex-col items-start md:items-end">
														{getStatusBadge(appointment.appointment_status)}
														<div className="mt-2 text-xs text-gray-500">
															{appointment.service?.department?.name ||
																"Department N/A"}
														</div>
														<div className="mt-2 flex space-x-2">
															<Button size="sm" variant="outline">
																Details
															</Button>
															<Button size="sm" variant="outline">
																Update Status
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						)}
					</TabsContent>

					<TabsContent value="calendar">
						<Card>
							<CardContent className="p-6">
								<div className="text-center p-8 border rounded-md bg-slate-50">
									<p className="text-gray-500">
										Calendar view will be implemented in the next phase.
									</p>
									<p className="text-gray-500 text-sm">
										This view will allow viewing and managing appointments in a
										calendar format.
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</ServiceAdminLayout>
	);
};

export default AppointmentManagement;
