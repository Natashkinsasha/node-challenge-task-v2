import { ConsoleLogger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RawServerDefault } from 'fastify';
import { Memoize } from 'typescript-memoize';

import * as tables from '../../src/@logic/token-ticker/infrastructure/table';
import * as schema from '../../src/@logic/token-ticker/infrastructure/table';
import { AppDrizzleTransactionHost } from '../../src/@shared/shared-cls/app-drizzle-transaction-host';
import { DrizzlePgConfig } from '../../src/@shared/shared-drizzle-pg/drizzle-pg.config';
import { AppModule } from '../../src/app.module';
import { PostgresFixture } from '../../src/test/fuxture/postgres-fixture';

export class TestDrizzlePgConfig {
  constructor(private readonly url: string) {}

  create() {
    return {
      pg: {
        connection: 'pool' as const,
        config: {
          connectionString: this.url,
        },
      },
      config: { schema },
    };
  }
}

export class AppFixture {
  private constructor(
    private readonly app: NestFastifyApplication,
    private readonly postgresFixture: PostgresFixture,
  ) {}

  @Memoize()
  public static async create(
    _seed: number = Math.random(),
  ): Promise<AppFixture> {
    const postgresFixture = await PostgresFixture.create();
    const url = postgresFixture.getUrl();
    const app = await this.createApp(url);
    return new AppFixture(app, postgresFixture);
  }

  public getHttpServer(): RawServerDefault {
    return this.app.getHttpServer();
  }

  public close() {
    return this.app.close();
  }

  public getDb(): NodePgDatabase<typeof tables> {
    return this.app.get<AppDrizzleTransactionHost>(AppDrizzleTransactionHost)
      .tx;
  }

  public dropAllAndMigrate() {
    return this.postgresFixture.dropAllAndMigrate(this.getDb());
  }

  private static async createApp(url: string) {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DrizzlePgConfig)
      .useValue(new TestDrizzlePgConfig(url))
      .compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter({
        logger: true,
      }),
      {
        logger: new ConsoleLogger('AppFixture', {
          logLevels: ['error', 'warn', 'log', 'debug', 'verbose'],
        }),
      },
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return app;
  }
}
