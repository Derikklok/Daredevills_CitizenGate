import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ChevronLeft, 
  Menu, 
  Search, 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';

// Define types at the top level
type AppointmentCategory = 'Transport' | 'Health Services' | 'Education' | 'Land Permits';

const appointments: Record<AppointmentCategory, string[]> = {
  'Transport': ['New Drivers License', 'Vehicle Registration', 'License Renewal'],
  'Health Services': ['Medical Records', 'Health Card Application', 'Vaccination Certificate'],
  'Education': ['School Enrollment', 'Transcript Request', 'Scholarship Application'],
  'Land Permits': ['Building Permit', 'Land Registration', 'Zoning Application']
};

const categories: AppointmentCategory[] = ['Transport', 'Health Services', 'Education', 'Land Permits'];

// Header Component
// const BookingHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
//   <div className="bg-white border-b border-gray-100 px-4 py-3">
//     <div className="flex items-center justify-between">
//       <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100">
//         <ChevronLeft className="w-5 h-5" />
//       </Button>
//       <div className="text-center">
//         <span className="text-lg font-semibold text-primary-700">Citizen</span>
//         <span className="text-lg font-semibold text-pink-500">Gate</span>
//       </div>
//       <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
//         <Menu className="w-5 h-5" />
//       </Button>
//     </div>
//     <h1 className="text-xl font-semibold text-primary-700 mt-2">{title}</h1>
//   </div>
// );

// Step 1: Select Appointment
const SelectAppointmentPage: React.FC<{
  preselectedCategory?: string;
  preselectedService?: string;
  onNext: (data: { category: string; appointment: string }) => void;
  onBack: () => void;
}> = ({ preselectedCategory, preselectedService, onNext, onBack }) => {
  const [category, setCategory] = useState<AppointmentCategory | ''>(preselectedCategory as AppointmentCategory || '');
  const [appointment, setAppointment] = useState(preselectedService || '');

  const handleNext = () => {
    if (category && appointment) {
      onNext({ category, appointment });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <BookingHeader title="Select Appointment" onBack={onBack} /> */}
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as AppointmentCategory)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Select value={appointment} onValueChange={setAppointment}>
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {category && appointments[category]?.map((apt) => (
                    <SelectItem key={apt} value={apt}>{apt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* General Information */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-700 mb-3">General Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>1 Hour</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rs. 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Nugegoda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Booking slots available for physical sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!category || !appointment}
          className="w-full mt-8 bg-primary-700 hover:bg-primary-800"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

// Step 2: Personal Details
interface PersonalDetailsPageProps {
  appointmentData: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

const PersonalDetailsPage: React.FC<PersonalDetailsPageProps> = ({ appointmentData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (formData.name && formData.phone && formData.email) {
      onNext({ ...appointmentData, personalDetails: formData });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <BookingHeader title="Personal Details" onBack={onBack} /> */}
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input
              type="tel"
              placeholder="+94 77 123 456"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!formData.name || !formData.phone || !formData.email}
          className="w-full mt-8 bg-primary-700 hover:bg-primary-800"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

// Step 3: Document Checklist
interface DocumentChecklistPageProps {
  appointmentData: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

const DocumentChecklistPage: React.FC<DocumentChecklistPageProps> = ({ appointmentData, onNext, onBack }) => {
  const [checkedDocuments, setCheckedDocuments] = useState<Record<string, boolean>>({});
  const [additionalInfo, setAdditionalInfo] = useState('');

  const documents = [
    { id: 'nic', label: 'National Identity Card (Original + Photocopy)', requiprimary: true },
    { id: 'birth', label: 'Birth Certificate (Original)', requiprimary: false },
    { id: 'photo', label: 'Photograph (specify size)', requiprimary: false }
  ];

  const handleDocumentChange = (docId: string, checked: boolean) => {
    setCheckedDocuments(prev => ({ ...prev, [docId]: checked }));
  };

  const handleNext = () => {
    const requiprimaryDocs = documents.filter(doc => doc.requiprimary);
    const allRequiprimaryChecked = requiprimaryDocs.every(doc => checkedDocuments[doc.id]);
    
    if (allRequiprimaryChecked) {
      onNext({ 
        ...appointmentData, 
        documents: checkedDocuments,
        additionalInfo 
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <BookingHeader title="Document Checklist" onBack={onBack} /> */}
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-3">
                <Checkbox
                  id={doc.id}
                  checked={checkedDocuments[doc.id] || false}
                  onCheckedChange={(checked) => handleDocumentChange(doc.id, !!checked)}
                  className="mt-1"
                />
                <label 
                  htmlFor={doc.id} 
                  className="text-sm text-gray-700 flex-1 cursor-pointer"
                >
                  {doc.label}
                  {doc.requiprimary && <span className="text-primary-500 ml-1">*</span>}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Fee (Rs. 500)
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="pay-online" />
                <label htmlFor="pay-online" className="text-sm text-gray-700">Pay online</label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="pay-cash" />
                <label htmlFor="pay-cash" className="text-sm text-gray-700">Cash</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional context for docs
            </label>
            <Textarea
              placeholder="Copies will be retained"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full h-20"
            />
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-primary-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Progress saved</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleNext}
          className="w-full mt-8 bg-primary-700 hover:bg-primary-800"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

// Step 4: Choose Location & Time
interface LocationTimePageProps {
  appointmentData: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

const LocationTimePage: React.FC<LocationTimePageProps> = ({ appointmentData, onNext, onBack }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');

  const locations = ['Nugegoda Office', 'Colombo Office', 'Kandy Office'];
  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM',
    '11:00 AM', '12:30 PM', '01:30 PM'
  ];

  const handleSubmit = () => {
    if (location && date && selectedTime) {
      const finalData = {
        ...appointmentData,
        location,
        date,
        time: selectedTime
      };
      onNext(finalData);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <BookingHeader title="Book Appointment" onBack={onBack} /> */}
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-teal-500 h-1 rounded-full w-full"></div>
          </div>

          {/* Choose Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Location</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferprimary Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferprimary Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : "dd/mm/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Available Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className={`text-xs ${
                    selectedTime === time 
                      ? "bg-primary-500 hover:bg-primary-700" 
                      : "border-gray-300"
                  }`}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-700 mb-2">Additional info based on location</h3>
              <p className="text-sm text-gray-600 mb-1">Nugegoda Office: Address</p>
              <p className="text-sm text-gray-600">Open hours: 8am - 4pm</p>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!location || !date || !selectedTime}
          className="w-full mt-8 bg-primary-500 hover:bg-primary-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

// Main Booking Flow Component
interface BookingFlowProps {
  preselectedCategory?: string;
  preselectedService?: string;
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ preselectedCategory, preselectedService, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({});

  const handleStepComplete = (data: Record<string, any>) => {
    setBookingData(data);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  switch (currentStep) {
    case 1:
      return (
        <SelectAppointmentPage
          preselectedCategory={preselectedCategory}
          preselectedService={preselectedService}
          onNext={handleStepComplete}
          onBack={handleBack}
        />
      );
    case 2:
      return (
        <PersonalDetailsPage
          appointmentData={bookingData}
          onNext={handleStepComplete}
          onBack={handleBack}
        />
      );
    case 3:
      return (
        <DocumentChecklistPage
          appointmentData={bookingData}
          onNext={handleStepComplete}
          onBack={handleBack}
        />
      );
    case 4:
      return (
        <LocationTimePage
          appointmentData={bookingData}
          onNext={handleStepComplete}
          onBack={handleBack}
        />
      );
    default:
      return null;
  }
};

export default BookingFlow;