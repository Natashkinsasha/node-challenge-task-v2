import {InjectDrizzle} from "@knaadh/nestjs-drizzle-postgres";
import {Injectable} from "@nestjs/common";
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tables from "../table";


@Injectable()
export class TokenPriceTickDao{

    constructor(
        @InjectDrizzle('DB') private readonly db: PostgresJsDatabase<typeof tables>
    ) {}

    public async upsert(
        data: typeof tables.tokenPriceTickTable.$inferInsert
    ): Promise<typeof tables.tokenPriceTickTable.$inferSelect> {
        const [row] = await this.db
            .insert(tables.tokenPriceTickTable)
            .values(data)
            .onConflictDoUpdate({
                target: [
                    tables.tokenPriceTickTable.tokenId,
                    tables.tokenPriceTickTable.updatedAt,
                    tables.tokenPriceTickTable.source,
                ],
                set: {
                    price: data.price,
                },
            })
            .returning();

        return row;
    }
}