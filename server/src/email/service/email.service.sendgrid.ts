import { Injectable } from "@nestjs/common";
import { EmailServiceInterface } from "./email.service.interface";
import * as SendGrid from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService implements EmailServiceInterface {
    constructor(private readonly configService: ConfigService) {
        try {
            const apiKey = this.configService.get("sendgridApiKey");
            if (!apiKey) {
                console.warn("SendGrid API key not found. Email service will not work properly.");
                return;
            }
            SendGrid.setApiKey(apiKey);
        } catch (error) {
            console.error("Failed to initialize SendGrid:", error);
        }
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        try {
            const fromEmail = this.configService.get("fromEmail");
            if (!fromEmail) {
                console.warn("SendGrid from email not configured. Cannot send email.");
                return false;
            }

            const msg: any = {
                to,
                from: fromEmail,
                subject,
                text
            };

            // Add HTML content if provided
            if (html) {
                msg.html = html;
            }

            await SendGrid.send(msg);
            return true;
        } catch (error) {
            console.error("Failed to send email:", error);
            return false;
        }
    }
}