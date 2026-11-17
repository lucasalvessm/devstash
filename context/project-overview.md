# DevStash — Project Overview

> One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.

---

## 1. Problem

Developers keep their essentials scattered across too many tools:

| Where it lives today | What's lost there |
|---|---|
| VS Code / Notion | Code snippets |
| Chat history | AI prompts |
| Random project folders | Context files |
| Browser bookmarks | Useful links |
| Scattered docs folders | Documentation |
| `.txt` files | Commands |
| GitHub Gists | Project templates |
| Bash history | Terminal commands |

The result: constant context-switching, lost knowledge, and inconsistent workflows.

**DevStash's answer:** one place to capture, tag, search, and reuse all of it — enhanced with AI.

---

## 2. Target Users

| Persona | Core need |
|---|---|
| **Everyday Developer** | Fast capture/retrieval of snippets, prompts, commands, links |
| **AI-first Developer** | A home for prompts, contexts, and system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect reusable patterns, boilerplates, API examples |

---

## 3. Core Features

### A. Items & Item Types

Every piece of saved knowledge is an **Item**. Items have a **type**, which controls their icon, color, and content shape.

**System types (fixed, cannot be edited/deleted by users):**

| Type | Content shape | Color | Icon (lucide-react) |
|---|---|---|---|
| Snippet | text | `#3b82f6` blue | `Code` |
| Prompt | text | `#8b5cf6` purple | `Sparkles` |
| Note | text | `#fde047` yellow | `StickyNote` |
| Command | text | `#f97316` orange | `Terminal` |
| Link | url | `#10b981` emerald | `Link` |
| File *(Pro)* | file | `#6b7280` gray | `File` |
| Image *(Pro)* | file | `#ec4899` pink | `Image` |

Users can eventually create **custom types** (Pro, later phase) — system types remain immutable.

Each type maps to one of three underlying **content kinds**: `text`, `url`, or `file`.

Items are designed to be created and opened quickly via a **drawer** UI, not a full page navigation.

### B. Collections

- A Collection groups items of **any type** (a "React Patterns" collection could hold snippets *and* notes).
- Items support a **many-to-many** relationship with collections — e.g. a React snippet can live in both "React Patterns" and "Interview Prep".
- Examples: `React Patterns`, `Context Files`, `Python Snippets`.

### C. Search

Full search across:
- Content
- Tags
- Titles
- Types

### D. Authentication

- Email/password
- GitHub OAuth
- Powered by **NextAuth v5**

### E. Utility Features

- Favorite items & collections
- Pin items to top
- "Recently used" list
- Import code from a file
- Markdown editor for text-based types
- File upload for file/image types
- Export data (multiple formats)
- Dark mode (default), light mode optional
- Add/remove an item across multiple collections
- View which collections an item belongs to

### F. AI Features (Pro only)

Powered by **OpenAI `gpt-5-nano`**:

- Auto-tag suggestions
- AI summaries
- "Explain this code"
- Prompt optimizer

---

## 4. Data Model

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ITEM : owns
    USER ||--o{ COLLECTION : owns
    USER ||--o{ ITEMTYPE : "creates (custom)"
    ITEM }o--o{ COLLECTION : "many-to-many via"
    ITEM ||--o{ ITEMCOLLECTION : "joined by"
    COLLECTION ||--o{ ITEMCOLLECTION : "joined by"
    ITEM }o--|| ITEMTYPE : "has a"
    ITEM }o--o{ TAG : "tagged with"

    USER {
        string id PK
        boolean isPro
        string stripeCustomerId
        string stripeSubscriptionId
    }
    ITEM {
        string id PK
        string title
        string contentType
        string content
        string fileUrl
        string fileName
        int fileSize
        string url
        string description
        boolean isFavorite
        boolean isPinned
        string language
        string userId FK
        string itemTypeId FK
        datetime createdAt
        datetime updatedAt
    }
    ITEMTYPE {
        string id PK
        string name
        string icon
        string color
        boolean isSystem
        string userId FK "null for system types"
    }
    COLLECTION {
        string id PK
        string name
        string description
        boolean isFavorite
        string defaultTypeId FK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    ITEMCOLLECTION {
        string itemId FK
        string collectionId FK
        datetime addedAt
    }
    TAG {
        string id PK
        string name
    }
```

### Prisma Schema

> The schema has moved past the draft stage — `prisma/schema.prisma` is now the source of truth (snake_case `@map`/`@@map` columns, `generator` using `prisma-client` with an output path, connection URL in `prisma.config.ts` rather than inline, an explicit `ItemTag` join model instead of an implicit `Tag[]` relation, plus `User.password`/`emailVerified` and NextAuth's `Account`/`Session`/`VerificationToken` models). Read that file directly instead of this doc for exact field names. Remember: **never use `db push`** — all schema changes go through migrations, run in dev, then promoted to prod.

**Open questions still unresolved (as of the schema in `prisma/schema.prisma`):**
- Should `Tag` be per-user or global (currently drafted as global/unique across all users — likely needs a `userId` scope)?
- Does `Item.contentType` duplicate info already implied by `ItemType`? Consider deriving it instead of storing both.
- File size limits and validation for free vs. Pro tiers.

---

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 / React 19 (SSR pages, dynamic components) |
| Backend | Next.js API routes (items, file uploads, AI calls) |
| Language | TypeScript |
| Database | Neon (PostgreSQL) |
| ORM | Prisma 7 (latest — verify docs before implementation) |
| Caching | Redis (maybe — evaluate need before adding) |
| File Storage | Cloudflare R2 *(planned — not yet integrated)* |
| Auth | NextAuth v5 (email/password + GitHub OAuth) |
| Email | Resend (verification + password reset emails) |
| AI | OpenAI `gpt-5-nano` *(planned — not yet integrated)* |
| Styling | Tailwind CSS v4 + shadcn/ui (+ `@base-ui/react` primitives) |

**Repo structure:** single codebase / monorepo-free — one Next.js app for frontend + API to minimize overhead.

> ⚠️ **Migration policy:** never run `prisma db push` or edit the DB schema directly. All changes go through Prisma Migrate — apply in dev first, then promote the same migration to prod.

---

## 6. Monetization

Freemium model:

### Free
- 50 items total
- 3 collections
- All system types **except** file/image
- Basic search
- No file/image uploads
- No AI features

### Pro — $8/mo or $72/yr
- Unlimited items
- Unlimited collections
- File & image uploads
- Custom types *(later phase)*
- AI auto-tagging
- AI code explanation
- AI prompt optimizer
- Data export (JSON/ZIP)
- Priority support

> **Dev-mode note:** build the Pro/free gating foundation now (`isPro`, Stripe fields, feature checks), but leave all features unlocked for all users during development.

---

## 7. UI / UX

### Visual Direction
- Modern, minimal, developer-focused
- Dark mode by default; light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- Inspiration: **Notion**, **Linear**, **Raycast**
- Syntax highlighting on all code blocks

### Layout

```mermaid
flowchart LR
    subgraph Sidebar["Sidebar (collapsible)"]
        A[Item Types<br/>Snippets, Prompts, Commands...]
        B[Recent Collections]
    end
    subgraph Main["Main Content"]
        C[Grid of Collection Cards<br/>color-coded by dominant item type]
        D[Items list within a collection<br/>border-colored by item type]
    end
    E[Item Drawer<br/>quick open/edit]

    Sidebar --> Main
    C --> D
    D -->|click item| E
```

- **Sidebar:** item type shortcuts + jump links, list of latest collections. Becomes a drawer on mobile.
- **Main:** grid of collection cards, background-tinted by the type that dominates each collection's contents.
- **Items:** displayed within their collection as color-bordered cards matching their type.
- **Item detail:** opens in a fast, lightweight drawer rather than a full page.

### Responsive
- Desktop-first, mobile-usable
- Sidebar collapses into a drawer on small screens

### Micro-interactions
- Smooth transitions
- Hover states on cards
- Toast notifications for actions (save, delete, favorite, etc.)
- Loading skeletons while data fetches

---

## 8. Open Questions / Follow-ups

- [ ] Scope `Tag` model per-user vs. global
- [ ] Finalize whether `contentType` lives on `Item` or is derived from `ItemType`
- [ ] Confirm Redis is actually needed before adding it to the stack
- [ ] Define custom type limits/rules for Pro (icon picker? color picker? validation?)
- [ ] Decide export formats precisely (JSON, ZIP — anything else, e.g. Markdown bundle?)
- [ ] Define R2 upload flow (direct client upload vs. proxied through API route) and per-tier file size caps
