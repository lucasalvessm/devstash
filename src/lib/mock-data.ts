// Single source of truth for mock dashboard data until a real database is wired up.

export type ContentType = "TEXT" | "URL" | "FILE";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string;
  isSystem: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  itemTypeIds: string[]; // types of items contained, for the summary icons on the card
}

export interface Item {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: false,
};

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "Snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type-prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type-note", name: "Note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type-command", name: "Command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type-link", name: "Link", icon: "Link", color: "#10b981", isSystem: true },
  { id: "type-file", name: "File", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type-image", name: "Image", icon: "Image", color: "#ec4899", isSystem: true },
];

export const collections: Collection[] = [
  {
    id: "col-react-patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    itemTypeIds: ["type-snippet", "type-note", "type-link"],
  },
  {
    id: "col-python-snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    itemTypeIds: ["type-snippet", "type-note"],
  },
  {
    id: "col-context-files",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    itemTypeIds: ["type-file", "type-note"],
  },
  {
    id: "col-interview-prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    itemTypeIds: ["type-note", "type-snippet", "type-link", "type-prompt"],
  },
  {
    id: "col-git-commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    itemTypeIds: ["type-command", "type-note"],
  },
  {
    id: "col-ai-prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    itemTypeIds: ["type-prompt", "type-snippet", "type-note"],
  },
];

export const items: Item[] = [
  {
    id: "item-use-auth-hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "TEXT",
    content: "export function useAuth() {\n  // ...\n}",
    url: null,
    itemTypeId: "type-snippet",
    collectionIds: ["col-react-patterns"],
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
  },
  {
    id: "item-api-error-handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "TEXT",
    content: "async function fetchWithRetry(url, options) {\n  // ...\n}",
    url: null,
    itemTypeId: "type-snippet",
    collectionIds: ["col-react-patterns", "col-interview-prep"],
    tags: ["fetch", "error-handling"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-01-12",
    updatedAt: "2026-01-12",
  },
  {
    id: "item-commit-message-prompt",
    title: "Git Commit Message Prompt",
    description: "Prompt for generating conventional commit messages from a diff",
    contentType: "TEXT",
    content: "Write a conventional commit message for the following diff:\n\n{{diff}}",
    url: null,
    itemTypeId: "type-prompt",
    collectionIds: ["col-ai-prompts"],
    tags: ["git", "prompt-engineering"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-18",
    updatedAt: "2026-01-18",
  },
  {
    id: "item-rebase-cheatsheet",
    title: "Rebase Interactive Cheatsheet",
    description: "Common interactive rebase commands and flags",
    contentType: "TEXT",
    content: "git rebase -i HEAD~5",
    url: null,
    itemTypeId: "type-command",
    collectionIds: ["col-git-commands"],
    tags: ["git", "rebase"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-17",
    updatedAt: "2026-01-17",
  },
  {
    id: "item-rsc-notes",
    title: "React Server Components Notes",
    description: "Key differences between server and client components",
    contentType: "TEXT",
    content: "Server components render on the server and ship no JS to the client...",
    url: null,
    itemTypeId: "type-note",
    collectionIds: ["col-react-patterns", "col-interview-prep"],
    tags: ["react", "rsc"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-16",
    updatedAt: "2026-01-16",
  },
  {
    id: "item-debounce-hook",
    title: "useDebounce Hook",
    description: "Debounce a fast-changing value with a configurable delay",
    contentType: "TEXT",
    content: "export function useDebounce(value, delay) {\n  // ...\n}",
    url: null,
    itemTypeId: "type-snippet",
    collectionIds: ["col-react-patterns"],
    tags: ["react", "hooks"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-14",
    updatedAt: "2026-01-14",
  },
  {
    id: "item-list-comprehension",
    title: "List Comprehension Tricks",
    description: "Nested and conditional list comprehension examples",
    contentType: "TEXT",
    content: "squares = [x * x for x in range(10) if x % 2 == 0]",
    url: null,
    itemTypeId: "type-snippet",
    collectionIds: ["col-python-snippets"],
    tags: ["python"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-13",
    updatedAt: "2026-01-13",
  },
  {
    id: "item-undo-last-commit",
    title: "Undo Last Commit",
    description: "Undo the last commit but keep the changes staged",
    contentType: "TEXT",
    content: "git reset --soft HEAD~1",
    url: null,
    itemTypeId: "type-command",
    collectionIds: ["col-git-commands"],
    tags: ["git"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-11",
    updatedAt: "2026-01-11",
  },
  {
    id: "item-code-reviewer-prompt",
    title: "System Prompt: Code Reviewer",
    description: "System prompt for an AI acting as a strict code reviewer",
    contentType: "TEXT",
    content: "You are a senior engineer reviewing a pull request...",
    url: null,
    itemTypeId: "type-prompt",
    collectionIds: ["col-ai-prompts"],
    tags: ["prompt-engineering", "code-review"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  },
  {
    id: "item-neon-connection-docs",
    title: "Neon Connection String Docs",
    description: "Reference link for configuring pooled vs direct Neon connections",
    contentType: "URL",
    content: null,
    url: "https://neon.tech/docs/connect/connection-pooling",
    itemTypeId: "type-link",
    collectionIds: ["col-context-files"],
    tags: ["neon", "postgres"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-09",
    updatedAt: "2026-01-09",
  },
  {
    id: "item-big-o-cheatsheet",
    title: "Big-O Cheat Sheet",
    description: "Time and space complexity for common data structures and algorithms",
    contentType: "TEXT",
    content: "Array access: O(1)\nHash map lookup: O(1) average...",
    url: null,
    itemTypeId: "type-note",
    collectionIds: ["col-interview-prep"],
    tags: ["algorithms", "interview"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08",
  },
  {
    id: "item-venv-setup",
    title: "Virtual Env Setup",
    description: "Create and activate a Python virtual environment",
    contentType: "TEXT",
    content: "python -m venv .venv\nsource .venv/bin/activate",
    url: null,
    itemTypeId: "type-command",
    collectionIds: ["col-python-snippets"],
    tags: ["python", "venv"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-07",
    updatedAt: "2026-01-07",
  },
];

export const itemTypesById: Record<string, ItemType> = Object.fromEntries(
  itemTypes.map((type) => [type.id, type]),
);

export const itemTypeCounts: Record<string, number> = {
  "type-snippet": 24,
  "type-prompt": 18,
  "type-command": 15,
  "type-note": 12,
  "type-file": 5,
  "type-image": 3,
  "type-link": 8,
};
