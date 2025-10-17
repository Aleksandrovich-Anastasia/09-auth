import { create } from "zustand";

export type Draft = {
  title: string;
  content: string;
  tag: string;
};

const STORAGE_KEY = "note-draft";

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

function readDraftFromStorage(): Draft {
  if (typeof window === "undefined") return initialDraft;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDraft;

    const parsed = JSON.parse(raw);
    if (parsed?.state?.draft && typeof parsed.state.draft === "object") {
      return {
        title: parsed.state.draft.title ?? initialDraft.title,
        content: parsed.state.draft.content ?? initialDraft.content,
        tag: parsed.state.draft.tag ?? initialDraft.tag,
      };
    }
    if (parsed?.draft && typeof parsed.draft === "object") {
      return {
        title: parsed.draft.title ?? initialDraft.title,
        content: parsed.draft.content ?? initialDraft.content,
        tag: parsed.draft.tag ?? initialDraft.tag,
      };
    }
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "title" in parsed &&
      "content" in parsed &&
      "tag" in parsed
    ) {
      return {
        title: parsed.title ?? initialDraft.title,
        content: parsed.content ?? initialDraft.content,
        tag: parsed.tag ?? initialDraft.tag,
      };
    }

    return initialDraft;
  } catch (e) {
    return initialDraft;
  }
}

interface NoteStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  draft: readDraftFromStorage(),

  setDraft: (note) => {
    set((state) => {
      const newDraft = { ...state.draft, ...note };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { draft: newDraft } }));
        } catch (e) {
        }
      }
      return { draft: newDraft };
    });
  },

  clearDraft: () => {
    set(() => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
        }
      }
      return { draft: initialDraft };
    });
  },
}));
