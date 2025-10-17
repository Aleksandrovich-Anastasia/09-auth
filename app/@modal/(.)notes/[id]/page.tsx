import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { fetchNoteById } from '@/lib/api';
import NoteModalClient from '../[id]/NotePreview.client';

interface NoteModalProps {
  params: Promise<{ id: string }>;
}

export default async function NoteModal({ params }: NoteModalProps) {
  // Await the params as it's now a Promise
  const { id } = await params;
  
  // Get query client instance
  const queryClient = getQueryClient();
  
  // Prefetch the note data on the server
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  
  // Dehydrate the state for client hydration
  const dehydratedState = dehydrate(queryClient);
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteModalClient id={id} />
    </HydrationBoundary>
  );
}