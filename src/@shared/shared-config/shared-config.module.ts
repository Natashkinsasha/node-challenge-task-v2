import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./env/.env', `./env/.env.${process.env['NODE_ENV']}`],
    }),
  ],
  exports: [ConfigModule],
})
export class SharedConfigModule {}
