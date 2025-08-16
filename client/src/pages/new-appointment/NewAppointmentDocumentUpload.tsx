import {useState, useEffect} from "react";
import {ArrowRight, Upload, X, Plus, CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {
	uploadDocument,
	getAppointmentDocuments,
	getRequiredDocuments,
} from "@/lib/api";

interface FileItem {
	id: string;
	name: string;
	size: number;
	type: string;
	uploaded?: boolean;
	uploadedDocumentId?: string;
}

interface DocumentItem {
	id: string;
	title: string;
	description: string;
	file: FileItem | null;
	required: boolean;
	requiredDocumentId: string; // Backend document type ID
	acceptedFormats?: string; // e.g., "pdf,jpg,png"
}

export default function NewAppointmentDocumentUpload() {
	const navigate = useNavigate();
	const {getToken} = useAuth();
	const [searchParams] = useSearchParams();

	// Get appointment and service IDs from URL parameters
	const appointmentId = searchParams.get("appointmentId");
	const serviceId = searchParams.get("serviceId");

	const [documents, setDocuments] = useState<DocumentItem[]>([]);

	const [additionalDocuments, setAdditionalDocuments] = useState<
		DocumentItem[]
	>([]);

	const [isUploading, setIsUploading] = useState(false);
	const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
	const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

	// Load required documents and existing documents on component mount
	useEffect(() => {
		if (appointmentId && serviceId) {
			loadRequiredDocuments();
			loadExistingDocuments();
		}
	}, [appointmentId, serviceId]);

	const loadRequiredDocuments = async () => {
		if (!serviceId) return;

		try {
			setIsLoadingDocuments(true);
			const requiredDocs = await getRequiredDocuments(serviceId);

			// Transform API response to our DocumentItem format
			const documentItems: DocumentItem[] = requiredDocs.map((doc) => ({
				id: doc.document_id,
				title: doc.name,
				description: doc.description || "Required for this service",
				file: null,
				required: doc.is_mandatory,
				requiredDocumentId: doc.document_id,
				acceptedFormats: doc.document_format,
			}));

			setDocuments(documentItems);
			console.log("Required documents loaded:", documentItems);
		} catch (error) {
			console.error("Failed to load required documents:", error);
			// Fallback to default documents if API fails
			const fallbackDocs: DocumentItem[] = [
				{
					id: "nationalId",
					title: "National Identity Card",
					description: "Original + Photocopy",
					file: null,
					required: true,
					requiredDocumentId: "doc-id-national-id",
					acceptedFormats: "pdf,jpg,png",
				},
				{
					id: "birthCertificate",
					title: "Birth Certificate",
					description: "Original",
					file: null,
					required: true,
					requiredDocumentId: "doc-id-birth-cert",
					acceptedFormats: "pdf,jpg,png",
				},
				{
					id: "photograph",
					title: "Photograph",
					description: "specify size",
					file: null,
					required: true,
					requiredDocumentId: "doc-id-photograph",
					acceptedFormats: "jpg,png",
				},
			];
			setDocuments(fallbackDocs);
			console.log("Using fallback documents due to API error");
		} finally {
			setIsLoadingDocuments(false);
		}
	};

	const loadExistingDocuments = async () => {
		if (!appointmentId) return;

		try {
			const token = await getToken();
			if (!token) return;

			const existingDocs = await getAppointmentDocuments(appointmentId, token);

			// Mark documents as uploaded if they exist
			setDocuments((prev) =>
				prev.map((doc) => {
					const existing = existingDocs.find(
						(uploaded) => uploaded.requiredDocumentId === doc.requiredDocumentId
					);
					if (existing) {
						return {
							...doc,
							file: {
								id: existing.id,
								name: existing.fileName,
								size: 0, // Size not returned from API
								type: existing.fileType,
								uploaded: true,
								uploadedDocumentId: existing.id,
							},
						};
					}
					return doc;
				})
			);
		} catch (error) {
			console.error("Failed to load existing documents:", error);
		}
	};

	const handleFileUpload = async (
		documentId: string,
		files: FileList | null
	) => {
		if (!files || files.length === 0) return;
		if (!appointmentId || !serviceId) {
			alert(
				"Missing appointment or service information. Please start the booking process again."
			);
			return;
		}

		const file = files[0];
		const document = documents.find((doc) => doc.id === documentId);
		if (!document) return;

		try {
			setIsUploading(true);
			setUploadingDocId(documentId);

			const token = await getToken();
			if (!token) {
				throw new Error("Authentication required");
			}

			// Upload to backend
			const uploadResponse = await uploadDocument(
				{
					file: file,
					serviceId: serviceId,
					requiredDocumentId: document.requiredDocumentId,
					appointmentId: appointmentId,
				},
				token
			);

			// Update local state
			const newFile: FileItem = {
				id: uploadResponse.id,
				name: file.name,
				size: file.size,
				type: file.type,
				uploaded: true,
				uploadedDocumentId: uploadResponse.id,
			};

			setDocuments((prev) =>
				prev.map((doc) =>
					doc.id === documentId ? {...doc, file: newFile} : doc
				)
			);

			console.log("Document uploaded successfully:", uploadResponse);
		} catch (error) {
			console.error("Failed to upload document:", error);
			alert(`Failed to upload document: ${error}`);
		} finally {
			setIsUploading(false);
			setUploadingDocId(null);
		}
	};

	const handleAdditionalFileUpload = (
		documentId: string,
		files: FileList | null
	) => {
		if (!files || files.length === 0) return;

		const file = files[0]; // Only take the first file
		const newFile: FileItem = {
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			size: file.size,
			type: file.type,
		};

		setAdditionalDocuments((prev) =>
			prev.map((doc) => (doc.id === documentId ? {...doc, file: newFile} : doc))
		);
	};

	const removeFile = (documentId: string) => {
		setDocuments((prev) =>
			prev.map((doc) => (doc.id === documentId ? {...doc, file: null} : doc))
		);
	};

	const removeAdditionalFile = (documentId: string) => {
		setAdditionalDocuments((prev) =>
			prev.map((doc) => (doc.id === documentId ? {...doc, file: null} : doc))
		);
	};

	const addAdditionalDocument = () => {
		const newDoc: DocumentItem = {
			id: Math.random().toString(36).substr(2, 9),
			title: "Additional Document",
			description: "Upload additional document",
			file: null,
			required: false,
			requiredDocumentId:
				"additional-" + Math.random().toString(36).substr(2, 9), // Generate temp ID for additional docs
		};
		setAdditionalDocuments((prev) => [...prev, newDoc]);
	};

	const removeAdditionalDocument = (documentId: string) => {
		setAdditionalDocuments((prev) =>
			prev.filter((doc) => doc.id !== documentId)
		);
	};

	const updateAdditionalDocumentTitle = (documentId: string, title: string) => {
		setAdditionalDocuments((prev) =>
			prev.map((doc) => (doc.id === documentId ? {...doc, title} : doc))
		);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "Unknown size";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const handleNavigateNext = () => {
		// Check if all required documents are uploaded
		const missingRequired = documents.filter(
			(doc) => doc.required && !doc.file?.uploaded
		);

		if (missingRequired.length > 0) {
			alert(
				`Please upload the following required documents: ${missingRequired
					.map((doc) => doc.title)
					.join(", ")}`
			);
			return;
		}

		// Navigate to final step (complete appointment form)
		navigate(
			`/complete-appointment?appointmentId=${appointmentId}&serviceId=${serviceId}`
		);
	};

	// Early return if missing required parameters
	if (!appointmentId || !serviceId) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Missing Information
					</h2>
					<p className="text-gray-600 mb-4">
						Appointment ID or Service ID is missing. Please start the booking
						process again.
					</p>
					<Button onClick={() => navigate("/my-appointments")}>
						Back to Appointments
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 text-left">
			<div className="flex flex-col gap-4 px-2">
				<h1 className="text-xl text-left font-semibold text-gray-900">
					Book Appointment
				</h1>
				{/* Progress Bar */}
				<Progress value={66} className="w-full" />
				<div className="text-sm text-gray-600 text-center">
					Step 2 of 3: Upload Documents
				</div>
			</div>

			{/* Main Content */}
			<div className="p-4 space-y-6 px-2">
				{/* Document Checklist Section */}
				<Card className="bg-white border-0">
					<CardContent className="p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Document Checklist
						</h2>

						{isLoadingDocuments ? (
							<div className="text-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
								<p className="text-gray-600">Loading required documents...</p>
							</div>
						) : (
							<div className="space-y-4">
								{/* Required Documents */}
								{documents.length === 0 ? (
									<div className="text-center py-8">
										<p className="text-gray-600">
											No required documents found for this service.
										</p>
									</div>
								) : (
									documents.map((doc) => (
										<div key={doc.id} className="space-y-2">
											<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
												<div className="flex-1">
													<h3 className="font-medium text-gray-900">
														{doc.title}{" "}
														{doc.required && (
															<span className="text-red-500">*</span>
														)}
													</h3>
													<p className="text-sm text-gray-600">
														{doc.description}
													</p>
													{doc.acceptedFormats && (
														<p className="text-xs text-gray-500 mt-1">
															Accepted formats:{" "}
															{doc.acceptedFormats.toUpperCase()}
														</p>
													)}
												</div>

												{/* File Upload/Display Area */}
												<div className="ml-4">
													{doc.file ? (
														<div className="flex items-center space-x-2">
															<div
																className={`flex items-center space-x-2 p-2 rounded border ${
																	doc.file.uploaded
																		? "bg-green-50 border-green-200"
																		: "bg-white border-gray-200"
																}`}>
																<div
																	className={`w-6 h-6 rounded flex items-center justify-center ${
																		doc.file.uploaded
																			? "bg-green-100"
																			: "bg-primary-100"
																	}`}>
																	{doc.file.uploaded ? (
																		<CheckCircle className="w-4 h-4 text-green-600" />
																	) : (
																		<span className="text-xs text-primary-600 font-medium">
																			{doc.file.type
																				.split("/")[1]
																				?.toUpperCase() || "FILE"}
																		</span>
																	)}
																</div>
																<div className="text-xs">
																	<p className="font-medium text-gray-900 truncate max-w-24">
																		{doc.file.name}
																	</p>
																	<p
																		className={`${
																			doc.file.uploaded
																				? "text-green-600"
																				: "text-gray-500"
																		}`}>
																		{doc.file.uploaded
																			? "Uploaded"
																			: formatFileSize(doc.file.size)}
																	</p>
																</div>
															</div>
															{!doc.file.uploaded && (
																<button
																	onClick={() => removeFile(doc.id)}
																	className="p-1 hover:bg-red-100 rounded-full transition-colors"
																	title="Remove file">
																	<X className="w-4 h-4 text-red-500" />
																</button>
															)}
														</div>
													) : (
														<div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-primary-500 transition-colors">
															<label
																htmlFor={`file-upload-${doc.id}`}
																className={`cursor-pointer ${
																	isUploading && uploadingDocId === doc.id
																		? "pointer-events-none"
																		: ""
																}`}>
																<div className="flex items-center space-x-2">
																	<Upload
																		className={`w-4 h-4 ${
																			isUploading && uploadingDocId === doc.id
																				? "text-primary-500 animate-pulse"
																				: "text-gray-400"
																		}`}
																	/>
																	<span className="text-xs text-gray-600">
																		{isUploading && uploadingDocId === doc.id
																			? "Uploading..."
																			: "Upload"}
																	</span>
																</div>
															</label>
															<input
																id={`file-upload-${doc.id}`}
																type="file"
																accept={
																	doc.acceptedFormats
																		? doc.acceptedFormats
																				.split(",")
																				.map((format) => `.${format.trim()}`)
																				.join(",")
																		: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.zip,.rar"
																}
																className="hidden"
																disabled={isUploading}
																onChange={(e) =>
																	handleFileUpload(doc.id, e.target.files)
																}
															/>
														</div>
													)}
												</div>
											</div>
										</div>
									))
								)}

								{/* Additional Documents */}
								{additionalDocuments.length > 0 && (
									<div className="space-y-4">
										<h3 className="font-medium text-gray-900">
											Additional Documents
										</h3>
										{additionalDocuments.map((doc) => (
											<div key={doc.id} className="space-y-2">
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<div className="flex-1">
														<input
															type="text"
															value={doc.title}
															onChange={(e) =>
																updateAdditionalDocumentTitle(
																	doc.id,
																	e.target.value
																)
															}
															className="font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0"
															placeholder="Document title"
														/>
														<p className="text-sm text-gray-600">
															{doc.description}
														</p>
													</div>

													{/* File Upload/Display Area for Additional Documents */}
													<div className="ml-4 flex items-center space-x-2">
														{doc.file ? (
															<div className="flex items-center space-x-2">
																<div className="flex items-center space-x-2 p-2 bg-white rounded border">
																	<div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
																		<span className="text-xs text-primary-600 font-medium">
																			{doc.file.type
																				.split("/")[1]
																				?.toUpperCase() || "FILE"}
																		</span>
																	</div>
																	<div className="text-xs">
																		<p className="font-medium text-gray-900 truncate max-w-24">
																			{doc.file.name}
																		</p>
																		<p className="text-gray-500">
																			{formatFileSize(doc.file.size)}
																		</p>
																	</div>
																</div>
																<button
																	onClick={() => removeAdditionalFile(doc.id)}
																	className="p-1 hover:bg-red-100 rounded-full transition-colors"
																	title="Remove file">
																	<X className="w-4 h-4 text-red-500" />
																</button>
															</div>
														) : (
															<div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-primary-500 transition-colors">
																<label
																	htmlFor={`additional-file-upload-${doc.id}`}
																	className="cursor-pointer">
																	<div className="flex items-center space-x-2">
																		<Upload className="w-4 h-4 text-gray-400" />
																		<span className="text-xs text-gray-600">
																			Upload
																		</span>
																	</div>
																</label>
																<input
																	id={`additional-file-upload-${doc.id}`}
																	type="file"
																	accept=".pdf,.jpg,.jpeg,.png"
																	className="hidden"
																	onChange={(e) =>
																		handleAdditionalFileUpload(
																			doc.id,
																			e.target.files
																		)
																	}
																/>
															</div>
														)}

														<button
															onClick={() => removeAdditionalDocument(doc.id)}
															className="p-1 hover:bg-red-100 rounded-full transition-colors"
															title="Remove document">
															<X className="w-4 h-4 text-red-500" />
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								)}

								{/* Add Additional Document Button */}
								<button
									onClick={addAdditionalDocument}
									className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors">
									<Plus className="w-4 h-4" />
									<span className="text-sm font-medium">
										Add Additional Document
									</span>
								</button>
							</div>
						)}
					</CardContent>
				</Card>

				<p className="text-sm text-gray-600">Copies will be retained</p>
			</div>

			{/* Navigation Button */}
			<div className="fixed bottom-4 right-4">
				<Button
					className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg disabled:opacity-50"
					disabled={isUploading}
					onClick={handleNavigateNext}>
					{isUploading ? "Uploading..." : "Next"}
					<ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			</div>
		</div>
	);
}
