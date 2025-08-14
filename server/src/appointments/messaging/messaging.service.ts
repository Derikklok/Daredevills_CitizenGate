import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppointmentsService } from "../appointments.service";
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from "../appointment.entity";
import { EmailServicePlunk } from "../../email/service/email.service.plunk";
import { AppointmentReminderEmail } from "./email/appointment-reminder";
import { render } from "@react-email/components";

@Injectable()
export class MessagingService {
    constructor(
        private readonly appointmentsService: AppointmentsService,
        private readonly emailService: EmailServicePlunk
    ) { }

    @Cron(CronExpression.EVERY_HOUR, {
        name: "send-reminders"
    })
    async sendReminders() {
        console.log("Sending reminders");
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Get pending appointments in the next 24 hours using database filtering
        const upcomingAppointments = await this.appointmentsService.findAll({
            status: "pending",
            appointment_time: {
                from: now,
                to: twentyFourHoursFromNow
            },
            exclude_reminders_sent: true
        });

        console.log(`Found ${upcomingAppointments.length} appointments in the next 24 hours:`, upcomingAppointments);

        for (const appointment of upcomingAppointments) {
            console.log(`Sending reminder for appointment ${appointment.appointment_id} at ${appointment.appointment_time}`);

            const reminderSent = await this.sendEmailReminder(appointment);

            if (reminderSent) {

                this.appointmentsService.update(appointment.appointment_id, {
                    reminders_sent: [
                        ...(appointment.reminders_sent || []),
                        {
                            reminder_id: uuidv4(),
                            reminder_time: new Date()
                        }
                    ]
                });
            }

        }
    }

    async sendEmailReminder(appointment: Appointment): Promise<boolean> {
        try {
            console.log(`Sending email reminder for appointment ${appointment.appointment_id} at ${appointment.appointment_time}`);

            // TODO: Get user email from appointment or user service
            const userEmail = appointment.email || "nimesha.periyap@gmail.com";
            const userName = appointment.full_name || "User";

            // Get service and department details from appointment relationships
            // Note: These relationships need to be loaded when fetching appointments
            const serviceName = appointment.service?.name || "Government Service";
            const departmentName = appointment.service?.department?.name || "Government Department";
            // ServiceAvailability doesn't have location, so we'll use department address or leave it undefined
            const location = appointment.service?.department?.address;


            const html = await render(AppointmentReminderEmail({
                appointmentId: appointment.appointment_id,
                appointmentTime: appointment.appointment_time,
                serviceName: serviceName,
                departmentName: departmentName,
                location: location,
                userName: userName,
                userEmail: userEmail
            }));

            const subject = "Appointment Reminder - CitizenGate";

            // Generate a simple text version for fallback
            const text = `Appointment Reminder - CitizenGate

Dear ${userName},

This is a friendly reminder about your upcoming appointment with ${departmentName}.

APPOINTMENT DETAILS:
- Service: ${serviceName}
- Date: ${new Date(appointment.appointment_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Time: ${new Date(appointment.appointment_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
- Department: ${departmentName}
${location ? `- Location: ${location}` : ''}
- Appointment ID: ${appointment.appointment_id}

Please arrive 10 minutes before your scheduled time to complete any necessary check-in procedures.

If you have any questions or need to make changes to your appointment, please contact us as soon as possible.

---
This is an automated reminder from CitizenGate. Please do not reply to this email.
© 2024 CitizenGate. All rights reserved.`;

            const success = await this.emailService.sendEmail(userEmail, subject, text, html);

            if (success) {
                console.log('✅ Email sent successfully with HTML content');
            } else {
                console.log('❌ Failed to send email');
            }

            return success;
        } catch (error) {
            console.error(`Failed to send email reminder for appointment ${appointment.appointment_id}:`, error);
            return false;
        }
    }
}