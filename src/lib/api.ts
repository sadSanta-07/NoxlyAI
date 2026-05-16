import { useAuthStore } from "@/store/authStore";

const BASE = "";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("API ERROR:", data);

    throw new Error(
      data?.error ||
      data?.message ||
      "Something went wrong"
    );
  }



  return data;
}

export type Note = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  actionItems: string[];
  suggestedTitle?: string;
  tags: string[];
  category?: string;
  isPublic: boolean;
  isArchived: boolean;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
};

export type AIResult = {
  summary: string;
  action_items: string[];
  suggested_title: string;
};

export const api = {
  // auth
  signup: (data: { name: string; email: string; password: string }) =>
    apiFetch<{ data: { token: string; user: { id: string; name: string; email: string } } }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ data: { token: string; user: { id: string; name: string; email: string } } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // notes
  getNotes: (params?: { search?: string; tag?: string; category?: string; archived?: boolean; public?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.tag) query.set("tag", params.tag);
    if (params?.category) query.set("category", params.category);
    if (params?.archived) query.set("archived", "true");
    if (params?.public) query.set("public", "true");
    return apiFetch<{ data: Note[] }>(`/api/notes?${query.toString()}`);
  },

  getNote: (id: string) =>
    apiFetch<{ data: Note }>(`/api/notes/${id}`),

  createNote: (data: { title: string; content: string; tags?: string[]; category?: string }) =>
    apiFetch<{ data: Note }>("/api/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateNote: (id: string, data: Partial<Note>) =>
    apiFetch<{ data: Note }>(`/api/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteNote: (id: string) =>
    apiFetch<{ data: { message: string } }>(`/api/notes/${id}`, {
      method: "DELETE",
    }),

  generateSummary: (id: string) =>
    apiFetch<{ data: AIResult }>(`/api/notes/${id}/generate-summary`, {
      method: "POST",
    }),

  // user
  updateUser: (data: { name: string }) =>
    apiFetch<{ data: { id: string; name: string; email: string } }>("/api/user", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // insights
  getInsights: () =>
    apiFetch<{
      data: {
        totalNotes: number;
        recentNotes: Pick<Note, "id" | "title" | "updatedAt" | "tags">[];
        mostUsedTags: { tag: string; count: number }[];
        aiUsageCount: number;
        weeklyActivity: { date: string; count: number }[];
      }
    }>("/api/insights"),

  // public share
  getSharedNote: (shareId: string) =>
    apiFetch<{ data: Note & { user: { name: string } } }>(`/api/shared/${shareId}`),
};