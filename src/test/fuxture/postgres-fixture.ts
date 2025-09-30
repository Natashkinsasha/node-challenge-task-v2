import { sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { GenericContainer, StartedTestContainer } from "testcontainers";

import { migrate } from "drizzle-orm/postgres-js/migrator";

export class PostgresFixture {
  private constructor() {}

  private container: StartedTestContainer | null = null;

  public static create() {
    return new PostgresFixture();
  }

  public async dropAllAndMigrate(db: PostgresJsDatabase) {
    await this.dropAll(db);
    await this.migrate(db);
  }

  public async dropAll(db: PostgresJsDatabase) {
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
  }

  public migrate(db: PostgresJsDatabase) {
    return migrate(db, {
      migrationsFolder: "src/@logic/token-ticker/infrastructure/migration",
    });
  }

  public async getUrl() {
    const testId = Math.random().toString(36).substring(7);
    const port = 5432;
    const name = `postgres-test-${testId}`;
    const user = "testuser";
    const dbName = "testdb";
    const password = "testpassword";
    this.container = await new GenericContainer("postgres:15-alpine")
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
