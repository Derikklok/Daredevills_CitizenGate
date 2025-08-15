import AdminLayout from "./components/AdminLayout";

const UserManagement = () => {
	return (
		<AdminLayout>
			<div className="p-6 bg-gray-50 min-h-screen">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-primary">User Management</h1>
					<p className="text-gray-600">Manage user accounts and permissions</p>
				</div>
				
				<div className="bg-white p-6 rounded-lg shadow">
					<p className="text-gray-500">
						This is where the user management interface would be implemented.
						You can create, edit, and delete users, as well as manage their roles
						and permissions.
					</p>
				</div>
			</div>
		</AdminLayout>
	);
};

export default UserManagement;
