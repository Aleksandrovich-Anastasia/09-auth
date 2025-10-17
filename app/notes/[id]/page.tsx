import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const note = await fetchNoteById(params.id);

    const title = `${note.title} – NoteHub`;
    const description = note.content
      ? note.content.slice(0, 120) + (note.content.length > 120 ? "..." : "")
      : "Note details in NoteHub";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://08-zustand-kappa-one.vercel.app/notes/${params.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub Note Details",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note Not Found – NoteHub",
      description: "The requested note could not be found in NoteHub.",
      openGraph: {
        title: "Note Not Found – NoteHub",
        description: "The requested note could not be found in NoteHub.",
        url: `https://08-zustand-kappa-one.vercel.app/notes/${params.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub Note Not Found",
          },
        ],
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
