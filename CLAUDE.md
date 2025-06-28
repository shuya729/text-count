# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI文字数調整くん (text-count) - An AI-powered text length adjustment application built with:
- **Frontend**: React 19 + Vite + TypeScript + TailwindCSS v4
- **Backend**: Firebase Cloud Functions with GenKit and Vertex AI (Gemini)
- **Architecture**: Monorepo using npm workspaces

## Development Commands

### Setup
```bash
# Install dependencies for all workspaces
npm install

# Install Firebase CLI globally if needed
npm install -g firebase-tools
```

### Development
```bash
# Start frontend dev server (port 5173)
npm run dev:web

# Start Firebase emulators (Functions: 5001, Firestore: 8080)
npm run dev:api

# Run both frontend and backend in parallel
npm run dev
```

### Testing
```bash
# Run all tests (frontend + backend)
npm test

# Run tests in specific workspace
npm run test:web  # Frontend tests (Vitest)
npm run test:api  # Backend tests (Jest)

# Run a single test file
npm run test:web -- path/to/test.test.tsx
npm run test:api -- path/to/test.test.ts
```

### Build & Deploy
```bash
# Build all workspaces
npm run build

# Deploy to Firebase (production)
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only hosting
```

### Code Quality
```bash
# Run ESLint on entire project
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## Architecture & Code Structure

### Workspace Structure
- `apps/api/` - Firebase Cloud Functions backend
  - `src/adjustText/` - AI text adjustment using GenKit & Vertex AI
  - `src/saveContact/` - Contact form with Firestore storage & LINE notifications
- `apps/web/` - React frontend application
  - `src/components/` - Reusable UI components using Radix UI
  - `src/screens/` - Page-level components
  - `src/hooks/` - Custom React hooks (e.g., useTextEdit for main functionality)
  - `src/service/` - API client functions
- `apps/types/` - Shared TypeScript types between frontend and backend

### Key Technical Patterns
1. **API Communication**: Frontend uses `@/service/api` module with typed requests/responses
2. **Form Handling**: React Hook Form + Zod for validation
3. **State Management**: Local state with custom hooks, URL params for persistence
4. **AI Integration**: GenKit flow with retry logic (max 5 iterations) to achieve target text length
5. **Error Handling**: Structured error responses with appropriate HTTP status codes
6. **Security**: Firebase App Check enabled in production

### Important Implementation Notes
- Firebase Functions require Node.js 22
- LINE Channel Access Token stored as Firebase secret (`firebase functions:secrets:set LINE_CHANNEL_ACCESS_TOKEN`)
- All API endpoints are CORS-enabled for the production domain
- Text adjustment supports 50-4000 character range
- Contact form data saved to Firestore `contacts` collection with timestamps