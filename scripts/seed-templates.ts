// scripts/seed-templates.ts
// Run once to seed global message templates.
// Usage: npx tsx scripts/seed-templates.ts

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { templates } from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const globalTemplates = [
    {
        name: "GSTR-1 Filing Documents",
        category: "gst" as const,
        body: `Dear {clientName},

Hope you are well. 

Your *GSTR-1 filing for {period}* is due soon. We require the following documents at the earliest:

1. Sales register / invoices (B2B and B2C)
2. Credit/Debit notes issued
3. Export invoices (if applicable)

Please share the documents on WhatsApp at your earliest convenience.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["sales_register", "credit_notes", "export_invoices"]),
    },
    {
        name: "GSTR-2B Reconciliation",
        category: "gst" as const,
        body: `Dear {clientName},

For *GSTR-2B reconciliation for {period}*, we need:

1. Purchase register / all purchase invoices
2. Import documents (Bill of Entry, if any)
3. RCM invoices (if applicable)

Kindly share at the earliest.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["purchase_register", "import_docs", "rcm_invoices"]),
    },
    {
        name: "GSTR-3B Filing",
        category: "gst" as const,
        body: `Dear {clientName},

For *GSTR-3B filing for {period}*, please share:

1. Summary of outward supplies (sales)
2. Summary of inward supplies (purchases) 
3. ITC details
4. Reverse charge details (if any)

Please send by {deadline}.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["sales_summary", "purchase_summary", "itc_details"]),
    },
    {
        name: "ITR Filing — Salaried",
        category: "income_tax" as const,
        body: `Dear {clientName},

For your *Income Tax Return (ITR) filing for FY {period}*, we need:

1. Form 16 from employer
2. Form 26AS / AIS / TIS (download from income tax portal)
3. Bank statements (all accounts) — April to March
4. Details of other income (interest, rent, dividends, etc.)
5. Investment proofs (80C, 80D, HRA, etc.)

Please share at the earliest to avoid last-minute rush.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["form_16", "form_26as", "bank_statements", "investment_proofs"]),
    },
    {
        name: "ITR Filing — Business",
        category: "income_tax" as const,
        body: `Dear {clientName},

For *Business ITR filing for FY {period}*, please share:

1. Profit & Loss statement
2. Balance Sheet
3. Bank statements (all accounts)
4. Form 26AS
5. TDS certificates received
6. Details of loans taken/repaid
7. Asset purchase/sale details

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["p_and_l", "balance_sheet", "bank_statements", "form_26as", "tds_certificates"]),
    },
    {
        name: "TDS Return (26Q/24Q)",
        category: "tds" as const,
        body: `Dear {clientName},

For *TDS Return filing for Q{quarter} FY {period}*, we need:

1. Details of all payments made to vendors/contractors (with PAN)
2. TDS challan details (BSR code, date, amount)
3. Salary details (for 24Q)

Please share at the earliest to file before due date.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["vendor_payment_details", "tds_challans"]),
    },
    {
        name: "Balance Sheet & Audit",
        category: "audit" as const,
        body: `Dear {clientName},

For preparation of *Financial Statements / Audit for FY {period}*, we require:

1. All bank statements (April to March)
2. Cash book / petty cash register
3. Sales & purchase ledgers
4. Outstanding debtors & creditors list
5. Loan account statements
6. Fixed asset details
7. Stock statement (as on 31st March)

Kindly compile and share at the earliest.

Regards,
{caName}
{firmName}`,
        requiredDocs: JSON.stringify(["bank_statements", "cash_book", "ledgers", "debtors_creditors", "loan_statements", "asset_details", "stock_statement"]),
    },
];

async function seed() {
    console.log("🌱 Seeding global templates...");

    for (const template of globalTemplates) {
        await db
            .insert(templates)
            .values({
                caId: null, // null = global, visible to all CAs
                ...template,
                isActive: true,
            })
            .onConflictDoNothing();

        console.log(`  ✓ ${template.name}`);
    }

    console.log(`\n✅ Seeded ${globalTemplates.length} templates.`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});