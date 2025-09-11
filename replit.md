# Mason Martin Law - Legal Practice Management System

## Overview

Mason Martin Law is a comprehensive web application for a Hawaii-based law firm specializing in civil litigation, trial advocacy, appellate law, and military law. The system provides a professional website with client portal functionality, administrative dashboard for case management, and AI-powered legal assistance. The application features a modern React frontend with a robust Express.js backend, designed to streamline legal practice operations including client management, consultation scheduling, case tracking, and billing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with custom design system featuring navy/gold color scheme

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Structure**: Monorepo structure with shared schema between client and server

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Comprehensive legal practice schema including:
  - Users (admin authentication)
  - Clients (client information and contacts)
  - Consultations (scheduling and tracking)
  - Cases (matter management)
  - Invoices (billing and payments)
  - Communications (client correspondence)
  - AI Chats (legal assistant conversations)
  - Client Tokens (secure portal access)

### Key Features
- **Public Website**: Professional law firm website with practice areas, attorney bio, and consultation booking
- **Admin Dashboard**: Complete practice management with client, case, consultation, and invoice management
- **Client Portal**: Secure client access to case information, consultations, and invoices via token-based authentication
- **AI Legal Assistant**: Grok-powered chatbot for legal guidance and consultation scheduling
- **Radio Show Integration**: Information about the attorney's weekly radio program
- **Responsive Design**: Mobile-first approach with professional legal industry aesthetics

### Authentication & Security
- **Admin Authentication**: JWT tokens with role-based access control
- **Client Portal Access**: Secure token-based system for client-specific data access
- **Password Security**: Bcrypt hashing for admin credentials
- **API Security**: Protected routes with middleware authentication

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **AI Services**: xAI Grok API for legal assistant functionality
- **Email Services**: SendGrid for automated communications
- **UI Components**: Radix UI primitives for accessible component foundation

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Database Management**: Drizzle Kit for schema migrations and database operations
- **Code Quality**: TypeScript for type safety across the entire stack
- **CSS Framework**: Tailwind CSS for utility-first styling approach

### Third-Party Integrations
- **Font Services**: Google Fonts (Inter, Playfair Display) for professional typography
- **Development Environment**: Replit-specific plugins for cartographer and runtime error handling
- **Image Assets**: Unsplash integration for stock photography