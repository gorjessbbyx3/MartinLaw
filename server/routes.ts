import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertConsultationSchema, insertCaseSchema, insertInvoiceSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { grokLegalAssistant } from "./grok";
import { randomBytes } from "crypto";
import { sendConsultationConfirmation, sendClientPortalAccess } from "./email";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        role: "admin"
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Client routes
  app.get("/api/clients", authenticateToken, async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Get clients error:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", authenticateToken, async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Get client error:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Create client error:", error);
      res.status(400).json({ message: "Invalid client data" });
    }
  });

  app.put("/api/clients/:id", authenticateToken, async (req, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, clientData);
      res.json(client);
    } catch (error) {
      console.error("Update client error:", error);
      res.status(400).json({ message: "Invalid client data" });
    }
  });

  // Consultation routes
  app.get("/api/consultations", authenticateToken, async (req, res) => {
    try {
      const consultations = await storage.getAllConsultations();
      res.json(consultations);
    } catch (error) {
      console.error("Get consultations error:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.post("/api/consultations", async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      
      // Find or create client
      let client;
      if (req.body.clientEmail) {
        client = await storage.getClientByEmail(req.body.clientEmail);
        if (!client) {
          client = await storage.createClient({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.clientEmail,
            phone: req.body.phone,
          });
        }
        consultationData.clientId = client.id;
      }
      
      const consultation = await storage.createConsultation(consultationData);
      
      // Send email confirmation
      try {
        const clientName = `${req.body.firstName} ${req.body.lastName}`;
        const scheduledDate = new Date(consultationData.scheduledAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
        
        await sendConsultationConfirmation(
          req.body.clientEmail,
          clientName,
          consultationData.type,
          scheduledDate,
          consultationData.caseType
        );
      } catch (emailError) {
        console.error("Failed to send consultation confirmation email:", emailError);
        // Don't fail the consultation creation if email fails
      }
      
      res.status(201).json(consultation);
    } catch (error) {
      console.error("Create consultation error:", error);
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.put("/api/consultations/:id", authenticateToken, async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.partial().parse(req.body);
      const consultation = await storage.updateConsultation(req.params.id, consultationData);
      res.json(consultation);
    } catch (error) {
      console.error("Update consultation error:", error);
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  // Case routes
  app.get("/api/cases", authenticateToken, async (req, res) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      console.error("Get cases error:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.post("/api/cases", authenticateToken, async (req, res) => {
    try {
      const caseData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase(caseData);
      res.status(201).json(newCase);
    } catch (error) {
      console.error("Create case error:", error);
      res.status(400).json({ message: "Invalid case data" });
    }
  });

  app.put("/api/cases/:id", authenticateToken, async (req, res) => {
    try {
      const caseData = insertCaseSchema.partial().parse(req.body);
      const updatedCase = await storage.updateCase(req.params.id, caseData);
      res.json(updatedCase);
    } catch (error) {
      console.error("Update case error:", error);
      res.status(400).json({ message: "Invalid case data" });
    }
  });

  // Invoice routes
  app.get("/api/invoices", authenticateToken, async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", authenticateToken, async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(400).json({ message: "Invalid invoice data" });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, sessionId, clientEmail } = req.body;
      
      // Get or create chat session
      let chat = await storage.getAiChat(sessionId);
      if (!chat) {
        chat = await storage.createAiChat({
          sessionId,
          clientEmail,
          messages: [],
          status: "active"
        });
      }

      // Add user message
      const messages = Array.isArray(chat.messages) ? chat.messages : [];
      messages.push({ role: "user", content: message, timestamp: new Date() });

      // Get AI response using Grok
      const aiResponse = await grokLegalAssistant(message, messages);
      messages.push({ role: "assistant", content: aiResponse, timestamp: new Date() });

      // Update chat session
      await storage.updateAiChat(sessionId, { messages });

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process AI chat" });
    }
  });

  // Client portal routes
  app.post("/api/client-portal/access", async (req, res) => {
    try {
      const { email } = req.body;
      
      const client = await storage.getClientByEmail(email);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // Generate access token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createClientToken(client.id, token, expiresAt);

      // Send access token via email
      try {
        const clientName = `${client.firstName} ${client.lastName}`;
        await sendClientPortalAccess(client.email, clientName, token, expiresAt);
        res.json({ message: "Access token sent to your email address" });
      } catch (emailError) {
        console.error("Failed to send client portal access email:", emailError);
        // SECURITY: Never return tokens in API responses, even if email fails
        // This prevents unauthorized access without email verification
        return res.status(500).json({ 
          message: "Unable to deliver access token. Please try again later or contact our office." 
        });
      }
    } catch (error) {
      console.error("Client portal access error:", error);
      res.status(500).json({ message: "Failed to generate access token" });
    }
  });

  app.get("/api/client-portal/:token", async (req, res) => {
    try {
      const clientToken = await storage.getClientToken(req.params.token);
      if (!clientToken || clientToken.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const client = await storage.getClient(clientToken.clientId!);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const cases = await storage.getCasesByClient(client.id);
      const consultations = await storage.getConsultationsByClient(client.id);
      const invoices = await storage.getInvoicesByClient(client.id);

      res.json({
        client: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone
        },
        cases,
        consultations,
        invoices
      });
    } catch (error) {
      console.error("Client portal data error:", error);
      res.status(500).json({ message: "Failed to fetch client data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
