# 🌌 Noxly AI Workspace

**Noxly AI** is a cutting-edge, minimalist note-taking workspace designed for clarity and speed. Powered by Gemini AI, it transforms messy thoughts into structured, actionable insights.


## Dashboard Page
![Dashboard](./public/Dashboard.png)

## NotesEditor Page
![NoteEditor](./public/Notes.png)

## ✨ Core Features

-   **🧠 Intelligent Editor**: A sleek Markdown editor with AI-suggested titles and automatic state synchronization.
-   **🪄 Magic Toolbar**: Select any text to rewrite, simplify, or expand using Noxly's contextual AI.
-   **📈 Dynamic Insights**: Track your productivity with weekly activity charts and tag distribution.
-   **💬 AI Assistant**: A context-aware chat companion that understands your notes and helps you brainstorm.
-   **🔒 Secure & Private**: JWT-based authentication and encrypted password storage.
-   **🌐 Seamless Sharing**: Public share links with unique, customizable access.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Framer Motion](https://framer.com/motion)
-   **Database**: [PostgreSQL](https://postgresql.org) with [Prisma ORM](https://prisma.io)
-   **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **UI Components**: [Radix UI](https://radix-ui.com) + [Lucide Icons](https://lucide.dev)

## 🚀 Getting Started

### 1. Prerequisites

-   Node.js 18+ 
-   A PostgreSQL database instance
-   A Google AI API Key (Gemini)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/noxly"
GOOGLE_AI_API_KEY="your_api_key_here"
JWT_SECRET="your_jwt_secret"
```

### 3. Installation

```bash
# Install dependencies
npm install

# Initialize Database
npx prisma db push
npx prisma generate

# Start Development Server
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture Overview

Noxly AI follows a modern full-stack architecture:
-   **Frontend**: React components with server-side rendering where applicable. UI follows a "Brutalist-Minimal" aesthetic.
-   **API**: Next.js Route Handlers (Edge-ready) for authentication, note management, and AI processing.
-   **Storage**: PostgreSQL for structured data with Prisma as the type-safe interface.

---

Designed with ❤️ by SAHIL SINGH.
