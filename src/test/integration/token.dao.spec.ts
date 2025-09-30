import {Test, TestingModule} from "@nestjs/testing";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { TokenDao } from "../../@logic/token-ticker/infrastructure/dao/token.dao";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import {GenericContainer, StartedTestContainer} from "testcontainers";
import { randomUUID } from "crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";

describe("TokenDao (integration)", () => {
    let postgresContainer: StartedTestContainer;
    let module: TestingModule;
    let tokenDao: TokenDao;

    beforeAll(async () => {

        const testId = Math.random().toString(36).substring(7);
        const port = 5432;
        postgresContainer = await new GenericContainer('postgres:15-alpine')
            .withName(`postgres-test-${testId}`)
            .withEnvironment({
                POSTGRES_USER: 'testuser',
                POSTGRES_PASSWORD: 'testpassword',
                POSTGRES_DB: 'testdb',
            })
            .withExposedPorts(port)
            .start();

        const postgresHost = postgresContainer.getHost();
        // const mappedPostgresPort = postgresContainer.getMappedPort(port);

        module = await Test.createTestingModule({
            imports: [
                DrizzlePostgresModule.register({
                    tag: 'DB',
                    postgres: {
                        url: postgresHost,
                    },
                    config: { schema },
                })
            ],
            providers: [TokenDao],
        }).compile();
        const db = module.get('DB')
        await migrate(db, {
            migrationsFolder: "src/@logic/token-ticker/infrastructure/migration",
        });
        tokenDao = module.get(TokenDao);
    }, 60_000);

    afterAll(async () => {
        await module?.close();
        await postgresContainer?.stop();
    });

    it("should upsert token and fetch with relation (chain)", async () => {
        // Arrange: create a chain
        const chainId = randomUUID();
        // expect(chain.id).toBe(chainId);

        // Arrange: initial token insert
        const tokenId = randomUUID();
        const initial = await tokenDao.upsert({
            id: tokenId,
            address: "0x0000000000000000000000000000000000000000",
            chainId: chainId,
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
            isNative: true,
            isProtected: false,
            lastUpdateAuthor: "tester",
            priority: 1,
            timestamp: new Date(),
        });
        expect(initial.id).toBe(tokenId);

        // Act: upsert same (chainId, address) with changed fields to trigger ON CONFLICT DO UPDATE
        const updated = await tokenDao.upsert({
            id: tokenId, // provided but conflict is on (chainId, address)
            address: "0x0000000000000000000000000000000000000000",
            chainId: chainId,
            symbol: "WETH",
            name: "Wrapped Ether",
            decimals: 18,
            isNative: false,
            isProtected: true,
            priority: 2,
        });

        expect(updated.symbol).toBe("WETH");
        expect(updated.name).toBe("Wrapped Ether");
        expect(updated.isNative).toBe(false);
        expect(updated.isProtected).toBe(true);
        expect(updated.priority).toBe(2);

        // Assert: findById returns relation-loaded chain
        const found = await tokenDao.findById(tokenId);
        expect(found).toBeTruthy();
        expect(found!.id).toBe(tokenId);
        expect(found!.chain?.id).toBe(chainId);
        expect(found!.address).toBe("0x0000000000000000000000000000000000000000");
    });
});