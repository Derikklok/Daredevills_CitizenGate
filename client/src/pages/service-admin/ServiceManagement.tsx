import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useOrganization } from "@clerk/clerk-react";
import {
	fetchDepartmentServices,
	fetchGovernmentServices,
} from "@/lib/serviceApi";
import type { GovernmentService } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API Base URL
const API_BASE_URL = "http://localhost:3000/api";

// Department type
type Department = {
	department_id: number;
	clerk_org_id: string;
	name: string;
};

// Fetch all departments, then filter by orgId
const fetchUserDepartment = async (
	orgId: string
): Promise<Department | null> => {
	try {
		const res = await fetch(`${API_BASE_URL}/departments`);
		if (!res.ok) throw new Error("Failed to fetch departments");

		const departments: Department[] = await res.json();
		const department =
			departments.find((dep) => dep.clerk_org_id === orgId) || null;

		return department;
	} catch (err) {
		console.error("Error fetching department:", err);
		return null;
	}
};

const ServiceManagement = () => {
	const { user } = useUser();
	const { organization } = useOrganization();

	const [departmentServices, setDepartmentServices] = useState<
		GovernmentService[]
	>([]);
	const [allServices, setAllServices] = useState<GovernmentService[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editedService, setEditedService] = useState<GovernmentService | null>(
		null
	);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newService, setNewService] = useState({
		name: "",
		description: "",
		category: "",
		estimated_total_completion_time: "",
		department_id: 0,
	});
	const [departmentName, setDepartmentName] =
		useState<string>("Your Department");
	const [activeTab, setActiveTab] = useState<string>("department");
	const [viewService, setViewService] = useState<GovernmentService | null>(
		null
	);
	const [confirmDelete, setConfirmDelete] = useState<{
		id: string;
		status: string;
	} | null>(null);

	useEffect(() => {
		const fetchServicesData = async () => {
			try {
				setLoading(true);

				let deptId: number | undefined = undefined;

				if (organization) {
					const department = await fetchUserDepartment(organization.id);
					if (department) {
						deptId = department.department_id;
						setDepartmentName(department.name);
						setNewService((prev) => ({
							...prev,
							department_id: department.department_id,
						}));
					} else {
						setDepartmentName("Your Department");
					}
				}

				const allServicesData = await fetchGovernmentServices();
				const allServicesWithStatus = allServicesData.map((s) => ({
					...s,
					status: s.status || "active",
				}));
				setAllServices(allServicesWithStatus);

				if (deptId) {
					const departmentServicesData = await fetchDepartmentServices(deptId);
					const departmentServicesWithStatus = departmentServicesData.map(
						(s) => ({
							...s,
							status: s.status || "active",
						})
					);
					setDepartmentServices(departmentServicesWithStatus);
				}

				setLoading(false);
			} catch (error) {
				console.error("Error fetching services:", error);
				setLoading(false);
			}
		};

		fetchServicesData();
	}, [user, organization]);

	const filteredDepartmentServices = departmentServices.filter(
		(service) =>
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.category?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredAllServices = allServices.filter(
		(service) =>
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.category?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleEditService = (serviceId: string) => {
		const service = [...departmentServices, ...allServices].find(
			(s) => s.service_id === serviceId
		);
		if (service) {
			setEditedService({
				...service,
				name: service.name || "",
				description: service.description || "",
				category: service.category || "",
				estimated_total_completion_time:
					service.estimated_total_completion_time || "",
				department_id: service.department_id || 0,
			});
			setIsEditModalOpen(true);
		}
	};

	const handleViewDetails = (serviceId: string) => {
		const service = [...departmentServices, ...allServices].find(
			(s) => s.service_id === serviceId
		);
		if (service) {
			setViewService(service);
		}
	};

	const handleDeleteService = async (id: string) => {
		if (confirmDelete) {
			try {
				const response = await fetch(
					`${API_BASE_URL}/government-services/${id}`,
					{
						method: "DELETE",
					}
				);

				if (!response.ok) throw new Error("Failed to delete service");

				setDepartmentServices(
					departmentServices.filter((s) => s.service_id !== id)
				);
				setAllServices(allServices.filter((s) => s.service_id !== id));
				setConfirmDelete(null);
			} catch (error) {
				console.error("Error deleting service:", error);
			}
		}
	};

	const handleToggleServiceStatus = (
		serviceId: string,
		currentStatus: "active" | "inactive" | undefined
	) => {
		if (currentStatus === "active") {
			setConfirmDelete({ id: serviceId, status: currentStatus });
		} else {
			const newStatus = currentStatus === "inactive" ? "active" : "inactive";
			setDepartmentServices(
				departmentServices.map((s) =>
					s.service_id === serviceId ? { ...s, status: newStatus } : s
				)
			);
			setAllServices(
				allServices.map((s) =>
					s.service_id === serviceId ? { ...s, status: newStatus } : s
				)
			);
		}
	};

	const handleSaveEdit = async () => {
	if (!editedService) return;

	try {
		// 1. Update service details
		const response = await fetch(
			`${API_BASE_URL}/government-services/${editedService.service_id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: editedService.name,
					description: editedService.description,
					category: editedService.category,
					estimated_total_completion_time:
						editedService.estimated_total_completion_time,
					department_id: editedService.department_id,
				}),
			}
		);

		if (!response.ok) throw new Error("Failed to update service");

		const updatedService = await response.json();

		// 2. Update/Create service availability
		const availabilityResponse = await fetch(
			`http://localhost:3000/api/service-availability`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					service_id: updatedService.service_id, // use the id from updated service
					days_of_week: ["Monday", "Tuesday", "Wednesday"], // customize if needed
					start_time: "09:00",
					end_time: "13:00",
					duration_minutes: 30,
				}),
			}
		);

		if (!availabilityResponse.ok)
			throw new Error("Failed to update service availability");

		const updatedAvailability = await availabilityResponse.json();
		console.log("Availability updated:", updatedAvailability);

		// 3. Update state
		setDepartmentServices((prev) =>
			prev.map((s) =>
				s.service_id === updatedService.service_id ? updatedService : s
			)
		);
		setAllServices((prev) =>
			prev.map((s) =>
				s.service_id === updatedService.service_id ? updatedService : s
			)
		);

		// Close modal
		setIsEditModalOpen(false);
		setEditedService(null);
	} catch (error) {
		console.error("Error updating service:", error);
	}
};


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (editedService) {
			setEditedService({
				...editedService,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleNewServiceInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewService({
			...newService,
			[e.target.name]: e.target.value,
		});
	};

	const handleAddService = async () => {
		// Validation
		if (
			!newService.name.trim() ||
			!newService.description.trim() ||
			!newService.category.trim() ||
			!newService.estimated_total_completion_time.trim() ||
			newService.department_id === 0
		) {
			console.error("All fields are required");
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/government-services`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: newService.name,
					description: newService.description,
					category: newService.category,
					estimated_total_completion_time: newService.estimated_total_completion_time,
					department_id: newService.department_id,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to create service: ${errorText}`);
			}

			const createdService = await response.json();
			const serviceWithStatus = { ...createdService, status: "active" };

			// Add to department services if it belongs to current department
			if (createdService.department_id === newService.department_id) {
				setDepartmentServices((prev) => [...prev, serviceWithStatus]);
			}

			// Add to all services
			setAllServices((prev) => [...prev, serviceWithStatus]);

			// Reset form and close modal
			setNewService({
				name: "",
				description: "",
				category: "",
				estimated_total_completion_time: "",
				department_id: newService.department_id, // Keep department_id
			});
			setIsAddModalOpen(false);
		} catch (error) {
			console.error("Error creating service:", error);
		}
	};

	return (
		<ServiceAdminLayout>
			<div className="container mx-auto p-6">
				<header className="mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Service Management
					</h1>
					<p className="text-gray-600">
						Manage services for{" "}
						<span className="font-medium">
							{organization ? organization.name : departmentName}
						</span>
					</p>
				</header>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full mb-6">
					<TabsList className="grid w-full max-w-md grid-cols-2">
						<TabsTrigger value="department">My Department Services</TabsTrigger>
						<TabsTrigger value="all">All Government Services</TabsTrigger>
					</TabsList>

					<div className="flex justify-between items-center mt-6 mb-6">
						<div className="w-full max-w-md">
							<Input
								placeholder="Search services..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Button onClick={() => setIsAddModalOpen(true)}>
							Add New Service
						</Button>
					</div>

					{loading ? (
						<div className="text-center py-10">Loading services...</div>
					) : (
						<>
							<TabsContent value="department">
								{filteredDepartmentServices.length === 0 ? (
									<div className="text-center py-10">
										<p className="text-gray-500">No services found.</p>
										<Button
											className="mt-4"
											onClick={() => setIsAddModalOpen(true)}>
											Add Your First Service
										</Button>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
										{filteredDepartmentServices.map((service) => (
											<Card
												key={service.service_id}
												className="overflow-hidden">
												<CardHeader className="bg-gray-50 flex justify-between items-center">
													<CardTitle className="text-lg">
														{service.name}
													</CardTitle>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															service.status === "active"
																? "bg-green-100 text-green-800"
																: "bg-gray-100 text-gray-800"
														}`}>
														{service.status}
													</span>
												</CardHeader>
												<CardContent className="pt-4">
													<p className="text-gray-700">{service.description}</p>
													<div className="flex flex-col text-sm text-gray-500 space-y-1 mt-2">
														<div className="flex justify-between">
															<span>Category: {service.category}</span>
															<span>
																Completion:{" "}
																{service.estimated_total_completion_time}
															</span>
														</div>
														<div>
															Department:{" "}
															{service.department?.name || "Unknown"}
														</div>
													</div>
													<div className="flex justify-between pt-4">
														<Button
															variant="outline"
															onClick={() =>
																handleEditService(service.service_id)
															}>
															Edit
														</Button>
														<Button
															variant={
																service.status === "active"
																	? "destructive"
																	: "secondary"
															}
															onClick={() =>
																handleToggleServiceStatus(
																	service.service_id,
																	service.status
																)
															}>
															{service.status === "active"
																? "Deactivate"
																: "Activate"}
														</Button>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</TabsContent>

							<TabsContent value="all">
								{filteredAllServices.length === 0 ? (
									<div className="text-center py-10">
										<p className="text-gray-500">
											No government services found.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
										{filteredAllServices.map((service) => (
											<Card
												key={service.service_id}
												className="overflow-hidden">
												<CardHeader className="bg-gray-50 flex justify-between items-center">
													<CardTitle className="text-lg">
														{service.name}
													</CardTitle>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															service.status === "active"
																? "bg-green-100 text-green-800"
																: "bg-gray-100 text-gray-800"
														}`}>
														{service.status}
													</span>
												</CardHeader>
												<CardContent className="pt-4">
													<p className="text-gray-700">{service.description}</p>
													<div className="flex flex-col text-sm text-gray-500 space-y-1 mt-2">
														<div className="flex justify-between">
															<span>Category: {service.category}</span>
															<span>
																Completion:{" "}
																{service.estimated_total_completion_time}
															</span>
														</div>
														<div>
															Department:{" "}
															{service.department?.name || "Unknown"}
														</div>
													</div>
													<div className="flex justify-between pt-4">
														<Button
															variant="outline"
															onClick={() =>
																handleViewDetails(service.service_id)
															}>
															View Details
														</Button>
														{service.department?.department_id ===
															Number(user?.publicMetadata?.departmentId) && (
															<Button
																variant={
																	service.status === "active"
																		? "destructive"
																		: "secondary"
																}
																onClick={() =>
																	handleToggleServiceStatus(
																		service.service_id,
																		service.status
																	)
																}>
																{service.status === "active"
																	? "Deactivate"
																	: "Activate"}
															</Button>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</TabsContent>
						</>
					)}
				</Tabs>

				{isEditModalOpen && editedService && (
  <div className="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg overflow-y-auto py-6">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-4">
      <h2 className="text-xl font-bold mb-4">Edit Service</h2>
      <p className="text-gray-600 mb-4">Update the service details below.</p>

      <div className="space-y-4">
        {/* Service Name (read-only) */}
        <div className="flex items-center justify-between px-2 py-2">
          <label className="text-sm font-medium text-gray-700">Service</label>
          <Input
            value={editedService.name}
            name="name"
            onChange={handleInputChange}
            className="mt-1 w-3/4"
            
          />
        </div>

        {/* Description */}
        <div className="flex items-center justify-between px-2 py-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Input
            value={editedService.description}
            name="description"
            onChange={handleInputChange}
            className="mt-1 w-3/4"
            placeholder="Enter description"
          />
        </div>

        {/* Category */}
        <div className="flex items-center justify-between px-2 py-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Input
            value={editedService.category}
            name="category"
            onChange={handleInputChange}
            className="mt-1 w-3/4"
            placeholder="Enter category"
          />
        </div>

        {/* Time Period */}
        <div className="flex items-center justify-between px-2 py-2">
          <label className="text-sm font-medium text-gray-700">Time Period</label>
          <Input
            value={editedService.estimated_total_completion_time}
            name="estimated_total_completion_time"
            onChange={handleInputChange}
            className="mt-1 w-3/4"
            placeholder="e.g., 6 months"
          />
        </div>

        {/* --- Service Availability Section --- */}
        <div className="border-t pt-6 space-y-6">
  <h3 className="text-lg font-semibold text-gray-800">Availability</h3>

  {/* Days of Week */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Days of Week</label>
    <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
        (day) => {
          const isSelected = editedService.availability?.days_of_week?.includes(day);
          return (
            <label
              key={day}
              className={`px-3 py-1 rounded-full border text-sm cursor-pointer whitespace-nowrap
                ${isSelected ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-100 text-gray-700 border-gray-300"}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  const days = editedService.availability?.days_of_week || [];
                  const updatedDays = e.target.checked
                    ? [...days, day]
                    : days.filter((d) => d !== day);

                  setEditedService((prev: any) => ({
                    ...prev,
                    availability: { ...prev.availability, days_of_week: updatedDays },
                  }));
                }}
                className="hidden"
              />
              {day}
            </label>
          );
        }
      )}
    </div>
  </div>

  {/* Start & End Time */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Start Time</label>
      <Input
        type="time"
        value={editedService.availability?.start_time || ""}
        onChange={(e) =>
          setEditedService((prev: any) => ({
            ...prev,
            availability: { ...prev.availability, start_time: e.target.value },
          }))
        }
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">End Time</label>
      <Input
        type="time"
        value={editedService.availability?.end_time || ""}
        onChange={(e) =>
          setEditedService((prev: any) => ({
            ...prev,
            availability: { ...prev.availability, end_time: e.target.value },
          }))
        }
      />
    </div>
  </div>

  {/* Duration */}
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
    <Input
      type="number"
      value={editedService.availability?.duration_minutes || ""}
      placeholder="e.g., 30"
      onChange={(e) =>
        setEditedService((prev: any) => ({
          ...prev,
          availability: { ...prev.availability, duration_minutes: Number(e.target.value) },
        }))
      }
    />
  </div>
</div>

      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-2 py-4">
        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleSaveEdit}>
          Save Changes
        </Button>
      </div>
    </div>
  </div>
)}

				

				{viewService && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-xl font-bold mb-4">Service Details</h2>
							<div className="space-y-4">
								<div>
									<p className="font-medium">Name:</p>
									<p>{viewService.name}</p>
								</div>
								<div>
									<p className="font-medium">Description:</p>
									<p>{viewService.description}</p>
								</div>
								<div>
									<p className="font-medium">Category:</p>
									<p>{viewService.category}</p>
								</div>
								<div>
									<p className="font-medium">Estimated Completion Time:</p>
									<p>{viewService.estimated_total_completion_time}</p>
								</div>
								<div>
									<p className="font-medium">Department:</p>
									<p>{viewService.department?.name || "Unknown"}</p>
								</div>
								<div>
									<p className="font-medium">Status:</p>
									<p>{viewService.status}</p>
								</div>
							</div>
							<div className="flex justify-end mt-4">
								<Button variant="outline" onClick={() => setViewService(null)}>
									Close
								</Button>
							</div>
						</div>
					</div>
				)}
				{confirmDelete && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
							<p className="text-gray-600 mb-4">
								Are you sure you want to delete this service? This action cannot
								be undone.
							</p>
							<div className="flex justify-end space-x-4">
								<Button
									variant="outline"
									onClick={() => setConfirmDelete(null)}>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDeleteService(confirmDelete.id)}>
									Confirm Delete
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</ServiceAdminLayout>
	);
};

export default ServiceManagement;