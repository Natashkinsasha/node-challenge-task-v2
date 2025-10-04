import * as request from 'supertest';

import { AppFixture } from './fixture/app.fixture';

describe.skip('Health E2E (GET /health)', () => {
  let app: AppFixture;

  beforeAll(async () => {
    app = await AppFixture.create();
  }, 60000);

  afterAll(async () => {
    await app?.close();
  }, 10000);

  it('should return ok and pg up', async () => {
    const server = app.getHttpServer();

    const res = await request(server).get('/health').expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.status).toBe('ok');
    const pgInfo = res.body.info?.pg || res.body.details?.pg;
    expect(pgInfo).toBeDefined();
    expect(pgInfo.status).toBe('up');
  });
});
