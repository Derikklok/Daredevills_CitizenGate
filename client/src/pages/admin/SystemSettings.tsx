import AdminLayout from "./components/AdminLayout";

const SystemSettings = () => {
	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">System Settings</h1>
					<p className="text-gray-600">Configure system preferences</p>
				</div>
				
				<div className="bg-white p-6 rounded-lg shadow">
					<p className="text-gray-500">
						This is where the system settings interface would be implemented.
						You can configure system preferences, notification settings, and
						other global parameters.
					</p>
				</div>
			</div>
		</AdminLayout>
	);
};

export default SystemSettings;
