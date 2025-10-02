import dotenv from 'dotenv'
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: './env/.env' })


export * as schema from "./src/@logic/token-ticker/infrastructure/table";

export default defineConfig({
    schema: './src/@logic/token-ticker/infrastructure/table/index.ts',
    out: "./src/@logic/token-ticker/infrastructure/migration",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});