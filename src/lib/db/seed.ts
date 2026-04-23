import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { hash } from 'bcryptjs';
import * as schema from './schema';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env.local");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    console.log("🌱 Starting database seeding...");

    try {
        // 1. Check if an admin already exists to prevent duplicates
        const existingUsers = await db.select().from(schema.users);

        if (existingUsers.length > 0) {
            console.log("⚠️ Database already contains users. Seeding aborted.");
            process.exit(0);
        }

        // 2. Hash the password
        console.log("🔐 Hashing password...");
        const hashedPassword = await hash("password123", 10);

        // 3. Insert the initial CA (Admin)
        console.log("👤 Creating initial CA user...");
        const [newUser] = await db.insert(schema.users).values({
            name: "Admin CA",
            email: "admin@ca.com",
            passwordHash: hashedPassword,
        }).returning();

        console.log(`✅ Success! Seeded user: ${newUser.email}`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();