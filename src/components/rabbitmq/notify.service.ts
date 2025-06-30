import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { MailerService } from './mailer.service';

@Injectable()
export class NotifyService implements OnModuleInit {
    constructor(
        private readonly rabbitmqService: RabbitmqService,
        private readonly mailerService: MailerService,
    ) { }

    async onModuleInit() {
        console.log('📥 NotifyService 已开始监听 email 队列');
        await this.rabbitmqService.consume('email', async (data) => {
            const { to, title, content } = data;
            console.log(`📨 正在发送邮件 -> ${to}`);
            await this.mailerService.sendMail(to, title, content);
        });
    }
}
