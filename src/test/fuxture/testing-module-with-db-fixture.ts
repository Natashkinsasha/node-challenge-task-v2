import {DrizzlePostgresModule} from "@knaadh/nestjs-drizzle-postgres";
import {Type} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {Memoize} from "typescript-memoize";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import {PostgresFixture} from "./postgres-fixture";


export class TestingModuleWithDbFixture{
    private postgresFixture?: PostgresFixture;
    private db?: PostgresJsDatabase;
    private module?: TestingModule;

    private constructor(private readonly providers: Array<Type<any>>) {
    }

    public getDb(){
        if(!this.db){
            throw new Error('DB is not initialized');
        }
        return this.db;
    }

    @Memoize()
    public static create(providers: Array<Type<any>>){
        return new TestingModuleWithDbFixture(providers)
    }

    @Memoize()
    public async start(){
        this.postgresFixture = PostgresFixture.create();

        const postgresUrl = await this.postgresFixture.getUrl();

        this.module = await Test.createTestingModule({
            imports: [
                DrizzlePostgresModule.register({
                    tag: 'DB',
                    postgres: {
                        url: postgresUrl,
                    },
                    config: { schema },
                })
            ],
            providers: this.providers,
        }).compile();
        this.db = this.module.get('DB');
    }

    public async stop(){
        await this.module?.close();
        await this.postgresFixture?.stop();
    }

    public get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Function | string | symbol): TResult{
        if(!this.module){
            throw new Error('Module is not initialized');
        }
        return this.module?.get(typeOrToken)
    }

    public async dropAllAndMigrate(){
        if(!this.db){
            throw new Error('DB is not initialized');
        }
        await this.postgresFixture?.dropAllAndMigrate(this.db)
    }
}