'use client';

interface ErrorProps {
  error: Error;
}

const NoteDetailsError = ({ error }: ErrorProps) => {
  return <p>Could not fetch note details. {error.message}</p>;
};

export default NoteDetailsError;
