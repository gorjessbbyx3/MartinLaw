import multer from "multer";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { join, extname } from "path";
import type { Request } from "express";

// File type allowlist with their MIME types
const ALLOWED_MIME_TYPES = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
  'text/csv': '.csv'
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

// File filter to validate MIME types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Dynamic destination based on client and case
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    try {
      const clientId = req.body.clientId || '_uncategorized';
      const caseId = req.body.caseId || '_general';
      
      // Sanitize IDs to prevent path traversal
      const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizedCaseId = caseId.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      const destination = join('uploads', sanitizedClientId, sanitizedCaseId);
      
      // Ensure directory exists
      if (!existsSync(destination)) {
        mkdirSync(destination, { recursive: true });
      }
      
      cb(null, destination);
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    try {
      // Generate unique document ID
      const documentId = randomUUID();
      const fileExtension = ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES] || extname(file.originalname);
      
      // Store document ID in request for later use
      req.body.documentId = documentId;
      
      cb(null, `${documentId}${fileExtension}`);
    } catch (error) {
      cb(error as Error, '');
    }
  }
});

// Export configured multer instance
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
}).single('file');

import multer from 'multer';

// Error handler for multer
export const handleMulterError = (error: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return { status: 400, message: 'File size exceeds 20MB limit' };
      case 'LIMIT_UNEXPECTED_FILE':
        return { status: 400, message: 'Unexpected file field' };
      default:
        return { status: 400, message: `Upload error: ${error.message}` };
    }
  }
  
  if (error.message.includes('File type')) {
    return { status: 400, message: error.message };
  }
  
  return { status: 500, message: 'Internal server error during file upload' };
};