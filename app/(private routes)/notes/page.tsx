'use client';

import { useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';

export default function NotesPage() {
  const { data: notes = [], isLoading, isError, error } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (isError) {
    return (
      <p>
        Error loading notes: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    );
  }

  return <NoteList notes={notes} />;
}
