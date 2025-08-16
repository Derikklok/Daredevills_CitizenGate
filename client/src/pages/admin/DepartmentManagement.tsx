import {useEffect, useState} from "react";
import AdminLayout from "./components/AdminLayout";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useAuth} from "@clerk/clerk-react";
import type {Department} from "@/lib/admin/types";
import {fetchDepartments, deleteDepartment} from "@/lib/admin/departmentApi";
import DepartmentForm from "./components/DepartmentForm";
import {
	Building2,
	MapPin,
	Mail,
	Phone,
	Settings,
	Trash2,
	Edit3,
	Plus,
	Users,
	AlertCircle,
} from "lucide-react";

const DepartmentManagement = () => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
	const [selectedDepartment, setSelectedDepartment] = useState<
		Department | undefined
	>(undefined);
	const {getToken} = useAuth();

	const handleDeleteDepartment = async (departmentId: number) => {
		try {
			const token = await getToken();
			if (!token) {
				setError("Authentication required");
				return;
			}

			await deleteDepartment(departmentId, token);

			// Remove the department from the state
			setDepartments((prevDepartments) =>
				prevDepartments.filter((dept) => dept.department_id !== departmentId)
			);
		} catch (err) {
			console.error("Error deleting department:", err);
			setError(
				err instanceof Error ? err.message : "Failed to delete department"
			);
		}
	};

	const handleSaveDepartment = (department: Department) => {
		if (formMode === "add") {
			// Add the new department to state
			setDepartments((prev) => [...prev, department]);
		} else {
			// Update the department in state
			setDepartments((prev) =>
				prev.map((dept) =>
					dept.department_id === department.department_id ? department : dept
				)
			);
		}

		// Reset form mode and selected department
		setFormMode("none");
		setSelectedDepartment(undefined);
	};

	useEffect(() => {
		const loadDepartments = async () => {
			try {
				setLoading(true);
				setError(null);

				const token = await getToken();
				if (!token) {
					setError("Authentication required");
					return;
				}

				const data = await fetchDepartments(token);
				setDepartments(data);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "An error occurred while fetching departments"
				);
				console.error("Error fetching departments:", err);
			} finally {
				setLoading(false);
			}
		};

		loadDepartments();
	}, [getToken]);

	return (
		<AdminLayout>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
				{/* Enhanced Header */}
				<div className="bg-white border-b border-slate-200 shadow-sm">
					<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
						<div className="flex flex-col gap-4">
							<div className="flex items-start gap-3 sm:gap-4">
								<div className="flex-1 min-w-0">
									<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
										Department Management
									</h1>
									<p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-1">
										Manage government departments and their services
									</p>
									<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-500">
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3 sm:h-4 sm:w-4" />
											<span>{departments.length} departments</span>
										</div>
										<div className="flex items-center gap-1">
											<Settings className="h-3 w-3 sm:h-4 sm:w-4" />
											<span>
												{departments.reduce(
													(acc, dept) => acc + dept.services.length,
													0
												)}{" "}
												services
											</span>
										</div>
									</div>
								</div>
							</div>
							<Button
								size="default"
								className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
								onClick={() => {
									setSelectedDepartment(undefined);
									setFormMode("add");
								}}>
								<Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
								Add New Department
							</Button>
						</div>
					</div>
				</div>

				{/* Content Area */}
				<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
					{formMode !== "none" ? (
						<DepartmentForm
							department={selectedDepartment}
							onSave={handleSaveDepartment}
							onCancel={() => {
								setFormMode("none");
								setSelectedDepartment(undefined);
							}}
						/>
					) : loading ? (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="relative">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
								<div
									className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-300 absolute inset-0"
									style={{animationDelay: "0.1s"}}></div>
							</div>
							<p className="mt-4 text-slate-600 text-lg font-medium">
								Loading departments...
							</p>
							<p className="text-slate-500 text-sm">
								Please wait while we fetch your data
							</p>
						</div>
					) : error ? (
						<div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-100 rounded-lg">
									<AlertCircle className="h-6 w-6 text-red-600" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-red-900">
										Error Loading Departments
									</h3>
									<p className="text-red-700 mt-1">{error}</p>
								</div>
							</div>
						</div>
					) : departments.length === 0 ? (
						<div className="text-center py-20">
							<div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
								<Building2 className="h-12 w-12 text-slate-400" />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 mb-2">
								No departments found
							</h3>
							<p className="text-slate-600 mb-6 max-w-md mx-auto">
								Get started by creating your first department to organize
								government services.
							</p>
							<Button
								onClick={() => {
									setSelectedDepartment(undefined);
									setFormMode("add");
								}}
								className="bg-blue-600 hover:bg-blue-700">
								<Plus className="h-4 w-4 mr-2" />
								Create First Department
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
							{departments.map((department) => (
								<DepartmentCard
									key={department.department_id}
									department={department}
									onDelete={handleDeleteDepartment}
									onEdit={(dept) => {
										setSelectedDepartment(dept);
										setFormMode("edit");
									}}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	);
};

import {useConfirmation, StatusBadge} from "./components/AdminUI";

const DepartmentCard = ({
	department,
	onDelete,
	onEdit,
}: {
	department: Department;
	onDelete: (departmentId: number) => void;
	onEdit: (department: Department) => void;
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const {showConfirmation, ConfirmationDialog} = useConfirmation();

	const handleDelete = () => {
		showConfirmation({
			title: "Delete Department",
			message: `Are you sure you want to delete ${department.name}? This action cannot be undone.`,
			confirmButtonText: "Delete",
			onConfirm: async () => {
				setIsDeleting(true);
				await onDelete(department.department_id);
				setIsDeleting(false);
			},
		});
	};

	return (
		<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white sm:hover:scale-[1.02] hover:bg-slate-50/50">
			<ConfirmationDialog />

			{/* Header */}
			<div className="p-4 sm:p-6 pb-3 sm:pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
					<div className="flex items-start gap-3 flex-1 min-w-0">
						<div className="flex-1 min-w-0">
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
								<h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
									{department.name}
								</h3>
								<StatusBadge
									status={
										department.services.length > 0 ? "success" : "pending"
									}
									text={
										department.services.length > 0 ? "Active" : "No Services"
									}
								/>
							</div>
							<p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
								{department.description || "No description available"}
							</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2 sm:gap-1 sm:ml-2 self-end sm:self-start">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 sm:h-8 sm:w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50 touch-manipulation"
							onClick={() => onEdit(department)}>
							<Edit3 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 sm:h-8 sm:w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50 touch-manipulation"
							onClick={handleDelete}
							disabled={isDeleting}>
							{isDeleting ? (
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Contact Information */}
			<div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/50 border-y border-slate-100">
				<div className="grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
						<div className="p-1 sm:p-1.5 bg-slate-200 rounded-md flex-shrink-0">
							<MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-600" />
						</div>
						<span className="text-slate-700 flex-1 truncate text-xs sm:text-sm text-left">
							{department.address}
						</span>
					</div>
					<div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
						<div className="p-1 sm:p-1.5 bg-slate-200 rounded-md flex-shrink-0">
							<Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-600" />
						</div>
						<span className="text-slate-700 flex-1 truncate text-xs sm:text-sm text-left">
							{department.contact_email}
						</span>
					</div>
					<div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
						<div className="p-1 sm:p-1.5 bg-slate-200 rounded-md flex-shrink-0">
							<Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-600" />
						</div>
						<span className="text-slate-700 text-xs sm:text-sm text-left">
							{department.contact_phone}
						</span>
					</div>
				</div>
			</div>

			{/* Services Section */}
			<div className="p-4 sm:p-6 pt-3 sm:pt-4">
				<div className="flex items-center gap-2 mb-2 sm:mb-3">
					<Settings className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
					<h4 className="font-semibold text-slate-900 text-sm sm:text-base">
						Services ({department.services.length})
					</h4>
				</div>

				{department.services.length === 0 ? (
					<div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded-lg p-2 sm:p-3">
						<AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
						<span>No services configured</span>
					</div>
				) : (
					<div className="flex flex-wrap gap-1.5 sm:gap-2">
						{department.services.slice(0, 3).map((service) => (
							<Badge
								key={service.service_id}
								variant="secondary"
								className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors text-xs">
								{service.name}
							</Badge>
						))}
						{department.services.length > 3 && (
							<Badge variant="outline" className="text-slate-600 text-xs">
								+{department.services.length - 3} more
							</Badge>
						)}
					</div>
				)}
			</div>
		</Card>
	);
};

export default DepartmentManagement;
