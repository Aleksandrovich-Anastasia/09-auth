import { cookies } from "next/headers";
import { api } from "./api";

function getHeaders() {
  const cookieStore = cookies();
  const cookie = cookieStore.toString(); 
  return { headers: { Cookie: cookie } };
}

// Notes
export const fetchNotes = async () => {
  const { data } = await api.get("/notes", getHeaders());
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await api.get(`/notes/${id}`, getHeaders());
  return data;
};

// Auth
export const getMe = async () => {
  const { data } = await api.get("/auth/me", getHeaders());
  return data;
};

export const checkSession = async () => {
  const { data } = await api.get("/auth/session", getHeaders());
  return data;
};
