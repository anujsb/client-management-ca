import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env.local");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seedTemplates() {
    console.log("🌱 Starting template seeding...");


    const preBuiltTemplates = [
        {
            name: "New Client Onboarding (KYC & Registrations)",
            content: "Welcome! To establish your foundational tax profile and avoid filing delays, please share the following initial documents:\n1. PAN & Aadhaar Cards (ensure they are linked)\n2. Certificate of Incorporation / Partnership Deed\n3. GST Registration Certificate & TAN Letter\n\nPlease reply directly to this message with the files or photos."
        },
        {
            name: "Monthly GST & Bookkeeping",
            content: "To ensure we can close your {{month}} bookkeeping on time and avoid late GST filing fees, please share the following:\n1. Sales Register (B2B and B2C summaries)\n2. Purchase Register and Supplier Invoices\n3. Bank Statements\n\nPlease reply directly to this message with the files."
        },
        {
            name: "GST RCM (Reverse Charge) Identification",
            content: "We are finalizing your GST liability for {{month}}. To ensure compliance with Reverse Charge rules, please confirm if you have incurred expenses for:\n1. Legal or Advocate fees\n2. Goods Transport Agency (GTA) services\n3. Security services\n4. Renting of residential dwellings for business\n\nIf yes, please reply to this message with the related ledgers."
        },
        {
            name: "Missing Purchase Invoice (ITC Reconciliation)",
            content: "During our GSTR-2B reconciliation, we noticed missing invoices from your vendors. Without these, you cannot claim Input Tax Credit and may face cash losses. Please review the attached list and follow up with the respective vendors.\n\nPlease reply to this chat with any missing physical invoices."
        },
        {
            name: "Cash Book Verification",
            content: "During our ledger review, we noticed potential discrepancies in your daily cash balances. To prevent 'negative cash balance' errors during tax audits, please provide your updated Daily Cash Book and petty cash logs for {{month}}.\n\nPlease reply to this message with the updated sheets."
        },
        {
            name: "Income Tax: AIS/TIS Mismatch Clarification",
            content: "While preparing your tax return, we noticed a transaction in the Income Tax Department's Annual Information Statement (AIS) that does not match our records. The portal shows a transaction of [Amount] on [Date].\n\nPlease reply directly here with the supporting documents or an explanation."
        },
        {
            name: "Statutory Audit Preparation",
            content: "We are initiating your statutory audit. To proceed, please provide the following mandatory records:\n1. Signed Board Meeting Minutes\n2. Fixed Asset Register with depreciation workings\n3. Loan Sanction letters and outstanding balance certificates\n\nPlease reply to this message with the documents."
        },
        {
            name: "ITR Filing (Individuals/Investors)",
            content: "It is time to prepare your Income Tax Return. Please provide the following documents to ensure accurate calculation:\n1. Form 16 (Part A & B)\n2. Broker statements for Capital Gains\n3. Home loan interest certificates\n\nPlease reply directly to this message with the files."
        }
    ];
    try {
        for (const template of preBuiltTemplates) {
            await db.insert(schema.templates).values({
                name: template.name,
                content: template.content,
                // caId is undefined/null by default, making these global system templates
            });
        }
        console.log("✅ Successfully seeded system templates.");
    } catch (error) {
        console.error("❌ Error seeding templates:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seedTemplates();