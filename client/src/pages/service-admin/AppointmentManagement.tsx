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
import {useUser, useAuth} from "@clerk/clerk-react";
import {fetchDepartmentAppointments} from "@/lib/serviceApi";
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
	service_name: string;
	user_id: string;
	user_name: string;
	user_email: string;
	appointment_date: string;
	appointment_time: string;
	status: "confirmed" | "pending" | "cancelled" | "completed";
	notes?: string;
	created_at: string;
}

const AppointmentManagement = () => {
	const {user} = useUser();
	const {getToken} = useAuth();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const departmentId = user?.publicMetadata?.departmentId;

				if (departmentId) {
					// Get authentication token
					const token = await getToken();
					if (!token) {
						throw new Error("No authentication token available");
					}

					// Fetch real appointments data
					const appointmentsData = await fetchDepartmentAppointments(
						departmentId as number,
						token
					);
					setAppointments(appointmentsData);
					setLoading(false);
					return;
				}

				// Fallback mock data for demonstration (when no department ID)
				const mockAppointments: Appointment[] = [
					{
						appointment_id: "1",
						service_id: "1",
						service_name: "Passport Application",
						user_id: "user1",
						user_name: "John Doe",
						user_email: "john.doe@example.com",
						appointment_date: "2023-12-15",
						appointment_time: "10:00",
						status: "confirmed",
						created_at: "2023-12-01T10:30:00Z",
					},
					{
						appointment_id: "2",
						service_id: "1",
						service_name: "Passport Application",
						user_id: "user2",
						user_name: "Jane Smith",
						user_email: "jane.smith@example.com",
						appointment_date: "2023-12-15",
						appointment_time: "11:30",
						status: "pending",
						created_at: "2023-12-02T09:15:00Z",
					},
					{
						appointment_id: "3",
						service_id: "2",
						service_name: "Passport Renewal",
						user_id: "user3",
						user_name: "Robert Johnson",
						user_email: "robert.j@example.com",
						appointment_date: "2023-12-16",
						appointment_time: "09:00",
						status: "confirmed",
						notes: "Bringing family members as well",
						created_at: "2023-12-01T14:20:00Z",
					},
					{
						appointment_id: "4",
						service_id: "2",
						service_name: "Passport Renewal",
						user_id: "user4",
						user_name: "Emily Wilson",
						user_email: "emily.w@example.com",
						appointment_date: "2023-12-14",
						appointment_time: "14:00",
						status: "cancelled",
						notes: "Requested rescheduling",
						created_at: "2023-11-30T16:45:00Z",
					},
					{
						appointment_id: "5",
						service_id: "1",
						service_name: "Passport Application",
						user_id: "user5",
						user_name: "Michael Brown",
						user_email: "michael.b@example.com",
						appointment_date: "2023-12-13",
						appointment_time: "13:30",
						status: "completed",
						created_at: "2023-11-29T11:00:00Z",
					},
				];

				setAppointments(mockAppointments);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching appointments:", error);
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [user]);

	// Filter appointments based on search term and status
	const filteredAppointments = appointments.filter((appointment) => {
		const matchesSearch =
			appointment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.service_name
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			appointment.appointment_date.includes(searchTerm) ||
			appointment.appointment_time.includes(searchTerm);

		const matchesStatus =
			statusFilter === "all" || appointment.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Calculate counts for dashboard metrics
	const todayCount = appointments.filter(
		(a) => a.appointment_date === new Date().toISOString().split("T")[0]
	).length;
	const pendingCount = appointments.filter(
		(a) => a.status === "pending"
	).length;
	const confirmedCount = appointments.filter(
		(a) => a.status === "confirmed"
	).length;
	const cancelledCount = appointments.filter(
		(a) => a.status === "cancelled"
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
						Manage service appointments for your department
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
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="confirmed">Confirmed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
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
								{filteredAppointments.map((appointment) => (
									<Card
										key={appointment.appointment_id}
										className="overflow-hidden">
										<CardContent className="p-4">
											<div className="flex flex-col md:flex-row justify-between">
												<div className="mb-4 md:mb-0">
													<div className="flex items-center mb-2">
														<User className="h-4 w-4 mr-2" />
														<h3 className="font-medium text-lg">
															{appointment.user_name}
														</h3>
													</div>
													<div className="flex items-center text-sm text-gray-600 mb-2">
														<Calendar className="h-4 w-4 mr-2" />
														<span>{appointment.appointment_date}</span>
														<Clock className="h-4 w-4 ml-4 mr-2" />
														<span>{appointment.appointment_time}</span>
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<MapPin className="h-4 w-4 mr-2" />
														<span>{appointment.service_name}</span>
													</div>
													{appointment.notes && (
														<p className="mt-2 text-sm text-gray-500">
															Note: {appointment.notes}
														</p>
													)}
												</div>
												<div className="flex flex-col items-start md:items-end">
													{getStatusBadge(appointment.status)}
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
								))}
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
