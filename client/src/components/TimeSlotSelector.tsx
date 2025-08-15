import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  day: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  onBookAppointment: (time: string) => void;
}

const TimeSlotSelector = ({
  day,
  startTime,
  endTime,
  durationMinutes,
  onBookAppointment,
}: TimeSlotSelectorProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate available time slots based on service duration
  const generateTimeSlots = () => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    let currentSlot = startMinutes;
    
    while (currentSlot + durationMinutes <= endMinutes) {
      // Convert back to HH:MM format
      const hours = Math.floor(currentSlot / 60);
      const minutes = currentSlot % 60;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      
      slots.push(formattedTime);
      currentSlot += durationMinutes; // Move to next slot based on duration
    }
    
    return slots;
  };

  // Format time for display (HH:MM to h:mm AM/PM)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold text-lg mb-3 flex items-center">
        <Calendar className="mr-2 text-[#8D153A]" size={20} />
        {day} Slots
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 flex items-center">
          <Clock className="mr-1" size={14} />
          Available from {formatTime(startTime)} to {formatTime(endTime)}
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedTime === time
                ? "bg-[#8D153A] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {formatTime(time)}
          </button>
        ))}
      </div>
      
      {selectedTime && (
        <Button
          className="w-full mt-4 bg-[#8D153A]"
          onClick={() => onBookAppointment(selectedTime)}
        >
          Book at {formatTime(selectedTime)}
        </Button>
      )}
    </div>
  );
};

export default TimeSlotSelector;
