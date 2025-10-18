"use client";

import NotePreview from "@/components/NotePreview/NotePreview";

interface PageProps {
  params: { id: string };
}

export default function NotePage({ params }: PageProps) {
  return <NotePreview noteId={params.id} />; 
}
