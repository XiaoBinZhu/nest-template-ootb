import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService implements OnModuleInit {
    private connection: amqplib.Connection;
    private channel: amqplib.Channel;
    private initialized: Promise<void>;

    constructor(private config: ConfigService) { }

    async onModuleInit() {
        this.initialized = this.init();
    }

    private async init() {
        const url = `amqp://${this.config.get('RABBITMQ_USER')}:${this.config.get('RABBITMQ_PASS')}@${this.config.get('RABBITMQ_HOST')}:${this.config.get('RABBITMQ_PORT')}`;
        this.connection = await amqplib.connect(url);
        this.channel = await this.connection.createChannel();
        console.log('🐇 RabbitMQ 初始化完成');
    }

    async sendToQueue(queue: string, message: any) {
        await this.initialized;
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, handler: (msg: any) => void) {
        await this.initialized;
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                handler(data);
                this.channel.ack(msg);
            }
        });
    }
}
