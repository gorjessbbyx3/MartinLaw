import {
  users,
  clients,
  consultations,
  cases,
  invoices,
  communications,
  aiChats,
  clientTokens,
  auditLogs,
  type User,
  type InsertUser,
  type Client,
  type InsertClient,
  type Consultation,
  type InsertConsultation,
  type Case,
  type InsertCase,
  type Invoice,
  type InsertInvoice,
  type Communication,
  type InsertCommunication,
  type AiChat,
  type InsertAiChat,
  type ClientToken,
  type InsertClientToken,
  type AuditLog,
  type InsertAuditLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, lt } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Client operations
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;

  // Consultation operations
  getConsultation(id: string): Promise<Consultation | undefined>;
  getConsultationsByClient(clientId: string): Promise<Consultation[]>;
  getAllConsultations(): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, consultation: Partial<InsertConsultation>): Promise<Consultation>;

  // Case operations
  getCase(id: string): Promise<Case | undefined>;
  getCasesByClient(clientId: string): Promise<Case[]>;
  getAllCases(): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: string, caseData: Partial<InsertCase>): Promise<Case>;

  // Invoice operations
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByClient(clientId: string): Promise<Invoice[]>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;

  // Communication operations
  getCommunicationsByClient(clientId: string): Promise<Communication[]>;
  getCommunicationsByCase(caseId: string): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;

  // AI Chat operations
  getAiChat(sessionId: string): Promise<AiChat | undefined>;
  createAiChat(chatData: InsertAiChat): Promise<AiChat>;
  updateAiChat(sessionId: string, chatData: Partial<InsertAiChat>): Promise<AiChat>;

  // Client token operations
  getClientToken(token: string): Promise<ClientToken | undefined>;
  createClientToken(clientId: string, token: string, expiresAt: Date): Promise<ClientToken>;
  deleteExpiredTokens(): Promise<void>;

  // Search operations
  searchClients(query: string): Promise<Client[]>;
  searchCases(query: string): Promise<Case[]>;
  searchConsultations(query: string): Promise<Consultation[]>;

  // Audit logging
  logAction(userId: string | null, action: string, resourceType: string, resourceId: string | null, details?: any, meta?: { ip?: string; userAgent?: string }): Promise<AuditLog>;
  getRecentAuditLogs(limit?: number): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string, limit?: number): Promise<AuditLog[]>;
  getAuditLogsByResource(resourceType: string, resourceId: string, limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Client operations
  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client;
  }

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(clientData).returning();
    return client;
  }

  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set({ ...clientData, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  // Consultation operations
  async getConsultation(id: string): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation;
  }

  async getConsultationsByClient(clientId: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.clientId, clientId))
      .orderBy(desc(consultations.scheduledAt));
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations).orderBy(desc(consultations.scheduledAt));
  }

  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db.insert(consultations).values(consultationData).returning();
    return consultation;
  }

  async updateConsultation(id: string, consultationData: Partial<InsertConsultation>): Promise<Consultation> {
    const [consultation] = await db
      .update(consultations)
      .set({ ...consultationData, updatedAt: new Date() })
      .where(eq(consultations.id, id))
      .returning();
    return consultation;
  }

  // Case operations
  async getCase(id: string): Promise<Case | undefined> {
    const [caseData] = await db.select().from(cases).where(eq(cases.id, id));
    return caseData;
  }

  async getCasesByClient(clientId: string): Promise<Case[]> {
    return await db
      .select()
      .from(cases)
      .where(eq(cases.clientId, clientId))
      .orderBy(desc(cases.createdAt));
  }

  async getAllCases(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    return newCase;
  }

  async updateCase(id: string, caseData: Partial<InsertCase>): Promise<Case> {
    const [updatedCase] = await db
      .update(cases)
      .set({ ...caseData, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  // Invoice operations
  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId))
      .orderBy(desc(invoices.createdAt));
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(invoiceData).returning();
    return invoice;
  }

  async updateInvoice(id: string, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set({ ...invoiceData, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  // Communication operations
  async getCommunicationsByClient(clientId: string): Promise<Communication[]> {
    return await db
      .select()
      .from(communications)
      .where(eq(communications.clientId, clientId))
      .orderBy(desc(communications.createdAt));
  }

  async getCommunicationsByCase(caseId: string): Promise<Communication[]> {
    return await db
      .select()
      .from(communications)
      .where(eq(communications.caseId, caseId))
      .orderBy(desc(communications.createdAt));
  }

  async createCommunication(communicationData: InsertCommunication): Promise<Communication> {
    const [communication] = await db.insert(communications).values(communicationData).returning();
    return communication;
  }

  // Client token operations
  async getClientToken(token: string): Promise<ClientToken | undefined> {
    const [clientToken] = await db.select().from(clientTokens).where(eq(clientTokens.token, token));
    return clientToken;
  }

  async createClientToken(clientId: string, token: string, expiresAt: Date): Promise<ClientToken> {
    const [clientToken] = await db
      .insert(clientTokens)
      .values({ clientId, token, expiresAt })
      .returning();
    return clientToken;
  }

  async deleteExpiredTokens(): Promise<void> {
    await db.delete(clientTokens).where(lt(clientTokens.expiresAt, new Date()));
  }

  // AI Chat operations
  async getAiChat(sessionId: string): Promise<AiChat | undefined> {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.sessionId, sessionId));
    return chat;
  }

  async createAiChat(chatData: InsertAiChat): Promise<AiChat> {
    const [chat] = await db.insert(aiChats).values(chatData).returning();
    return chat;
  }

  async updateAiChat(sessionId: string, chatData: Partial<InsertAiChat>): Promise<AiChat> {
    const [chat] = await db
      .update(aiChats)
      .set({ ...chatData, updatedAt: new Date() })
      .where(eq(aiChats.sessionId, sessionId))
      .returning();
    return chat;
  }

  // Search operations
  async searchClients(query: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(or(
        ilike(clients.firstName, `%${query}%`),
        ilike(clients.lastName, `%${query}%`),
        ilike(clients.email, `%${query}%`)
      ))
      .orderBy(desc(clients.updatedAt));
  }

  async searchCases(query: string): Promise<Case[]> {
    return await db
      .select()
      .from(cases)
      .where(or(
        ilike(cases.title, `%${query}%`),
        ilike(cases.caseType, `%${query}%`),
        ilike(cases.description, `%${query}%`)
      ))
      .orderBy(desc(cases.updatedAt));
  }

  async searchConsultations(query: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(or(
        ilike(consultations.type, `%${query}%`),
        ilike(consultations.caseType, `%${query}%`),
        ilike(consultations.description, `%${query}%`)
      ))
      .orderBy(desc(consultations.updatedAt));
  }

  // Audit logging
  private sanitizeAuditDetails(details: any): any {
    if (!details || typeof details !== 'object') {
      return details;
    }

    const sensitiveFields = [
      'password', 'token', 'authorization', 'cookie', 'ssn', 'creditCard', 
      'cvv', 'secret', 'apiKey', 'authToken', 'accessToken', 'refreshToken'
    ];

    const sanitized = { ...details };

    const redactSensitive = (obj: any, path = ''): any => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map((item, index) => redactSensitive(item, `${path}[${index}]`));
      }

      const result = { ...obj };
      for (const [key, value] of Object.entries(result)) {
        const lowercaseKey = key.toLowerCase();
        const shouldRedact = sensitiveFields.some(field => lowercaseKey.includes(field));
        
        if (shouldRedact) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = redactSensitive(value, `${path}.${key}`);
        }
      }
      
      return result;
    };

    return redactSensitive(sanitized);
  }

  async logAction(
    userId: string | null, 
    action: string, 
    resourceType: string, 
    resourceId: string | null, 
    details?: any,
    meta?: { ip?: string; userAgent?: string }
  ): Promise<AuditLog> {
    const sanitizedDetails = this.sanitizeAuditDetails(details);
    
    const auditData: InsertAuditLog = {
      userId,
      action,
      resourceType,
      resourceId,
      status: 'success',
      ip: meta?.ip || null,
      userAgent: meta?.userAgent || null,
      details: sanitizedDetails || {}
    };

    const [auditLog] = await db.insert(auditLogs).values(auditData).returning();
    return auditLog;
  }

  async getRecentAuditLogs(limit = 50): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  async getAuditLogsByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  async getAuditLogsByResource(resourceType: string, resourceId: string, limit = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(and(
        eq(auditLogs.resourceType, resourceType),
        eq(auditLogs.resourceId, resourceId)
      ))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();