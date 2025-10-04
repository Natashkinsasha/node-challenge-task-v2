import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload } from 'kafkajs';

import { ConsumerOptions } from './kafaka.types';
import { KafkaClientService } from './kafka-client.service';

export abstract class BaseKafkaConsumer
  implements OnModuleInit, OnModuleDestroy
{
  protected readonly logger = new Logger(this.constructor.name);

  @Inject() private readonly client!: KafkaClientService;
  protected consumer!: Consumer;
  private connected = false;

  protected constructor() {}

  protected abstract getConsumerOptions(): ConsumerOptions;

  protected abstract handle(raw: EachMessagePayload): Promise<void>;

  async onModuleInit() {
    const {
      groupId,
      topics,
      fromBeginning = false,
      concurrency = 1,
    } = this.getConsumerOptions();

    this.consumer = this.client.createConsumer(groupId);
    await this.consumer.connect();
    this.connected = true;
    this.logger.log(`Consumer connected (group=${groupId})`);

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning });
      this.logger.log(`Subscribed to ${topic}`);
    }

    this.logger.log('Starting consumer run loop');
    await this.consumer.run({
      partitionsConsumedConcurrently: Math.max(1, concurrency),
      eachMessage: async (payload) => {
        await this.handle(payload);
      },
    });
  }

  async onModuleDestroy() {
    if (!this.connected) return;
    try {
      await this.consumer.disconnect();
      this.logger.log('Consumer disconnected');
    } catch (e: any) {
      this.logger.error(`Consumer disconnect error: ${e?.message ?? e}`);
    } finally {
      this.connected = false;
    }
  }
}
