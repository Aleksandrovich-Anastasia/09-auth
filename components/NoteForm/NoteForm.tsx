'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { Note } from "@/types/note";
import css from "./NoteForm.module.css";

const TAGS: Note["tag"][] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [title, setTitle] = useState(draft.title || "");
  const [content, setContent] = useState(draft.content || "");
  const [tag, setTag] = useState<Note["tag"]>(() =>
    TAGS.includes(draft.tag as Note["tag"]) ? (draft.tag as Note["tag"]) : "Todo"
  );

  const [errors, setErrors] = useState<{ title?: string; content?: string; tag?: string }>({});

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required!";
    else if (title.length < 3) newErrors.title = "Title must be at least 3 characters";
    else if (title.length > 50) newErrors.title = "Title cannot exceed 50 characters";

    if (content.length > 500) newErrors.content = "Content cannot exceed 500 characters";

    if (!TAGS.includes(tag)) newErrors.tag = "Tag is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: (note: Partial<Note>) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft(); 
      router.push("/notes");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ title, content, tag });
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Note["tag"];
    if (TAGS.includes(value)) setTag(value);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" value={tag} onChange={handleTagChange} className={css.select}>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
