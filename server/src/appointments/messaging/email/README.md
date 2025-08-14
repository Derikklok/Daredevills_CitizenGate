# Email Templates

This directory contains React email templates for the CitizenGate application.

## Overview

The email templates are built using [@react-email/components](https://react.email/) and [@react-email/render](https://react.email/) to create beautiful, responsive HTML emails that work across all email clients.

## Available Templates

### Appointment Reminder Email

**File:** `appointment-reminder.tsx`

A professional appointment reminder email that includes:

- Appointment details (service, date, time, department, location)
- User-friendly formatting with clear typography
- Action buttons for rescheduling and canceling appointments
- Responsive design that works on mobile and desktop
- Fallback text version for email clients that don't support HTML

## Usage

### Basic Usage

```typescript
import { EmailRenderer, AppointmentReminderData } from "./email/email-renderer";

// Prepare the email data
const emailData: AppointmentReminderData = {
  appointmentId: "appointment-123",
  appointmentTime: "2025-08-15T10:30:00Z",
  serviceName: "Passport Renewal",
  departmentName: "Department of Immigration",
  location: "123 Government Street, Colombo 01",
  userName: "John Doe",
  userEmail: "john.doe@example.com",
  cancelUrl: "https://citizengate.com/appointments/appointment-123/cancel",
  rescheduleUrl:
    "https://citizengate.com/appointments/appointment-123/reschedule",
};

// Render the email
const { html, text } = await EmailRenderer.renderAppointmentReminder(emailData);

// Send the email
await emailService.sendEmail(userEmail, subject, text, html);
```

### Integration with Messaging Service

The `MessagingService` automatically uses these templates when sending appointment reminders. The service:

1. Fetches upcoming appointments that need reminders
2. Renders the email template with appointment data
3. Sends both HTML and text versions of the email
4. Updates the appointment record to mark the reminder as sent

## Template Features

### Responsive Design

- Mobile-first approach
- Works on all major email clients (Gmail, Outlook, Apple Mail, etc.)
- Graceful degradation for older email clients

### Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images (when added)
- High contrast colors for readability

### Branding

- CitizenGate branding and colors
- Professional typography
- Consistent styling across all templates

## Customization

### Adding New Templates

1. Create a new React component in this directory
2. Use `@react-email/components` for email-safe components
3. Add the template to the `EmailRenderer` class
4. Update the interface types as needed

### Styling

All styles are inline CSS for maximum email client compatibility. The templates use a consistent color palette:

- Primary: `#1a202c` (dark gray)
- Secondary: `#4299e1` (blue)
- Danger: `#e53e3e` (red)
- Background: `#f6f9fc` (light gray)
- Text: `#4a5568` (medium gray)

### Components Available

The templates use these React Email components:

- `Html`, `Head`, `Body` - Basic structure
- `Container`, `Section` - Layout components
- `Heading`, `Text` - Typography
- `Button` - Interactive elements
- `Hr` - Dividers
- `Row`, `Column` - Grid layout

## Testing

To test email templates locally:

1. Create a test script similar to the one in `test-email.ts`
2. Use the `EmailRenderer` to generate HTML and text versions
3. Save the output to files for inspection
4. Test in different email clients

## Email Service Integration

The templates work with both Plunk and SendGrid email services. Both services have been updated to support HTML content in addition to plain text.

### Plunk Service

- Supports HTML content via the `html` parameter
- Falls back to text-only if HTML is not provided

### SendGrid Service

- Supports HTML content via the `html` parameter
- Sends both HTML and text versions for better deliverability

## Best Practices

1. **Always provide both HTML and text versions** - Some email clients prefer text-only
2. **Test across multiple email clients** - Gmail, Outlook, Apple Mail, etc.
3. **Keep images minimal** - Many email clients block images by default
4. **Use inline styles** - External CSS is often stripped by email clients
5. **Test on mobile** - Most emails are read on mobile devices
6. **Keep file size small** - Large emails may be flagged as spam

## Dependencies

- `@react-email/components` - Email-safe React components
- `@react-email/render` - Render React components to HTML
- `react` - React framework

## Future Enhancements

- Add more email templates (welcome, confirmation, etc.)
- Support for dynamic content and personalization
- Email preview functionality
- A/B testing capabilities
- Analytics tracking for email engagement
