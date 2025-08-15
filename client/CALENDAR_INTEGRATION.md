# Calendar Functionality Integration Guide

This document provides instructions for integrating the calendar and appointment booking functionality into the master branch of the CitizenGate application.

## Overview

The calendar functionality enables citizens to:

1. View service availability by day and time
2. See available time slots for government services
3. Book appointments at specific times
4. Handle multi-day availability entries (e.g., "Tuesday Thursday")

## Files to Integrate

### Client-side files:

1. **Calendar View Component**
   - `client/src/pages/CalendarView.tsx` - Main calendar view showing service availability

2. **Time Slot Selector Component**
   - `client/src/components/TimeSlotSelector.tsx` - Component for selecting time slots

3. **Booking Flow**
   - `client/src/pages/BookingFlow.tsx` - Step-by-step booking flow leading to the calendar view

4. **API Service**
   - `client/src/lib/api-service.ts` - API service with interfaces and methods for fetching service availability data

## Integration Steps

### Step 1: Check Your Service Availability Database Schema

Ensure your database schema includes the service availability structure with:
- `day_of_week`: String field that can handle single days or multiple days (e.g., "Tuesday" or "Tuesday Thursday")
- `start_time`: Time field for when service becomes available
- `end_time`: Time field for when service ends
- `duration_minutes`: Integer field for appointment slot duration

### Step 2: Routes Integration

Add these routes to your main routing configuration in `App.tsx`:

```tsx
<Routes>
  {/* Existing routes */}
  <Route path="/calendar/:serviceId" element={<CalendarView />} />
  <Route path="/booking" element={<BookingFlow />} />
</Routes>
```

### Step 3: API Integration

Ensure your backend implements the following API endpoints:

1. **Get Service Availability**
   - `GET /api/service-availability/service/:serviceId` - Returns availability for a specific service

2. **Get Departments with Services**
   - `GET /api/departments` - Returns all departments with their services

### Step 4: UI Adjustments

You may need to adapt the calendar UI to match your design system:

1. **Color Scheme**
   - The calendar currently uses `#8D153A` as the primary color. Update this in:
     - `CalendarView.tsx` - Search for `bg-[#8D153A]` and replace with your color scheme
     - `TimeSlotSelector.tsx` - Update the button colors as needed

2. **Typography**
   - Update font styles in the calendar components if needed

### Step 5: Testing

Test the following user flows to ensure integration works correctly:

1. Navigate from department/service selection to the calendar view
2. Display correct availability for a selected service
3. Select a day and time slot
4. Book an appointment (redirects to sign-in if not authenticated)
5. Verify multi-day availability entries display correctly

## Important Notes

### Multi-day Availability Handling

The calendar view includes special handling for services with availability on multiple days:

```tsx
// Code in CalendarView.tsx that processes multi-day entries
const processAvailabilityDays = (availabilityData: ServiceAvailability[]): ServiceAvailability[] => {
  const processedAvailability: ServiceAvailability[] = [];
  
  availabilityData.forEach(item => {
    // Check if day_of_week contains multiple days (split by spaces)
    const days = item.day_of_week.split(/\s+/).filter(day => day.trim().length > 0);
    
    if (days.length > 1) {
      // Create a separate availability entry for each day
      days.forEach(day => {
        processedAvailability.push({
          ...item,
          day_of_week: day
        });
      });
    } else {
      // Single day, add as is
      processedAvailability.push(item);
    }
  });
  
  return processedAvailability;
};
```

This feature allows administrators to set availability like "Monday Wednesday Friday" and the calendar will display these as separate day entries.

### Authentication Flow

The calendar integrates with Clerk authentication:

1. If a user tries to book while not signed in, they're redirected to sign-in page
2. After signing in, they're redirected back to calendar view
3. Make sure your auth provider is properly configured

## Troubleshooting

### Common Issues

1. **Availability Not Displaying**
   - Check that your service ID is correctly passed to the calendar view
   - Verify service availability API endpoint is returning data in the expected format

2. **Time Slots Not Generating Correctly**
   - Check that `duration_minutes` is set correctly in the service availability data
   - Verify the time formatting is compatible (expected format: HH:MM)

3. **Day Order Issues**
   - The calendar sorts days in the standard order (Monday-Sunday)
   - If you need a different order, modify the `orderDays` function in CalendarView.tsx

## Final Steps

After integration, perform a thorough review of:

1. Visual consistency with the rest of your application
2. Mobile responsiveness of the calendar view
3. Error handling for edge cases (no availability, service not found)
4. Authentication flow for booking appointments

For any questions or issues, contact the calendar feature developer.
