import { useState } from 'react';
import { Bus, Heart, GraduationCap, FileText } from 'lucide-react';
import ServiceCard from '@/components/booking/ServiceCard';
import ServiceDetails from './ServiceDetails';
import BookingFlow from './BookingFlow';

const ServicesGrid = ({ onServiceClick }: { onServiceClick: (service: any) => void }) => {
  const services = [
    { icon: Bus, title: 'Transport', id: 'transport' },
    { icon: Heart, title: 'Health Services', id: 'health' },
    { icon: GraduationCap, title: 'Education', id: 'education' },
    { icon: FileText, title: 'Land Permits', id: 'permits' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          icon={service.icon}
          title={service.title}
          onClick={() => onServiceClick(service)}
        />
      ))}
    </div>
  );
};

const BookingAppointments = () => {
  const [currentView, setCurrentView] = useState('grid'); // 'grid', 'details', 'booking'
  const [selectedService, setSelectedService] = useState<any>(null);

  // Handle service card click - goes to service details
  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setCurrentView('details');
  };

  // Handle back from service details to grid
  const handleBackToGrid = () => {
    setCurrentView('grid');
    setSelectedService(null);
  };

  // Handle "Book Appointment" from service details - goes to booking flow
  const handleStartBooking = (selectedServiceFromDetails?: string) => {
    setCurrentView('booking');
    // If a specific service was selected from the details page, use that
    // Otherwise use the currently selected service
  };

  // Handle booking completion
  const handleBookingComplete = (bookingData: any) => {
    console.log('Booking completed:', bookingData);
    // Here you would typically:
    // 1. Send data to your backend
    // 2. Show success message
    // 3. Navigate to confirmation page
    alert('Booking completed successfully!');
    setCurrentView('grid');
    setSelectedService(null);
  };

  // Handle booking cancellation
  const handleBookingCancel = () => {
    setCurrentView('details'); // Go back to service details
  };

  // Render based on current view
  if (currentView === 'booking') {
    return (
      <BookingFlow
        preselectedCategory={selectedService?.title}
        preselectedService={selectedService?.title}
        onComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
      />
    );
  }

  if (currentView === 'details') {
    return (
      <ServiceDetails
        serviceName={selectedService?.title || ''}
        onBack={handleBackToGrid}
        onBookAppointment={handleStartBooking} // Add this prop to ServiceDetails
      />
    );
  }

  // Default grid view
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className='text-xl font-semibold pb-6'>Book an appointment</h1>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-normal text-gray-900">Select a service</h2>
      </div>
      <div>
        <ServicesGrid onServiceClick={handleServiceClick} />
      </div>
    </div>
  );
};

export default BookingAppointments;