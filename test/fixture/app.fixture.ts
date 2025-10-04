import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';

import { AppDrizzleTransactionHost } from '../../src/@shared/shared-cls/app-drizzle-transaction-host';
import { createApp } from '../../src/create-app';

export class AppFixture {
  private constructor(private readonly app: NestFastifyApplication) {}

  public static async create(): Promise<AppFixture> {
    const app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return new AppFixture(app);
  }

  public getHttpServer(): RawServerDefault {
    return this.app.getHttpServer();
  }

  public close() {
    return this.app.close();
  }

  public getDb() {
    return this.app.get<AppDrizzleTransactionHost>(AppDrizzleTransactionHost)
      .tx;
  }
}
