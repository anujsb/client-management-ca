import { pgTable, text, timestamp, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for strict typing in the database
export const requestStatusEnum = pgEnum("request_status", [
    "pending",      // CA sent the request, waiting on client
    "followed_up",  // AI followed up because of no response
    "incorrect",    // Client sent something wrong, AI asked again
    "completed"     // Client sent the right document
]);

// 1. Users Table (The CAs)
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(), // We will hash passwords before saving
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Clients Table
export const clients = pgTable("clients", {
    id: uuid("id").primaryKey().defaultRandom(),
    caId: uuid("ca_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    gstin: varchar("gstin", { length: 15 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(), // Important for WhatsApp/Twilio
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Requests Table (The Chasing Jobs)
export const requests = pgTable("requests", {
    id: uuid("id").primaryKey().defaultRandom(),
    caId: uuid("ca_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
    documentType: varchar("document_type", { length: 50 }).notNull(),
    status: requestStatusEnum("status").default("pending").notNull(),
    aiContext: text("ai_context"),
    documentUrl: text("document_url"), // <-- NEW FIELD ADDED
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Templates Table
export const templates = pgTable("templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    caId: uuid("ca_id").references(() => users.id, { onDelete: "cascade" }), // Nullable. If null, it's a global system template.
    name: varchar("name", { length: 100 }).notNull(), // e.g., "GSTR-1 Request"
    content: text("content").notNull(), // The actual message body
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relations (Helps Drizzle query connected data easily) ---

export const usersRelations = relations(users, ({ many }) => ({
    clients: many(clients),
    requests: many(requests),
    templates: many(templates),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
    ca: one(users, {
        fields: [clients.caId],
        references: [users.id],
    }),
    requests: many(requests),
}));

export const requestsRelations = relations(requests, ({ one }) => ({
    ca: one(users, {
        fields: [requests.caId],
        references: [users.id],
    }),
    client: one(clients, {
        fields: [requests.clientId],
        references: [clients.id],
    }),
}));


// Add Templates Relations
export const templatesRelations = relations(templates, ({ one }) => ({
    ca: one(users, {
        fields: [templates.caId],
        references: [users.id],
    }),
}));

