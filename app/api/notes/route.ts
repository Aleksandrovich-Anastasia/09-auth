import { NextResponse } from 'next/server';

const BASE_URL = 'https://next-docs-9f0504b0a741.herokuapp.com/api/notes';

// GET /api/notes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  const res = await fetch(`${BASE_URL}?${query}`, { cache: 'no-store' });
  const data = await res.json();

  return NextResponse.json(data);
}

// POST /api/notes
export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
