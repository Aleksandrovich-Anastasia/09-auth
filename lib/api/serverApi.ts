import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";

export type SessionResult = {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
} | null;

// --- Формуємо заголовки для запиту ---
async function getHeaders(): Promise<{ headers: { Authorization?: string; Cookie?: string } }> {
  const cookieStore = await cookies();

  // Беремо токен доступу
  const accessToken = cookieStore.get("accessToken")?.value;

  // Додаємо всі cookies на випадок refreshToken/sessions
  const allCookies = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      Cookie: allCookies || undefined,
    },
  };
}

// --- Notes ---
export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await api.get<Note[]>("/notes", await getHeaders());
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, await getHeaders());
  return data;
};

// --- User ---
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me", await getHeaders());
  return data;
};

// --- Auth ---
export const checkSession = async (
  refreshToken?: string
): Promise<AxiosResponse<SessionResult>> => {
  let cookieString: string;

  if (refreshToken) {
    cookieString = `refreshToken=${refreshToken}`;
  } else {
    const cookieStore = await cookies();
    cookieString = cookieStore.getAll()
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join("; ");
  }

  const accessToken = (await cookies()).get("accessToken")?.value;

  const response = await api.get<SessionResult>("/auth/session", {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      Cookie: cookieString || undefined,
    },
  });

  return response;
};
