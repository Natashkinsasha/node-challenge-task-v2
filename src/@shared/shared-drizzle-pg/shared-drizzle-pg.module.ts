import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as schema from '../../@logic/token-ticker/infrastructure/table';
import { SharedConfigModule } from '../shared-config/shared-config.module';

@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      imports: [SharedConfigModule],
      tag: 'DB',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('DATABASE_URL');
        return {
          pg: {
            connection: 'pool',
            config: {
              connectionString: url,
            },
          },
          config: { schema },
        };
      },
    }),
  ],
  exports: [DrizzlePGModule],
})
export class SharedDrizzlePgModule {}
