// Run with `npx tsx prisma/seed.ts` (or `npm run db:seed`). Plain `node` can't run this file:
// the tsconfig "@/*" alias only resolves through Next.js's bundler, and Prisma's generated
// client uses extension-less relative imports meant for a bundler too — tsx's resolver
// handles both. Also wired as `migrations.seed` in prisma.config.ts so `prisma migrate reset`
// runs it automatically.
import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

import { ContentType, Prisma, PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_USER_EMAIL = "demo@devstash.io";

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

type SeedItem = {
  title: string;
  description?: string;
  itemType: (typeof SYSTEM_ITEM_TYPES)[number]["name"];
  language?: string;
} & ({ contentType: "TEXT"; content: string } | { contentType: "URL"; url: string });

type SeedCollection = {
  name: string;
  description: string;
  items: SeedItem[];
};

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        title: "Custom React Hooks",
        description: "useDebounce and useLocalStorage",
        itemType: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        title: "React Component Patterns",
        description: "Context provider and compound component",
        itemType: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

// Context provider pattern
type ThemeContextValue = { theme: "light" | "dark"; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

// Compound component pattern
function Tabs({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
}
Tabs.Tab = function Tab({ children }: { children: ReactNode }) {
  return <button role="tab">{children}</button>;
};

export { Tabs };`,
      },
      {
        title: "React Utility Functions",
        description: "classNames helper and deep clone",
        itemType: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        description: "Structured prompt for thorough code review",
        itemType: "prompt",
        contentType: "TEXT",
        content: `Review the following code change for:
1. Correctness — logic errors, edge cases, off-by-one mistakes
2. Security — injection, auth checks, unsafe deserialization
3. Performance — unnecessary re-renders, N+1 queries, unbounded loops
4. Readability — naming, structure, comments only where non-obvious

For each issue found, cite the file and line, explain the concrete failure scenario, and suggest a fix. Do not flag stylistic nitpicks that a linter would already catch.

Code to review:
{{code}}`,
      },
      {
        title: "Documentation Generation Prompt",
        description: "Generate docs from source code",
        itemType: "prompt",
        contentType: "TEXT",
        content: `Generate documentation for the following module. Include:
- A one-paragraph overview of what it does and why it exists
- Public API reference (function signatures, params, return types, thrown errors)
- One realistic usage example
- Any non-obvious constraints or gotchas a caller needs to know

Keep it concise — skip anything already obvious from well-named identifiers.

Source:
{{code}}`,
      },
      {
        title: "Refactoring Assistance Prompt",
        description: "Guided refactor without behavior changes",
        itemType: "prompt",
        contentType: "TEXT",
        content: `Refactor the following code without changing its external behavior. Goals, in priority order:
1. Remove duplication
2. Improve naming and readability
3. Extract logic only where it's reused more than once — avoid premature abstraction

Explain each change in one line. Flag anywhere you're unsure the behavior is preserved instead of guessing.

Code:
{{code}}`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Docker Multi-Stage Build",
        description: "Production Dockerfile for a Next.js app",
        itemType: "snippet",
        contentType: "TEXT",
        language: "dockerfile",
        content: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy to Production",
        description: "Build, tag, and push a release image",
        itemType: "command",
        contentType: "TEXT",
        language: "bash",
        content: `docker build -t myapp:$(git rev-parse --short HEAD) .
docker tag myapp:$(git rev-parse --short HEAD) myregistry.io/myapp:latest
docker push myregistry.io/myapp:latest
kubectl rollout restart deployment/myapp`,
      },
      {
        title: "Docker: Building Multi-Stage Images",
        itemType: "link",
        contentType: "URL",
        url: "https://docs.docker.com/build/building/multi-stage/",
      },
      {
        title: "GitHub Actions Documentation",
        itemType: "link",
        contentType: "URL",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        title: "Git Operations Cheatsheet",
        itemType: "command",
        contentType: "TEXT",
        language: "bash",
        content: `git reset --soft HEAD~1        # undo last commit, keep changes staged
git stash push -u -m "wip"     # stash including untracked files
git log --oneline --graph -20  # compact commit history
git branch -d $(git branch --merged main | grep -v main)  # delete merged branches`,
      },
      {
        title: "Docker Commands Cheatsheet",
        itemType: "command",
        contentType: "TEXT",
        language: "bash",
        content: `docker ps -a                          # list all containers
docker exec -it <container> sh        # shell into a running container
docker logs -f --tail 100 <container> # tail logs
docker system prune -af --volumes     # reclaim disk space`,
      },
      {
        title: "Process Management",
        itemType: "command",
        contentType: "TEXT",
        language: "bash",
        content: `lsof -i :3000              # find what's using a port
kill -9 $(lsof -t -i:3000) # force-kill it
ps aux | grep node         # list node processes
top -o %CPU                # sort processes by CPU usage`,
      },
      {
        title: "Package Manager Utilities",
        itemType: "command",
        contentType: "TEXT",
        language: "bash",
        content: `npm outdated                    # list outdated dependencies
npm dedupe                      # flatten duplicate deps in node_modules
npx npm-check-updates -u        # bump package.json to latest versions
rm -rf node_modules package-lock.json && npm install  # clean reinstall`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Documentation",
        itemType: "link",
        contentType: "URL",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui Components",
        itemType: "link",
        contentType: "URL",
        url: "https://ui.shadcn.com/docs/components",
      },
      {
        title: "Material Design System",
        itemType: "link",
        contentType: "URL",
        url: "https://m3.material.io/",
      },
      {
        title: "Lucide Icon Library",
        itemType: "link",
        contentType: "URL",
        url: "https://lucide.dev/icons/",
      },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  const itemTypesByName: Record<string, { id: string }> = {};
  for (const type of SYSTEM_ITEM_TYPES) {
    const where: Prisma.ItemTypeWhereInput = { userId: null, name: type.name };
    const existing = await prisma.itemType.findFirst({ where });
    itemTypesByName[type.name] = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color, isSystem: true },
        })
      : await prisma.itemType.create({
          data: { name: type.name, icon: type.icon, color: type.color, isSystem: true },
        });
  }

  // Reset this user's collections/items so the script is safe to re-run — cascades
  // clean up ItemCollection/ItemTag rows too.
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.item.deleteMany({ where: { userId: user.id } });

  for (const collectionData of COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: {
        name: collectionData.name,
        description: collectionData.description,
        userId: user.id,
      },
    });

    for (const item of collectionData.items) {
      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          contentType: item.contentType === "TEXT" ? ContentType.TEXT : ContentType.URL,
          content: item.contentType === "TEXT" ? item.content : undefined,
          url: item.contentType === "URL" ? item.url : undefined,
          language: item.language,
          userId: user.id,
          itemTypeId: itemTypesByName[item.itemType].id,
          collections: { create: { collectionId: collection.id } },
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`  user: ${user.email}`);
  console.log(`  item types: ${SYSTEM_ITEM_TYPES.length}`);
  console.log(`  collections: ${COLLECTIONS.length}`);
  console.log(`  items: ${COLLECTIONS.reduce((sum, c) => sum + c.items.length, 0)}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
