import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EachMessagePayload } from 'kafkajs';

import { BaseKafkaConsumer } from '../../../../@lib/kafka/src';
import { ConsumerOptions } from '../../../../@lib/kafka/src';
import {
  TokenPriceTrickBullHandler,
  TokenPriceTrickBullJobDate,
} from '../bull-handler/token-price-trick.bull-handler';
import {
  CreateTokenPayload,
  schemaCreateTokenPayload,
} from '../kafka-message-payload/create-token.payload';

@Injectable()
export class StartTokenPriceTickConsumer extends BaseKafkaConsumer {
  constructor(
    @InjectQueue(TokenPriceTrickBullHandler.getName())
    private readonly tokenPriceTrickQueue: Queue<TokenPriceTrickBullJobDate>,
  ) {
    super();
  }

  protected getConsumerOptions(): ConsumerOptions {
    return {
      groupId: 'token-price-tick',
      topics: ['token.create'],
      fromBeginning: true,
    };
  }

  protected parse(message: EachMessagePayload['message']): CreateTokenPayload {
    const raw = message.value?.toString() ?? '{}';
    const json = JSON.parse(raw);
    return schemaCreateTokenPayload.parse(json);
  }

  public async handle(payload: EachMessagePayload): Promise<void> {
    const message = this.parse(payload.message);
    const { tokenId } = message;
    const jobId = `token-price-trick-${tokenId}`;
    await this.tokenPriceTrickQueue.add(
      `Token price trick: ${tokenId}`,
      { tokenId },
      { jobId, repeat: { every: 5000, key: jobId } },
    );
  }
}
