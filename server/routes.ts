import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertConsultationSchema, insertCaseSchema, insertInvoiceSchema, insertDocumentSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { grokLegalAssistant } from "./grok";
import { randomBytes } from "crypto";
import { sendConsultationConfirmation, sendClientPortalAccess } from "./email";
import { uploadSingle, handleMulterError } from "./multer-config";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";

// Validate JWT secret is properly configured
const validateJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set!");
    console.error("Please set a secure JWT_SECRET in your environment variables before starting the application.");
    console.error("Example: JWT_SECRET=your-very-secure-random-secret-key-here");
    throw new Error("JWT_SECRET environment variable is required for secure authentication");
  }
  
  if (secret.length < 32) {
    console.error("SECURITY WARNING: JWT_SECRET is too short. Please use a secret with at least 32 characters.");
    console.error("Current length:", secret.length);
    throw new Error("JWT_SECRET must be at least 32 characters long for security");
  }
  
  return secret;
};

const JWT_SECRET = validateJWTSecret();

// Setup automatic token cleanup (every hour) - runs once when module loads
setInterval(async () => {
  try {
    await storage.deleteExpiredTokens();
    console.log("Automatic token cleanup completed");
  } catch (error) {
    console.error("Automatic token cleanup failed:", error);
  }
}, 60 * 60 * 1000); // 1 hour

// JWT User Payload Interface
interface JWTUser {
  userId: string;
  email: string;
  role: string;
}

// Express Request type augmentation
declare global {
  namespace Express {
    interface Request {
      user?: JWTUser;
    }
  }
}

// Middleware for authentication
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded as JWTUser;
    next();
  });
};

// Middleware for admin role authorization
const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
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
          consultationData.caseType || undefined
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

  // Search endpoints
  app.get("/api/search/clients", authenticateToken, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchClients(q);
      await storage.logAction(req.user!.userId, "search", "clients", "", { query: q, resultCount: results.length });
      res.json(results);
    } catch (error) {
      console.error("Search clients error:", error);
      res.status(500).json({ message: "Failed to search clients" });
    }
  });

  app.get("/api/search/cases", authenticateToken, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchCases(q);
      await storage.logAction(req.user!.userId, "search", "cases", "", { query: q, resultCount: results.length });
      res.json(results);
    } catch (error) {
      console.error("Search cases error:", error);
      res.status(500).json({ message: "Failed to search cases" });
    }
  });

  app.get("/api/search/consultations", authenticateToken, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchConsultations(q);
      await storage.logAction(req.user!.userId, "search", "consultations", "", { query: q, resultCount: results.length });
      res.json(results);
    } catch (error) {
      console.error("Search consultations error:", error);
      res.status(500).json({ message: "Failed to search consultations" });
    }
  });

  // Document management routes
  app.get("/api/documents", authenticateToken, requireAdminRole, async (req, res) => {
    try {
      const { clientId, caseId, category, q } = req.query;
      
      const filter: { clientId?: string; caseId?: string; category?: string; q?: string } = {};
      if (clientId && typeof clientId === 'string') filter.clientId = clientId;
      if (caseId && typeof caseId === 'string') filter.caseId = caseId;
      if (category && typeof category === 'string') filter.category = category;
      if (q && typeof q === 'string') filter.q = q;
      
      const documents = await storage.listDocuments(filter);
      
      await storage.logAction(req.user!.userId, "list", "documents", null, { filter, resultCount: documents.length }, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json(documents);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", authenticateToken, requireAdminRole, async (req, res) => {
    try {
      const document = await storage.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      await storage.logAction(req.user!.userId, "view", "document", req.params.id, {}, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json(document);
    } catch (error) {
      console.error("Get document error:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.post("/api/documents/upload", authenticateToken, requireAdminRole, (req, res) => {
    uploadSingle(req, res, async (uploadErr) => {
      try {
        if (uploadErr) {
          const errorInfo = handleMulterError(uploadErr);
          return res.status(errorInfo.status).json({ message: errorInfo.message });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Validate required fields
        const { clientId, caseId, category, description } = req.body;
        if (!category) {
          // Clean up uploaded file
          if (existsSync(req.file.path)) {
            unlinkSync(req.file.path);
          }
          return res.status(400).json({ message: "Category is required" });
        }

        // Create document metadata
        const documentData = {
          id: req.body.documentId, // Set by multer config
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          clientId: clientId || null,
          caseId: caseId || null,
          category,
          description: description || null,
          uploadedBy: req.user!.userId
        };

        // Validate with Zod schema
        const validatedData = insertDocumentSchema.parse(documentData);
        
        // Save document metadata to database
        const document = await storage.createDocument(validatedData);
        
        // Log successful upload
        await storage.logAction(req.user!.userId, "upload", "document", document.id, {
          filename: document.filename,
          originalName: document.originalName,
          size: document.size,
          mimeType: document.mimeType,
          category: document.category
        }, {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        res.status(201).json(document);
      } catch (error) {
        console.error("Upload document error:", error);
        
        // Clean up uploaded file on error
        if (req.file && existsSync(req.file.path)) {
          try {
            unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error("Failed to clean up uploaded file:", cleanupError);
          }
        }
        
        res.status(500).json({ message: "Failed to upload document" });
      }
    });
  });

  app.get("/api/documents/:id/download", authenticateToken, requireAdminRole, async (req, res) => {
    try {
      const document = await storage.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Construct file path
      const clientId = document.clientId || '_uncategorized';
      const caseId = document.caseId || '_general';
      const filePath = join('uploads', clientId, caseId, document.filename);
      
      // Check if file exists
      if (!existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return res.status(404).json({ message: "File not found on disk" });
      }
      
      // Set security headers for download
      res.setHeader('Content-Type', document.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      // Log download
      await storage.logAction(req.user!.userId, "download", "document", req.params.id, {
        filename: document.filename,
        originalName: document.originalName
      }, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      // Send file
      res.sendFile(join(process.cwd(), filePath));
    } catch (error) {
      console.error("Download document error:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  app.delete("/api/documents/:id", authenticateToken, requireAdminRole, async (req, res) => {
    try {
      const document = await storage.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Construct file path
      const clientId = document.clientId || '_uncategorized';
      const caseId = document.caseId || '_general';
      const filePath = join('uploads', clientId, caseId, document.filename);
      
      // Delete from database first
      await storage.deleteDocument(req.params.id);
      
      // Clean up file from disk
      if (existsSync(filePath)) {
        try {
          unlinkSync(filePath);
        } catch (fileError) {
          console.error("Failed to delete file from disk:", fileError);
          // Log but don't fail the request since database deletion succeeded
        }
      }
      
      // Log deletion
      await storage.logAction(req.user!.userId, "delete", "document", req.params.id, {
        filename: document.filename,
        originalName: document.originalName
      }, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Delete document error:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Profile routes
  app.get("/api/auth/user", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        role: user.role,
        profilePhoto: user.profilePhoto 
      });
    } catch (error) {
      console.error("Get user profile error:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.put("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
      const { profilePhoto } = req.body;
      const user = await storage.updateUser(req.user!.userId, { profilePhoto });
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        role: user.role,
        profilePhoto: user.profilePhoto 
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Token cleanup endpoint (for admin use)
  app.post("/api/admin/cleanup-tokens", authenticateToken, requireAdminRole, async (req, res) => {
    try {
      await storage.deleteExpiredTokens();
      await storage.logAction(req.user!.userId, "cleanup", "tokens", "", {});
      res.json({ message: "Expired tokens cleaned up successfully" });
    } catch (error) {
      console.error("Token cleanup error:", error);
      res.status(500).json({ message: "Failed to cleanup expired tokens" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
