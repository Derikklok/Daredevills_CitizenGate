import AdminLayout from "./components/AdminLayout";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const ReportsDashboard = () => {
	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">
						Reports & Analytics
					</h1>
					<p className="text-gray-600">
						View comprehensive analytics and insights about the system
					</p>
				</div>

				<div className="bg-white p-6 rounded-lg shadow">
					<AnalyticsDashboard />
				</div>
			</div>
		</AdminLayout>
	);
};

export default ReportsDashboard;
