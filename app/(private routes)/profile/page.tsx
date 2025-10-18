import type { Metadata } from "next";
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
        url: "/default-avatar.png", // можна замінити на реальну картинку
        width: 1200,
        height: 630,
        alt: "Profile Page",
      },
    ],
  },
};

export default function ProfilePage() {
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="#" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <img
            src="https://ac.goit.global/img/photo.jpg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: your_email@example.com</p>
        </div>
      </div>
    </main>
  );
}
