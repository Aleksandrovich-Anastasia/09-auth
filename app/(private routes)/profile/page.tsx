import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import type { User } from "@/types/user";
import css from "./Profile.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page in NoteHub application",
  openGraph: {
    title: "Profile | NoteHub",
    description: "View and edit your profile information in NoteHub",
    url: "/profile",
    images: [
      {
        url: "/default-avatar.png",
        width: 1200,
        height: 630,
        alt: "Profile Page",
      },
    ],
  },
};

export default async function ProfilePage() {
  const user: User = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
