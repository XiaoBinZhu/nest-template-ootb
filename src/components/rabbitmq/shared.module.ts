import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';
import { MailerService } from './mailer.service';
import { NotifyService } from './notify.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [RabbitmqService, MailerService, NotifyService],
    exports: [RabbitmqService, MailerService],
})
export class SharedModule { }
