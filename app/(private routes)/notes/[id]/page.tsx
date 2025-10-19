import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreview from '@/components/NotePreview/NotePreview';
import type { Metadata } from 'next';
import css from '../../notes/filter/[...slug]/NotesPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const noteId = resolvedParams.id;
  const note = await fetchNoteById(noteId);

  return {
    title: `Note: ${note.title} – NoteHub`,
    description: note.content.slice(0, 160),
    openGraph: {
      title: `Note: ${note.title} – NoteHub`,
      description: note.content.slice(0, 160),
      url: `https://08-zustand-kappa-one.vercel.app/notes/${noteId}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Note',
        },
      ],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <div className={css.mainContent}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreview noteId={noteId} />
      </HydrationBoundary>
    </div>
  );
}
