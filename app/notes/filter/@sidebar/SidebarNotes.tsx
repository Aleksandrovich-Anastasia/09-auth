'use client';

import Link from 'next/link';
import css from './SidebarNotes.module.css';

const TAGS = ['All', 'Work', 'Personal', 'Ideas', 'Archive'];

interface SidebarNotesProps {
  currentTag?: string;
}

const SidebarNotes = ({ currentTag }: SidebarNotesProps) => {
  return (
    <ul className={css.menuList}>
      {TAGS.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={tag === 'All' ? '/notes/filter/All' : `/notes/filter/${tag}`}
            className={css.menuLink + (currentTag === tag ? ` ${css.active}` : '')}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
