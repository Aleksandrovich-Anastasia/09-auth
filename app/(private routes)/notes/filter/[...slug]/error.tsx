'use client';

import React from 'react';

interface NotesErrorProps {
  error: Error;
}

export default function NotesError({ error }: NotesErrorProps) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Could not fetch the list of notes.</h1>
      <p>{error.message}</p>
    </div>
  );
}
