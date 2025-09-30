import {Injectable} from "@nestjs/common";
import {InjectDrizzle} from "@knaadh/nestjs-drizzle-postgres";
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tables from "../table";


@Injectable()
export class TokenLogoDao{

    constructor(
        @InjectDrizzle('DB') private readonly db: PostgresJsDatabase<typeof tables>
    ) {}

    public async upsert(
        data: typeof tables.tokenLogoTable.$inferInsert
    ): Promise<typeof tables.tokenLogoTable.$inferSelect> {
        const [row] = await this.db
            .insert(tables.tokenLogoTable)
            .values(data)
            .onConflictDoUpdate({
                target: tables.tokenLogoTable.tokenId,
                set: {
                    bigRelativePath: data.bigRelativePath,
                    smallRelativePath: data.smallRelativePath,
                    thumbRelativePath: data.thumbRelativePath,
                },
            })
            .returning();
        return row;
    }
}