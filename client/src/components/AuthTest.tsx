import React, {useState} from "react";
import {useAuth, useUser} from "@clerk/clerk-react";
import {Button} from "./ui/button";

interface UserProfileResponse {
	user: {
		accountId: string;
		organizationId: string;
		email: string;
		firstName?: string;
		lastName?: string;
		roles: string[];
		permissions?: string[];
	};
	serverInfo: {
		timestamp: string;
		environment: string;
		authStatus: string;
	};
	permissions: {
		canRead: boolean;
		canWrite: boolean;
		canDelete: boolean;
	};
}

interface AdminData {
	message: string;
	user: {
		accountId: string;
		email: string;
		roles: string[];
	};
	timestamp: string;
	secretData: string;
}

interface SuperAdminData {
	message: string;
	user: {
		accountId: string;
		email: string;
		roles: string[];
	};
	timestamp: string;
	superSecretData: string;
	systemStats: {
		totalUsers: number;
		activeSessions: number;
		systemHealth: string;
	};
}

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const AuthTest: React.FC = () => {
	const {getToken} = useAuth();
	const {user} = useUser();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
		null
	);
	const [adminData, setAdminData] = useState<AdminData | null>(null);
	const [superAdminData, setSuperAdminData] = useState<SuperAdminData | null>(
		null
	);
	const [testMessage, setTestMessage] = useState("");
	const [messageResponse, setMessageResponse] = useState<any>(null);

	const makeAuthenticatedRequest = async (
		endpoint: string,
		options: RequestInit = {}
	) => {
		try {
			const token = await getToken();
			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					...options.headers,
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message || `HTTP error! status: ${response.status}`
				);
			}

			return await response.json();
		} catch (err) {
			throw new Error(err instanceof Error ? err.message : "An error occurred");
		}
	};

	const fetchUserProfile = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await makeAuthenticatedRequest("/api/auth-test/profile");
			setUserProfile(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch user profile"
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchAdminData = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await makeAuthenticatedRequest("/api/auth-test/admin-only");
			setAdminData(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch admin data"
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchSuperAdminData = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await makeAuthenticatedRequest("/api/auth-test/super-admin");
			setSuperAdminData(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch super admin data"
			);
		} finally {
			setLoading(false);
		}
	};

	const sendTestMessage = async () => {
		if (!testMessage.trim()) return;

		setLoading(true);
		setError(null);
		try {
			const data = await makeAuthenticatedRequest(
				"/api/auth-test/test-message",
				{
					method: "POST",
					body: JSON.stringify({
						message: testMessage,
						timestamp: new Date().toISOString(),
					}),
				}
			);
			setMessageResponse(data);
			setTestMessage("");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to send test message"
			);
		} finally {
			setLoading(false);
		}
	};

	const clearData = () => {
		setUserProfile(null);
		setAdminData(null);
		setSuperAdminData(null);
		setMessageResponse(null);
		setError(null);
	};

	if (!user) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<h2 className="text-lg font-semibold text-yellow-800">
						Authentication Required
					</h2>
					<p className="text-yellow-700">
						Please sign in to test the authentication system.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					Auth System Test
				</h1>

				{/* Current User Info */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<h2 className="text-lg font-semibold text-blue-800 mb-2">
						Current User (Frontend)
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p>
								<strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
							</p>
							<p>
								<strong>Name:</strong> {user.fullName}
							</p>
							<p>
								<strong>ID:</strong> {user.id}
							</p>
						</div>
						<div>
							<p>
								<strong>Created:</strong>{" "}
								{new Date(user.createdAt || "").toLocaleDateString()}
							</p>
							<p>
								<strong>Last Sign In:</strong>{" "}
								{new Date(user.lastSignInAt || "").toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-4 mb-6">
					<Button
						onClick={fetchUserProfile}
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700">
						{loading ? "Loading..." : "Fetch User Profile"}
					</Button>

					<Button
						onClick={fetchAdminData}
						disabled={loading}
						className="bg-green-600 hover:bg-green-700">
						{loading ? "Loading..." : "Test Admin Access"}
					</Button>

					<Button
						onClick={fetchSuperAdminData}
						disabled={loading}
						className="bg-purple-600 hover:bg-purple-700">
						{loading ? "Loading..." : "Test Super Admin"}
					</Button>

					<Button
						onClick={clearData}
						variant="outline"
						className="border-gray-300 text-gray-700">
						Clear Data
					</Button>
				</div>

				{/* Test Message Form */}
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-3">
						Send Test Message
					</h3>
					<div className="flex gap-2">
						<input
							type="text"
							value={testMessage}
							onChange={(e) => setTestMessage(e.target.value)}
							placeholder="Enter a test message..."
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							onKeyPress={(e) => e.key === "Enter" && sendTestMessage()}
						/>
						<Button
							onClick={sendTestMessage}
							disabled={loading || !testMessage.trim()}
							className="bg-orange-600 hover:bg-orange-700">
							Send
						</Button>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
						<p className="text-red-700">{error}</p>
					</div>
				)}

				{/* Results Display */}
				<div className="space-y-6">
					{/* User Profile Response */}
					{userProfile && (
						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-green-800 mb-3">
								User Profile (Server Response)
							</h3>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold text-green-700 mb-2">
										User Data
									</h4>
									<pre className="text-xs bg-white p-2 rounded border overflow-auto">
										{JSON.stringify(userProfile.user, null, 2)}
									</pre>
								</div>
								<div>
									<h4 className="font-semibold text-green-700 mb-2">
										Server Info & Permissions
									</h4>
									<pre className="text-xs bg-white p-2 rounded border overflow-auto">
										{JSON.stringify(
											{
												serverInfo: userProfile.serverInfo,
												permissions: userProfile.permissions,
											},
											null,
											2
										)}
									</pre>
								</div>
							</div>
						</div>
					)}

					{/* Admin Data Response */}
					{adminData && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-blue-800 mb-3">
								Admin Data (Server Response)
							</h3>
							<pre className="text-xs bg-white p-2 rounded border overflow-auto">
								{JSON.stringify(adminData, null, 2)}
							</pre>
						</div>
					)}

					{/* Super Admin Data Response */}
					{superAdminData && (
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-purple-800 mb-3">
								Super Admin Data (Server Response)
							</h3>
							<pre className="text-xs bg-white p-2 rounded border overflow-auto">
								{JSON.stringify(superAdminData, null, 2)}
							</pre>
						</div>
					)}

					{/* Message Response */}
					{messageResponse && (
						<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-orange-800 mb-3">
								Message Response (Server Response)
							</h3>
							<pre className="text-xs bg-white p-2 rounded border overflow-auto">
								{JSON.stringify(messageResponse, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
