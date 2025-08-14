import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { EmailServiceInterface } from "./email.service.interface";
import Plunk from "@plunk/node";

@Injectable()
export class EmailServicePlunk implements EmailServiceInterface {
    private plunk: Plunk;
    constructor(private readonly configService: ConfigService) {
        try {
            const apiKey = this.configService.plunkApiKey;
            if (!apiKey) {
                console.warn("Plunk API key not found. Email service will not work properly.");
                return;
            }
            this.plunk = new Plunk(apiKey);
        } catch (error) {
            console.error("Failed to initialize Plunk:", error);
        }
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
        try {
            if (!this.plunk) {
                console.warn("Plunk not initialized. Cannot send email.");
                return false;
            }

            console.log(`Sending email to ${to} with subject ${subject}`);

            let emailData: any;

            // If HTML is provided, send as HTML email
            if (html) {
                emailData = {
                    to,
                    subject,
                    body: html, // Use 'body' field for HTML content
                    text: text  // Use 'text' field for plain text fallback
                };
                console.log('📧 Sending HTML email with text fallback');
            } else {
                emailData = {
                    to,
                    subject,
                    body: text  // Use 'body' field for plain text
                };
                console.log('📧 Sending text-only email');
            }

            // Debug: Log the email data being sent
            console.log('Email data being sent to Plunk:', {
                to: emailData.to,
                subject: emailData.subject,
                hasBody: !!emailData.body,
                hasText: !!emailData.text,
                bodyLength: emailData.body?.length || 0,
                textLength: emailData.text?.length || 0
            });

            const response = await this.plunk.emails.send(emailData);
            console.log('Plunk API response:', response);
            return true;
        } catch (error) {
            console.error("Failed to send email via Plunk:", error);
            return false;
        }
    }
}