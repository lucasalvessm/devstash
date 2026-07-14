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
];

export const itemTypeCounts: Record<string, number> = {
  "type-snippet": 24,
  "type-prompt": 18,
  "type-command": 15,
  "type-note": 12,
  "type-file": 5,
  "type-image": 3,
  "type-link": 8,
};
