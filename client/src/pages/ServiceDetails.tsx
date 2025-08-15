import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Menu } from "lucide-react";
import ServiceSection from "@/components/booking/ServiceSection";
import SearchBar from "@/components/common/SearchBar";
import { serviceData } from "@/data/serviceData";

interface ServiceDetailsProps {
  serviceName: string;
  onBack: () => void;
  onBookAppointment?: (selectedService?: string) => void; // Add this prop
}

export default function ServiceDetails({ 
  serviceName, 
  onBack, 
  onBookAppointment 
}: ServiceDetailsProps) {
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

  const handleBookAppointment = (specificService?: string) => {
    if (onBookAppointment) {
      onBookAppointment(specificService);
    }
  };

	const currentService = serviceData[serviceName] || {sections: []};

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <span className="text-lg font-semibold text-primary-700">Citizen</span>
            <span className="text-lg font-semibold text-primary-400">Gate</span>
          </div>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-primary-700">{serviceName}</h1>
          {/* Quick Book Appointment Button */}
          <Button
            onClick={() => handleBookAppointment()}
            className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 text-sm"
          >
            Book Now
          </Button>
        </div>
        
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
              <div key={section.id}>
                <ServiceSection
                  title={section.title}
                  description={section.description}
                  isOpen={!!openSections[section.id]}
                  onToggle={() => toggleSection(section.id)}
                />
                {/* Book Appointment button for each service */}
                {openSections[section.id] && (
                  <div className="px-4 pb-4 border-b border-gray-200">
                    <Button
                      onClick={() => handleBookAppointment(section.title)}
                      variant="outline"
                      className="w-full border-primary-700 text-primary-700 hover:bg-primary-50"
                    >
                      Book {section.title}
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
