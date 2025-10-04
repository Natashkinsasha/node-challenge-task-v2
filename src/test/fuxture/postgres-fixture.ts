import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Memoize } from 'typescript-memoize';

import * as tables from '../../@logic/token-ticker/infrastructure/table';

export class PostgresFixture {
  private constructor() {}

  private container: StartedTestContainer | null = null;

  @Memoize()
  public static create(_seed: number = Math.random()) {
    return new PostgresFixture();
  }

  public async dropAllAndMigrate(db: NodePgDatabase<typeof tables>) {
    await this.dropAll(db);
    await this.migrate(db);
  }

  public async dropAll(db: NodePgDatabase<typeof tables>) {
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
  }

  public migrate(db: NodePgDatabase<typeof tables>) {
    return migrate(db, {
      migrationsFolder: 'src/@logic/token-ticker/infrastructure/migration',
    });
  }

  @Memoize()
  public async getUrl(dbName: string = 'testdb') {
    const testId = Math.random().toString(36).substring(7);
    const port = 5432;
    const name = `postgres-test-${testId}`;
    const user = 'testuser';
    const password = 'testpassword';
    this.container = await new GenericContainer('postgres:15-alpine')
      .withName(name)
      .withEnvironment({
        POSTGRES_USER: user,
        POSTGRES_PASSWORD: password,
        POSTGRES_DB: dbName,
      })
      .withExposedPorts(port)
      .start();

    const host = this.container.getHost();
    const mappedPort = this.container.getMappedPort(port);
    return `postgres://${user}:${password}@${host}:${mappedPort}/${dbName}`;
  }

  public async stop() {
    await this.container?.stop();
    this.container = null;
  }
}
