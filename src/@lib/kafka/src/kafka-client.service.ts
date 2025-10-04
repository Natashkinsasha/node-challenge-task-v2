import { Inject, Injectable } from '@nestjs/common';
import { Consumer, Kafka, logLevel, Partitioners, Producer } from 'kafkajs';

import { KafkaModuleOptions } from './kafaka.types';
import { KAFKA_OPTIONS } from './kafka.constants';

@Injectable()
export class KafkaClientService {
  private kafka: Kafka;

  constructor(@Inject(KAFKA_OPTIONS) opts: KafkaModuleOptions) {
    this.kafka = new Kafka({
      clientId: opts.clientId,
      brokers: opts.brokers,
      ssl: opts.ssl,
      sasl: opts.sasl,
      logLevel: opts.logLevel ?? logLevel.WARN,
      connectionTimeout: opts.connectionTimeoutMs ?? 10_000,
    });
  }

  createProducer(): Producer {
    return this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}
