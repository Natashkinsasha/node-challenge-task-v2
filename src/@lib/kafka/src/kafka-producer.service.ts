import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Message, Producer } from 'kafkajs';

import { KafkaClientService } from './kafka-client.service';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer!: Producer;
  private connected = false;

  constructor(private readonly client: KafkaClientService) {}

  async onModuleInit() {
    this.producer = this.client.createProducer();
    await this.producer.connect();
    this.connected = true;
    this.logger.log('Producer connected');
  }

  async onModuleDestroy() {
    if (!this.connected) return;
    try {
      await this.producer.disconnect();
      this.logger.log('Producer disconnected');
    } catch (e: any) {
      this.logger.error(`Producer disconnect error: ${e?.message ?? e}`);
      // важно: не пробрасываем ошибку
    } finally {
      this.connected = false;
    }
  }

  async send(topic: string, messages: Message[]) {
    return this.producer.send({ topic, messages });
  }

  async sendJson(topic: string, payload: unknown, key?: string) {
    const value = JSON.stringify(payload);
    return this.send(topic, [{ key, value }]);
  }
}
