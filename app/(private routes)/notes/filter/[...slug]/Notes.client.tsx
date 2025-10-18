"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import type { FetchNotesResponse } from "@/lib/api/clientApi";
import css from './NotesPage.module.css';

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

interface NotesListClientProps {
  tag?: string;
}

export default function NotesListClient({ tag }: NotesListClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, error } =
    useQuery<FetchNotesResponse, Error>({
      queryKey: ["notes", page, debouncedSearch, tag],
      queryFn: () =>
        fetchNotes({ page, perPage: 5, search: debouncedSearch, tag }),
    });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <SearchBox
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      <Link href="/notes/action/create" className={css['button']}>
  + Add note
      </Link>

      <NoteList notes={data?.notes ?? []} />

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
