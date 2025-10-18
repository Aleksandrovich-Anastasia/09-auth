import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { fetchNotes } from '@/lib/api';
import type { Metadata } from 'next';

import NotesClient from './Notes.client';
import SidebarNotes from '../@sidebar/SidebarNotes';
import css from './NotesPage.module.css';

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const filter = resolvedParams.slug?.[0] || 'All';
  const isAll = filter === 'All';
  const prettyFilter = filter.charAt(0).toUpperCase() + filter.slice(1);

  const title = isAll
    ? 'All Notes – NoteHub'
    : `Notes filtered by ${prettyFilter} – NoteHub`;

  const description = isAll
    ? 'Browse all notes in NoteHub.'
    : `Browse notes filtered by ${prettyFilter} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: isAll
        ? 'https://08-zustand-kappa-one.vercel.app/notes/filter/All'
        : `https://08-zustand-kappa-one.vercel.app/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Notes Filter',
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] !== 'All' ? resolvedParams.slug?.[0] : undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag }],
    queryFn: () => fetchNotes({ tag }),
  });

  return (
    <div className={css.pageContainer}>
      <aside className={css.sidebar}>
        <SidebarNotes />
      </aside>
      <main className={css.mainContent}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesClient tag={tag} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
