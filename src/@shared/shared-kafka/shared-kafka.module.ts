import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KafkaModule } from '../../@lib/kafka/src/kafka.module';
import { SharedConfigModule } from '../shared-config/shared-config.module';

@Module({
  imports: [
    KafkaModule.forRootAsync({
      imports: [SharedConfigModule],
      useFactory: (config: ConfigService) => ({
        clientId: config.getOrThrow('KAFKA_CLIENT_ID'),
        brokers: config.getOrThrow('KAFKA_BROKERS').split(','),
        ssl: config.get('KAFKA_SSL') === 'true',
        connectionTimeoutMs: Number(
          config.get('KAFKA_CONNECTION_TIMEOUT_MS') ?? 10000,
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [KafkaModule],
})
export class SharedKafkaModule {}
