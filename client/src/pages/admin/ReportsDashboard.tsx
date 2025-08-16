import AdminLayout from "./components/AdminLayout";

const ReportsDashboard = () => {
	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">Reports & Analytics</h1>
					<p className="text-gray-600">View and generate system reports</p>
				</div>
				
				<div className="bg-white p-6 rounded-lg shadow">
					<p className="text-gray-500">
						This is where the reporting dashboard would be implemented.
						You can view analytics on appointments, services, and user activity.
					</p>
				</div>
			</div>
		</AdminLayout>
	);
};

export default ReportsDashboard;
