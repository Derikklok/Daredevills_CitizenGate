import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MessagingService } from "./messaging.service";
import { AppointmentsModule } from "../appointments.module";
import { EmailModule } from "../../email/email.module";

@Module({
    imports: [ScheduleModule, AppointmentsModule, EmailModule],
    providers: [MessagingService],
    exports: [MessagingService],
})
export class MessagingModule { }