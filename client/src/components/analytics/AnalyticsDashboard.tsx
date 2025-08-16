import React, {useState, useEffect} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
	Calendar,
	Clock,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
} from "lucide-react";
import {
	analyticsApi,
	type OverviewData,
	type PeakHoursData,
	type DepartmentalWorkloadData,
	type NoShowAnalysisData,
	type ProcessingTimesData,
	type AppointmentTrendsData,
} from "@/lib/analyticsApi";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import {useAuth} from "@clerk/clerk-react";

const AnalyticsDashboard: React.FC = () => {
	const {getToken} = useAuth();
	const [overview, setOverview] = useState<OverviewData | null>(null);
	const [peakHours, setPeakHours] = useState<PeakHoursData[]>([]);
	const [departmentalWorkload, setDepartmentalWorkload] = useState<
		DepartmentalWorkloadData[]
	>([]);
	const [noShowAnalysis, setNoShowAnalysis] = useState<NoShowAnalysisData[]>(
		[]
	);
	const [processingTimes, setProcessingTimes] = useState<ProcessingTimesData[]>(
		[]
	);
	const [appointmentTrends, setAppointmentTrends] = useState<
		AppointmentTrendsData[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [trendDays, setTrendDays] = useState<number>(30);

	useEffect(() => {
		loadAllData();
	}, []);

	useEffect(() => {
		loadAppointmentTrends();
	}, [trendDays]);

	const loadAllData = async () => {
		setLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				console.error("No authentication token available");
				return;
			}

			const [
				overviewData,
				peakHoursData,
				workloadData,
				noShowData,
				processingData,
				trendsData,
			] = await Promise.all([
				analyticsApi.getOverview(token),
				analyticsApi.getPeakHours(token),
				analyticsApi.getDepartmentalWorkload(token),
				analyticsApi.getNoShowAnalysis(token),
				analyticsApi.getProcessingTimes(token),
				analyticsApi.getAppointmentTrends(token, trendDays),
			]);

			setOverview(overviewData);
			setPeakHours(peakHoursData);
			setDepartmentalWorkload(workloadData);
			setNoShowAnalysis(noShowData);
			setProcessingTimes(processingData);
			setAppointmentTrends(trendsData);
		} catch (error) {
			console.error("Failed to load analytics data:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadAppointmentTrends = async () => {
		try {
			const token = await getToken();
			if (!token) {
				console.error("No authentication token available");
				return;
			}
			const data = await analyticsApi.getAppointmentTrends(token, trendDays);
			setAppointmentTrends(data);
		} catch (error) {
			console.error("Failed to load appointment trends:", error);
		}
	};

	const formatPeakHoursData = () => {
		return peakHours.map((item) => ({
			label: `${item.hour}:00`,
			value: item.booking_count,
			color:
				item.booking_count > 20
					? "#ef4444"
					: item.booking_count > 10
					? "#f59e0b"
					: "#3b82f6",
		}));
	};

	const formatDepartmentalData = () => {
		return departmentalWorkload.map((dept) => ({
			label: dept.department_name,
			value: dept.total,
			color: "#8b5cf6",
		}));
	};

	const formatOverviewData = () => {
		if (!overview) return [];
		return [
			{label: "Completed", value: overview.completed, color: "#10b981"},
			{label: "Pending", value: overview.pending, color: "#f59e0b"},
			{label: "Cancelled", value: overview.cancelled, color: "#6b7280"},
			{label: "No Show", value: overview.no_show, color: "#ef4444"},
		];
	};

	const formatAppointmentTrendsData = () => {
		return appointmentTrends.map((item) => ({
			date: item.date,
			value: item.count,
		}));
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading analytics...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Overview Cards */}
			{overview && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Appointments</p>
								<p className="text-2xl font-bold text-blue-600">
									{overview.total_appointments}
								</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-600" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Completion Rate</p>
								<p className="text-2xl font-bold text-green-600">
									{overview.completion_rate}%
								</p>
							</div>
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">No-Show Rate</p>
								<p className="text-2xl font-bold text-red-600">
									{overview.no_show_rate}%
								</p>
							</div>
							<AlertTriangle className="h-8 w-8 text-red-600" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Pending</p>
								<p className="text-2xl font-bold text-yellow-600">
									{overview.pending}
								</p>
							</div>
							<Clock className="h-8 w-8 text-yellow-600" />
						</div>
					</Card>
				</div>
			)}

			{/* Charts Tabs */}
			<Tabs defaultValue="trends" className="w-full">
				<TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
					<TabsTrigger value="trends">Trends</TabsTrigger>
					<TabsTrigger value="peak-hours">Peak Hours</TabsTrigger>
					<TabsTrigger value="departments">Departments</TabsTrigger>
					<TabsTrigger value="overview">Status Overview</TabsTrigger>
					<TabsTrigger value="analysis">Analysis</TabsTrigger>
				</TabsList>

				<TabsContent value="trends">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">
								Appointment Booking Trends
							</h3>
							<Select
								value={trendDays.toString()}
								onValueChange={(value) => setTrendDays(parseInt(value))}>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7">7 days</SelectItem>
									<SelectItem value="14">14 days</SelectItem>
									<SelectItem value="30">30 days</SelectItem>
									<SelectItem value="60">60 days</SelectItem>
									<SelectItem value="90">90 days</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<LineChart
							data={formatAppointmentTrendsData()}
							title="Daily Appointment Bookings"
						/>
					</Card>
				</TabsContent>

				<TabsContent value="peak-hours">
					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">Peak Booking Hours</h3>
						<BarChart
							data={formatPeakHoursData()}
							title="Appointments by Hour of Day"
						/>
					</Card>
				</TabsContent>

				<TabsContent value="departments">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="p-6">
							<h3 className="text-lg font-semibold mb-4">
								Department Workload
							</h3>
							<BarChart
								data={formatDepartmentalData()}
								title="Total Appointments by Department"
							/>
						</Card>

						<Card className="p-6">
							<h3 className="text-lg font-semibold mb-4">Department Details</h3>
							<div className="space-y-3">
								{departmentalWorkload.map((dept) => (
									<div
										key={dept.department_id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div>
											<p className="font-medium">{dept.department_name}</p>
											<div className="flex space-x-2 mt-1">
												<Badge variant="outline" className="text-green-600">
													Completed: {dept.completed}
												</Badge>
												<Badge variant="outline" className="text-yellow-600">
													Pending: {dept.pending}
												</Badge>
												<Badge variant="outline" className="text-red-600">
													No Show: {dept.no_show}
												</Badge>
											</div>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">{dept.total}</p>
											<p className="text-sm text-gray-600">Total</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="overview">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="p-6">
							<h3 className="text-lg font-semibold mb-4">
								Appointment Status Distribution
							</h3>
							<DonutChart
								data={formatOverviewData()}
								title="Status Breakdown"
							/>
						</Card>

						<Card className="p-6">
							<h3 className="text-lg font-semibold mb-4">Processing Times</h3>
							<div className="space-y-3">
								{processingTimes.slice(0, 10).map((service) => (
									<div
										key={service.service_id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div>
											<p className="font-medium">{service.service_name}</p>
											<p className="text-sm text-gray-600">
												Average processing time
											</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">
												{service.avg_processing_hours.toFixed(1)}h
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="analysis">
					<div className="grid grid-cols-1 gap-6">
						<Card className="p-6">
							<h3 className="text-lg font-semibold mb-4">
								No-Show Analysis by Demographics
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="text-left p-2">Age Group</th>
											<th className="text-left p-2">Gender</th>
											<th className="text-left p-2">Total Appointments</th>
											<th className="text-left p-2">No-Shows</th>
											<th className="text-left p-2">No-Show Rate</th>
										</tr>
									</thead>
									<tbody>
										{noShowAnalysis.map((item, index) => (
											<tr key={index} className="border-b">
												<td className="p-2">{item.age_group}</td>
												<td className="p-2">{item.gender}</td>
												<td className="p-2">{item.total}</td>
												<td className="p-2">{item.no_show_count}</td>
												<td className="p-2">
													<Badge
														variant={
															parseFloat(item.no_show_rate) > 15
																? "destructive"
																: "secondary"
														}>
														{item.no_show_rate}%
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Refresh Button */}
			<div className="flex justify-end">
				<Button onClick={loadAllData} disabled={loading}>
					<TrendingUp className="h-4 w-4 mr-2" />
					Refresh Data
				</Button>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
