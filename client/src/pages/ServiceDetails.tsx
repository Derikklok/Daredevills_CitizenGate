import {useState} from "react";

import ServiceSection from "@/components/booking/ServiceSection";
import SearchBar from "@/components/common/SearchBar"; // Import the new SearchBar component
import {serviceData} from "@/data/serviceData";

interface ServiceDetailsProps {
	serviceName: string;
}

export default function ServiceDetails({serviceName}: ServiceDetailsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

	const toggleSection = (sectionId: string) => {
		setOpenSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
	};

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
	};

	const currentService = serviceData[serviceName] || {sections: []};

	return (
		<div className="min-h-screen bg-white">
			{/* Content */}
			<div className="px-4 py-6">
				<h1 className="text-xl font-semibold text-primary-500 mb-2">
					{serviceName}
				</h1>
				<p className="text-sm text-gray-600 mb-6">
					Below are the services related to {serviceName}.
				</p>

				{/* Search Bar */}
				<SearchBar
					value={searchQuery}
					onChange={handleSearchChange}
					placeholder={`Search ${serviceName} Services...`}
					className="mb-6"
				/>

				{/* Service Sections */}
				<div className="space-y-0">
					{currentService.sections
						.filter((section) =>
							section.title.toLowerCase().includes(searchQuery.toLowerCase())
						)
						.map((section) => (
							<ServiceSection
								key={section.id}
								title={section.title}
								description={section.description}
								isOpen={!!openSections[section.id]}
								onToggle={() => toggleSection(section.id)}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
