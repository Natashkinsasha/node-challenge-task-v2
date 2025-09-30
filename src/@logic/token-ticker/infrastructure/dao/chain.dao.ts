import {InjectDrizzle} from "@knaadh/nestjs-drizzle-postgres";
import {Injectable} from "@nestjs/common";
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { desc } from 'drizzle-orm';

import * as tables from "../table";

@Injectable()
export class ChainDao{

    constructor(
        @InjectDrizzle('DB') private readonly db: PostgresJsDatabase<typeof tables>
    ) {}

    public async upsert(
        data: typeof tables.chainTable.$inferInsert
    ): Promise<typeof tables.chainTable.$inferSelect> {
        const [row] = await this.db
            .insert(tables.chainTable)
            .values(data)
            .onConflictDoUpdate({
                target: tables.chainTable.debridgeId,
                set: {
                    name: data.name,
                    isEnabled: data.isEnabled,
                },
            })
            .returning();

        return row;
    }

    public async findPageSortedByCreatedAt(params: {
        limit: number;
        offset: number;
    }): Promise<typeof tables.chainTable.$inferSelect[]> {
        const { limit, offset } = params;
        return this.db
            .select()
            .from(tables.chainTable)
            .orderBy(desc(tables.chainTable.createdAt))
            .limit(limit)
            .offset(offset);
    }
}