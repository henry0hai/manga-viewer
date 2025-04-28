// filepath: components/Layout.tsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import useScrollDirection from '../hooks/useScrollDirection';
import { useSidebarContext } from '../context/SidebarContext'; // Import the context hook

// Define a type for potential page props
interface LayoutPageProps {
  chapters?: number[];
  mangaList?: string[]; // Add mangaList
  mangaName?: string; // Add mangaName to potentially set Header title
}

const Layout: React.FC<{ children: React.ReactNode; pageProps?: LayoutPageProps }> = ({ children, pageProps }) => {
  const { isOpen } = useSidebarContext();

  const scrollDirection = useScrollDirection();

  // Extract props for Sidebar and Header
  const chapters = pageProps?.chapters;
  const mangaList = pageProps?.mangaList;
  const currentMangaName = pageProps?.mangaName;
  const headerTitle = currentMangaName ? currentMangaName.replace(/-/g, ' ') : 'Manga Viewer';

  return (
    <div style={{ display: 'flex' }}>
      <SidebarToggle />
      <Sidebar isVisible={isOpen} chapters={chapters} mangaList={mangaList} currentMangaName={currentMangaName} />
      <div
        style={{
          flex: 1,
          marginLeft: isOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header isVisible={scrollDirection === 'up' || isOpen} title={headerTitle} />
        <main style={{ padding: '1rem' }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
