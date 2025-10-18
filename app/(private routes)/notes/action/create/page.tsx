import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note | Notes App",
  description: "Create a new note in your personal Notes App. Add title, content and choose a tag.",
  alternates: { canonical: "/notes/action/create" },
  openGraph: {
    title: "Create Note | Notes App",
    description: "Create a new note in your personal Notes App. Add title, content and choose a tag.",
    url: "/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create a new note",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm /> {/* клієнтський компонент з draft */}
      </div>
    </main>
  );
}
