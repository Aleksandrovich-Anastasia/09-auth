import { ReactNode } from 'react';
import css from './FilterLayout.module.css';

interface FilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode; 
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        {sidebar} {/* рендеримо проп */}
      </aside>
      <main className={css.main}>{children}</main>
    </div>
  );
}
