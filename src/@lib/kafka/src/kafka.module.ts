import type { ModuleMetadata } from '@nestjs/common';
import { DynamicModule, Module } from '@nestjs/common';

import { KafkaModuleOptions } from './kafaka.types';
import { KafkaClientService } from './kafka-client.service';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_OPTIONS } from './kafka.constants';

export interface KafkaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => KafkaModuleOptions | Promise<KafkaModuleOptions>;
  inject?: any[];
}

@Module({})
export class KafkaModule {
  static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: KAFKA_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        KafkaClientService,
        KafkaProducerService,
      ],
      exports: [KafkaClientService, KafkaProducerService],
    };
  }
}
