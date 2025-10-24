'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import Loader from '@/components/Loader/Loader';

interface NotePreviewProps {
  noteId: string;
  onClose?: () => void;
}

export default function NotePreview({ noteId, onClose }: NotePreviewProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back(); 
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNoteById(noteId)
      .then(setNote)
      .finally(() => setLoading(false));
  }, [noteId]);

  return (
    <Modal onClose={handleClose}>
      {&& <Loader />}
      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
