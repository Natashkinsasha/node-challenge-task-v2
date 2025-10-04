import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Memoize } from 'typescript-memoize';

import * as tables from '../../@logic/token-ticker/infrastructure/table';

export class PostgresFixture {
  private constructor(
    private readonly container: StartedTestContainer,
    private readonly user: string,
    private readonly password: string,
    private readonly dbName: string,
    private readonly port: number,
  ) {}

  @Memoize()
  public static async create(_seed: number = Math.random()) {
    const testId = Math.random().toString(36).substring(7);
    const port = 5432;
    const name = `postgres-test-${testId}`;
    const user = 'testuser';
    const password = 'testpassword';
    const dbName = 'testdb';
    const container = await new GenericContainer('postgres:15-alpine')
      .withName(name)
      .withEnvironment({
        POSTGRES_USER: user,
        POSTGRES_PASSWORD: password,
        POSTGRES_DB: dbName,
      })
      .withExposedPorts(port)
      .start();
    return new PostgresFixture(container, user, password, dbName, port);
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
  public getUrl(): string {
    const host = this.container.getHost();
    const mappedPort = this.container.getMappedPort(this.port);
    return `postgres://${this.user}:${this.password}@${host}:${mappedPort}/${this.dbName}`;
  }

  public async stop() {
    await this.container.stop();
  }
}
