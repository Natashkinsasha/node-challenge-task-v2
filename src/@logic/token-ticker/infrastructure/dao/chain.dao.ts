import {InjectDrizzle} from "@knaadh/nestjs-drizzle-postgres";
import {Injectable} from "@nestjs/common";
import {NodePgDatabase} from "drizzle-orm/node-postgres";

import * as tables from "../table";

@Injectable()
export class ChainDao{

    constructor(
        @InjectDrizzle('DB') private readonly db: NodePgDatabase<typeof tables>
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
}