import type { Metadata } from "next";
import NotFoundClient from "./NotFound.client";

export const metadata: Metadata = {
  title: "Page Not Found – NoteHub",
  description: "The page you are looking for does not exist in NoteHub.",
  openGraph: {
    title: "Page Not Found – NoteHub",
    description: "The page you are looking for does not exist in NoteHub.",
    url: "https://08-zustand-kappa-one.vercel.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Not Found",
      },
    ],
  },
};

export default function NotFoundPage() {
  return <NotFoundClient />;
}
