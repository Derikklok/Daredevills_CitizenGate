import { Module } from "@nestjs/common";
import { EmailService } from "./service/email.service.sendgrid";
import { EmailServicePlunk } from "./service/email.service.plunk";
import { AppConfigModule } from "../config/config.module";

@Module({
    imports: [AppConfigModule],
    providers: [EmailService, EmailServicePlunk],
    exports: [EmailService, EmailServicePlunk],
})
export class EmailModule { }