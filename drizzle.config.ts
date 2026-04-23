import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load the local env file
dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle", // Where migration files will be stored
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});