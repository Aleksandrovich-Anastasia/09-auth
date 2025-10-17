import { NextResponse } from 'next/server';

const BASE_URL = 'https://next-docs-9f0504b0a741.herokuapp.com/api/notes';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data);
}
