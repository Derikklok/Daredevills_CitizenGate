import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Service {
  service_id: string;
  name: string;
  description: string;
  department_id: number;
  category: string;
  estimated_total_completion_time: string;
  created_at: string;
  updated_at: string;
  department: {
    department_id: number;
    name: string;
    description: string | null;
    address: string;
    contact_email: string;
    contact_phone: string;
  };
}

const BookingAppointments = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with your actual API endpoint
        const response = await fetch("http://localhost:3000/api/government-services");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const data = await response.json();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        // Add sample data for demonstration purposes
        setServices([
          {
            service_id: "dbb4126d-cac4-4b87-8712-c27761d78691",
            name: "New Driving License 2025",
            description: "Instructions to obtain the new smart card Driving License.",
            department_id: 1,
            category: "Transport",
            estimated_total_completion_time: "8 Months",
            created_at: "2025-08-13T00:20:54.268Z",
            updated_at: "2025-08-13T00:29:15.687Z",
            department: {
              department_id: 1,
              name: "Department of Motor Vehicles",
              description: null,
              address: "Colombo 05, Sri Lanka",
              contact_email: "dmv@gov.lk",
              contact_phone: "0112444555",
            }
          },
          {
            service_id: "5c69b2d8-a9e5-4f7b-8a1c-2d3e4f5a6b7c",
            name: "Passport Renewal",
            description: "Renew your expired or expiring passport.",
            department_id: 2,
            category: "Immigration",
            estimated_total_completion_time: "1 Month",
            created_at: "2025-08-13T00:20:54.268Z",
            updated_at: "2025-08-13T00:29:15.687Z",
            department: {
              department_id: 2,
              name: "Department of Immigration",
              description: null,
              address: "Colombo 10, Sri Lanka",
              contact_email: "immigration@gov.lk",
              contact_phone: "0112333444",
            }
          },
          {
            service_id: "9d8c7b6a-5f4e-3d2c-1b0a-9e8d7c6b5a4e",
            name: "Business Registration",
            description: "Register a new business or company.",
            department_id: 3,
            category: "Business",
            estimated_total_completion_time: "2 Weeks",
            created_at: "2025-08-13T00:20:54.268Z",
            updated_at: "2025-08-13T00:29:15.687Z",
            department: {
              department_id: 3,
              name: "Registrar of Companies",
              description: null,
              address: "Colombo 02, Sri Lanka",
              contact_email: "roc@gov.lk",
              contact_phone: "0112111222",
            }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Extract unique categories from services
  const categories = [...new Set(services.map(service => service.category))];

  // Filter services by selected category
  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-[#8D153A] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Book Government Appointments</h1>
          <p className="text-lg">Browse and schedule appointments for government services</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className={selectedCategory === null ? "bg-[#8D153A]" : ""}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-[#8D153A]" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D153A]"></div>
          </div>
        ) : error && services.length === 0 ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service.service_id} 
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-50 p-4">
                  <h3 className="font-bold text-lg text-[#8D153A] mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-gray-500" />
                      <span>{service.department.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <span>Est. completion: {service.estimated_total_completion_time}</span>
                    </div>
                  </div>

                  <Link to={`/calendar/${service.service_id}`}>
                    <Button className="w-full bg-[#8D153A] hover:bg-[#8D153A]/90">
                      <Calendar size={16} className="mr-2" />
                      View Availability
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingAppointments;
