import { randomUUID } from 'crypto';
import * as request from 'supertest';

import * as tables from '../src/@logic/token-ticker/infrastructure/table';
import * as schema from '../src/@logic/token-ticker/infrastructure/table';
import { AppFixture } from './fixture/app.fixture';

describe('Token E2E (POST /api/v1/tokens/)', () => {
  let app: AppFixture;

  beforeAll(async () => {
    app = await AppFixture.create();
  }, 180_000);

  afterAll(async () => {
    await app?.close();
  }, 60_000);

  it('should create a token and return it in response', async () => {
    const server = app.getHttpServer();

    const chainId = randomUUID();
    const data = {
      id: chainId,
      debridgeId: 65001,
      name: 'Test Chain',
      isEnabled: true,
    };
    const [chain] = await app
      .getDb()
      .insert(schema.chainTable)
      .values(data)
      .onConflictDoUpdate({
        target: tables.chainTable.debridgeId,
        set: {
          name: data.name,
          isEnabled: data.isEnabled,
        },
      })
      .returning();

    const address = randomUUID();

    const payload = {
      address,
      chainId: chain.id,
      symbol: 'TST',
      name: 'Test Token',
      decimals: 18,
      isNative: false,
      isProtected: false,
      lastUpdateAuthor: 'e2e-test',
      priority: 1,
    };

    const res = await request(server).post('/api/v1/tokens').send(payload);

    expect(res.status).toBe(201);

    expect(res.body).toBeDefined();
    expect(res.body.token).toBeDefined();

    const token = res.body.token;
    expect(token.id).toBeDefined();
    expect(token.address).toBe(payload.address);
    expect(token.chainId).toBe(payload.chainId);
    expect(token.symbol).toBe(payload.symbol);
    expect(token.name).toBe(payload.name);
    expect(token.decimals).toBe(payload.decimals);
    expect(token.isNative).toBe(payload.isNative);
    expect(token.isProtected).toBe(payload.isProtected);
    expect(token.lastUpdateAuthor).toBe(payload.lastUpdateAuthor);
    expect(token.priority).toBe(payload.priority);
  }, 60_000);
});
