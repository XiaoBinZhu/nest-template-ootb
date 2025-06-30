import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;
    private replyTo: string | undefined;

    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: config.get('MAIL_HOST'),
            port: Number(config.get('MAIL_PORT')),
            secure: true,
            auth: {
                user: config.get('MAIL_USER'),
                pass: config.get('MAIL_PASS'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.replyTo = config.get('MAIL_REPLY');
    }

    async sendMail(to: string, subject: string, html: string) {
        return this.transporter.sendMail({
            from: `"系统通知" <${this.config.get('MAIL_USER')}>`,
            to,
            subject,
            html,
            replyTo: this.replyTo,
        });
    }
}
