'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import css from './NoteDetails.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface NoteDetailsClientProps {
  id: string;
}

const NoteDetailsClient = ({ id }: NoteDetailsClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/notes/filter/All';

  const { data: note, isLoading, error } = useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id && id !== 'undefined',
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.push(from);
  };

  if (!id || id === 'undefined') return <p>Invalid note ID</p>;
  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NoteDetailsClient;
