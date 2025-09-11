import { pgTable, varchar, text, integer, numeric, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  role: varchar("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone"),
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth"),
  emergencyContact: jsonb("emergency_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id),
  type: varchar("type").notNull(),
  caseType: varchar("case_type"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  status: varchar("status").notNull().default("scheduled"),
  rate: numeric("rate", { precision: 10, scale: 2 }),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cases table
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  title: varchar("title").notNull(),
  caseType: varchar("case_type").notNull(),
  status: varchar("status").notNull().default("open"),
  description: text("description"),
  courtDetails: jsonb("court_details"),
  importantDates: jsonb("important_dates"),
  documents: jsonb("documents"),
  billableHours: numeric("billable_hours", { precision: 10, scale: 2 }).default("0"),
  totalFees: numeric("total_fees", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  caseId: varchar("case_id").references(() => cases.id),
  invoiceNumber: varchar("invoice_number").notNull().unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  lineItems: jsonb("line_items"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communications table
export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  caseId: varchar("case_id").references(() => cases.id),
  type: varchar("type").notNull(), // email, call, meeting, letter
  direction: varchar("direction").notNull(), // inbound, outbound
  subject: varchar("subject"),
  content: text("content").notNull(),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Chats table
export const aiChats = pgTable("ai_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().unique(),
  clientEmail: varchar("client_email"),
  messages: jsonb("messages").notNull().default([]),
  status: varchar("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client Tokens table
export const clientTokens = pgTable("client_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = typeof communications.$inferInsert;

export type AiChat = typeof aiChats.$inferSelect;
export type InsertAiChat = typeof aiChats.$inferInsert;

export type ClientToken = typeof clientTokens.$inferSelect;
export type InsertClientToken = typeof clientTokens.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertClientSchema = createInsertSchema(clients);
export const insertConsultationSchema = createInsertSchema(consultations);
export const insertCaseSchema = createInsertSchema(cases);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertCommunicationSchema = createInsertSchema(communications);
export const insertAiChatSchema = createInsertSchema(aiChats);
export const insertClientTokenSchema = createInsertSchema(clientTokens);