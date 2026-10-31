# Echo — AI Customer Support Chatbot

> Intelligent customer support powered by your knowledge base. Built by [Zolentix](https://zolentix.com).

Echo is a production-ready AI support chatbot that answers customer questions using your knowledge base articles. When it can't find an answer, it flags the question and offers to connect with a human agent.

## Quick Start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [localhost:3000](http://localhost:3000) to see the landing page with the chat widget. Open [localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin console.

**Demo credentials**: `admin@echo.zolentix.com` / `echo2024`

## Features

### Chat Widget
- Floating chat bubble that expands into a full chat panel
- Streaming-style AI responses with typing indicator
- Suggested follow-up questions after each response
- Source attribution — shows which KB article the answer came from
- Minimize/close/reopen support
- "Hand off to human" when the bot is unsure

### Knowledge Base
- Admin can create, edit, and delete articles
- Categories: general, getting-started, billing, integrations, security, troubleshooting, features, api
- Publish/draft toggle per article
- Full-text search across all articles
- Seeded with 18 realistic articles for a demo SaaS product

### Admin Console
- **Dashboard**: conversation count, active/resolved/handed-off stats, questions today, deflection rate, recent activity feed
- **Conversations**: searchable list, filter by status, view full transcripts, mark as resolved or hand off
- **Knowledge Base**: CRUD articles, category filter, search, publish/draft toggle
- JWT auth protecting all admin routes

### AI Responder
- Built-in mock responder (keyword matching + sentence extraction) — works without any API key
- Drop-in OpenAI-compatible endpoint support via environment variables
- Greeting/thanks/handoff intent detection
- Deflection tracking for unanswered questions

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| Icons | Lucide React |
| Fonts | Space Grotesk (headings) + Inter (body) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind + brand tokens
│   ├── api/
│   │   ├── chat/             # Public chat endpoint
│   │   └── admin/            # Protected admin API
│   │       ├── auth/         # Login / verify
│   │       ├── conversations/# List + detail + status update
│   │       ├── articles/     # CRUD knowledge base
│   │       └── analytics/    # Dashboard stats
│   ├── admin/
│   │   ├── layout.tsx        # Admin shell (sidebar + auth gate)
│   │   ├── page.tsx          # Dashboard
│   │   ├── conversations/    # Conversation manager
│   │   ├── knowledge/        # KB article manager
│   │   └── login/            # Login page
│   └── (widget)/embed/       # Standalone embed page
├── components/
│   ├── chat/ChatWidget.tsx   # The embeddable chat widget
│   └── ui/ZLogo.tsx          # Zolentix logo
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   ├── ai.ts                 # AI responder (mock + external)
│   ├── auth.ts               # Server-side JWT auth
│   └── admin-auth.ts         # Client-side auth helpers
└── types/index.ts            # Shared TypeScript types
```

## Connecting a Real AI

Set these environment variables to use an OpenAI-compatible endpoint:

```env
AI_PROVIDER_URL=https://api.openai.com/v1/chat/completions
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

The system prompt automatically includes your knowledge base articles as context.

## Embedding

Add this script tag to any website:

```html
<script src="https://echo.zolentix.com/widget.js"></script>
```

Or self-hosted:

```html
<script>window.ECHO_HOST = "https://your-domain.com";</script>
<script src="https://your-domain.com/widget.js"></script>
```

## Brand

- Base: `#0A0A0F` (near-black)
- Surface: `#13131C`
- Primary: `#6D4AFF` → `#8B5CF6` (electric violet gradient)
- Accent: `#22D3EE` (cyan)
- Text: `#EDEDF2` (off-white)
- Headings: Space Grotesk
- Body: Inter

---

**Zolentix** — Portfolio Project #2
