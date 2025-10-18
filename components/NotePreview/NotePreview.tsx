'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/api';
import type { Note } from '@/types/note';
import Loader from '@/components/Loader/Loader';

interface NotePreviewProps {
  noteId: string;
  onClose: () => void;
}

export default function NotePreview({ noteId, onClose }: NotePreviewProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchNoteById(noteId)
      .then(setNote)
      .finally(() => setLoading(false));
  }, [noteId]);

  return (
    <Modal onClose={onClose}>
      {loading && <Loader />}
      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
