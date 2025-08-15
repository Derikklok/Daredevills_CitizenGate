import {useState} from "react";
import {ArrowRight, Upload, X, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";

interface FileItem {
	id: string;
	name: string;
	size: number;
	type: string;
}

interface DocumentItem {
	id: string;
	title: string;
	description: string;
	file: FileItem | null;
	required: boolean;
}

export default function NewAppointmentDocumentUpload() {
	const [documents, setDocuments] = useState<DocumentItem[]>([
		{
			id: "nationalId",
			title: "National Identity Card",
			description: "Original + Photocopy",
			file: null,
			required: true,
		},
		{
			id: "birthCertificate",
			title: "Birth Certificate",
			description: "Original",
			file: null,
			required: true,
		},
		{
			id: "photograph",
			title: "Photograph",
			description: "specify size",
			file: null,
			required: true,
		},
	]);

	const [additionalDocuments, setAdditionalDocuments] = useState<
		DocumentItem[]
	>([]);

	const handleFileUpload = (documentId: string, files: FileList | null) => {
		if (!files || files.length === 0) return;

		const file = files[0]; // Only take the first file
		const newFile: FileItem = {
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			size: file.size,
			type: file.type,
		};

		setDocuments((prev) =>
			prev.map((doc) => (doc.id === documentId ? {...doc, file: newFile} : doc))
		);
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
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="min-h-screen bg-gray-100 text-left">
			<div className="flex flex-col gap-4 px-2">
				<h1 className="text-xl text-left font-semibold text-gray-900">
					Book Appointment
				</h1>
				{/* Progress Bar */}
				<Progress value={25} className="w-full" />
			</div>

			{/* Main Content */}
			<div className="p-4 space-y-6 px-2">
				{/* Document Checklist Section */}
				<Card className="bg-white border-0">
					<CardContent className="p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Document Checklist
						</h2>
						<div className="space-y-4">
							{/* Required Documents */}
							{documents.map((doc) => (
								<div key={doc.id} className="space-y-2">
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{doc.title}{" "}
												{doc.required && (
													<span className="text-red-500">*</span>
												)}
											</h3>
											<p className="text-sm text-gray-600">{doc.description}</p>
										</div>

										{/* File Upload/Display Area */}
										<div className="ml-4">
											{doc.file ? (
												<div className="flex items-center space-x-2">
													<div className="flex items-center space-x-2 p-2 bg-white rounded border">
														<div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
															<span className="text-xs text-primary-600 font-medium">
																{doc.file.type.split("/")[1]?.toUpperCase() ||
																	"FILE"}
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
														onClick={() => removeFile(doc.id)}
														className="p-1 hover:bg-red-100 rounded-full transition-colors"
														title="Remove file">
														<X className="w-4 h-4 text-red-500" />
													</button>
												</div>
											) : (
												<div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-primary-500 transition-colors">
													<label
														htmlFor={`file-upload-${doc.id}`}
														className="cursor-pointer">
														<div className="flex items-center space-x-2">
															<Upload className="w-4 h-4 text-gray-400" />
															<span className="text-xs text-gray-600">
																Upload
															</span>
														</div>
													</label>
													<input
														id={`file-upload-${doc.id}`}
														type="file"
														accept=".pdf,.jpg,.jpeg,.png"
														className="hidden"
														onChange={(e) =>
															handleFileUpload(doc.id, e.target.files)
														}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							))}

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
					</CardContent>
				</Card>

				<p className="text-sm text-gray-600">Copies will be retained</p>
			</div>

			{/* Navigation Button */}
			<div className="fixed bottom-4 right-4">
				<Button
					className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg"
					onClick={() => {
						// Handle navigation to next step
						console.log("Navigate to next step");
					}}>
					Next
					<ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			</div>
		</div>
	);
}
