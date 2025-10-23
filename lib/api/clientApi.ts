import { api } from "./api";
import type { Note } from "../../types/note";
import type { User } from "../../types/user";
import { useAuthStore } from "../store/authStore";

// --- Notes ---
export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  const { data, headers } = await api.get<Note[]>("/notes", { params });
  const totalPages = headers["x-total-pages"]
    ? Number(headers["x-total-pages"])
    : 1;
  return { notes: data, totalPages };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<{ note: Note }>(`/notes/${id}`);
  return data.note;
};

// --- Auth ---
export const register = async (
  email: string,
  password: string
): Promise<{ user: User }> => {
  const { data } = await api.post<{ user: User }>("/auth/register", {
    email,
    password,
  });

  const { setUser } = useAuthStore.getState();
  setUser(data.user);

  return data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: User }> => {
  const { data } = await api.post<{ user: User }>("/auth/login", {
    email,
    password,
  });

  const { setUser } = useAuthStore.getState();
  setUser(data.user);

  return data;
};

export const logout = async (): Promise<{ success: boolean }> => {
  const { data } = await api.post<{ success: boolean }>("/auth/logout");

  const { clearIsAuthenticated } = useAuthStore.getState();
  clearIsAuthenticated();

  return data;
};

export const checkSession = async (): Promise<{ user: User | null }> => {
  const { data } = await api.get<{ user: User | null }>("/auth/session");

  const { setUser, clearIsAuthenticated } = useAuthStore.getState();

  if (data.user) {
    setUser(data.user);
  } else {
    clearIsAuthenticated();
  }

  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

// Виправлена функція updateMe: можна оновлювати лише username
export const updateMe = async (
  payload: Partial<Pick<User, "username">>
): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
};
