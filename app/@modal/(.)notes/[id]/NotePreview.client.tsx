'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  
  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, 
  });

  const handleClose = () => {
    router.back();
  };


  if (isLoading) {
    return (
      <Modal onClose={handleClose} showCloseButton>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Loading...</span>
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal onClose={handleClose} showCloseButton>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">
            {error instanceof Error ? error.message : 'Failed to load note'}
          </p>
        </div>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose} showCloseButton>
        <div className="p-6 text-center">
          <p className="text-gray-700">Note not found</p>
        </div>
      </Modal>
    );
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal onClose={handleClose} showCloseButton>
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {note.title}
        </h2>
        
        {/* Tag */}
        {note.tag && (
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {note.tag}
            </span>
          </div>
        )}
        
        {/* Content */}
        <div className="prose max-w-none mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
        
        {/* Created Date */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Created:</span> {formattedDate}
          </p>
        </div>
      </div>
    </Modal>
  );
}