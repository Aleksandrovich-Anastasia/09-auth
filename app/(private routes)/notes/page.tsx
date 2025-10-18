'use client';

import { useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api/clientApi';
import type { FetchNotesResponse } from '@/lib/api/clientApi';

export default function NotesPage() {
  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', { page: 1, perPage: 10 }], 
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, { page: number; perPage: number }];
      return fetchNotes(params);
    },
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

  return <NoteList notes={data?.notes ?? []} />;
}
