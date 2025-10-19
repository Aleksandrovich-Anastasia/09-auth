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

async function getHeaders(): Promise<{ headers: { Cookie: string } }> {
  const cookieStore = cookies();
  const cookie = cookieStore.toString();
  return { headers: { Cookie: cookie } };
}

export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await api.get<Note[]>("/notes", await getHeaders());
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, await getHeaders());
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me", await getHeaders());
  return data;
};

export const checkSession = async (
  refreshToken?: string
): Promise<AxiosResponse<SessionResult>> => {
  const cookieStore = cookies();
  const cookie = refreshToken
    ? `refreshToken=${refreshToken}`
    : cookieStore.toString();

  const response = await api.get<SessionResult>("/auth/session", {
    headers: { Cookie: cookie },
  });

  return response; 
};
