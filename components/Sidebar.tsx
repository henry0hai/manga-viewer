// filepath: components/Sidebar.tsx
import React, { useState } from 'react';
import ChapterNav from './ChapterNav';
import Link from 'next/link'; // Import Link

interface SidebarProps {
  chapters?: number[];
  mangaList?: string[]; // Add mangaList
  isVisible: boolean;
  currentMangaName?: string; // To know which manga page we might be on
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, mangaList, isVisible, currentMangaName }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Determine which list to filter and display
  const hasChapters = chapters && chapters.length > 0;
  const hasMangaList = mangaList && mangaList.length > 0;

  // Filter based on context
  const filteredChapters = hasChapters ? chapters.filter((chapter) => chapter.toString().includes(searchTerm)) : [];

  const filteredMangaList = hasMangaList
    ? mangaList.filter((manga) => manga.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div
      style={{
        width: isVisible ? '250px' : '0',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'width 0.3s ease, padding 0.3s ease',
        backgroundColor: '#fafafa',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 900,
        boxShadow: isVisible ? '2px 0 5px rgba(0,0,0,0.2)' : 'none',
        padding: isVisible ? '1rem' : '0',
        boxSizing: 'border-box',
      }}
    >
      {/* Only show content if sidebar is visible */}
      {isVisible && (
        <>
          {/* Search Input - always show if sidebar is visible and there's something to search */}
          {(hasChapters || hasMangaList) && (
            <input
              type='text'
              placeholder={hasChapters ? 'Search chapters...' : 'Search manga...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                marginBottom: '1rem',
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          )}

          {/* Conditional Rendering: Chapters or Manga List */}
          {hasChapters ? (
            // Display ChapterNav if chapters exist for the current page
            <ChapterNav chapters={filteredChapters} isVisible={true} headerHeight={0} />
          ) : hasMangaList ? (
            // Display Manga List if on homepage (no chapters passed)
            <div>
              <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Manga Series:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filteredMangaList.map((manga) => (
                  <Link
                    key={manga}
                    href={`/manga/${manga}`}
                    passHref
                    style={{
                      padding: '5px 8px',
                      textDecoration: 'none',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      background: currentMangaName === manga ? '#e0e0e0' : '#fff', // Highlight current manga
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textTransform: 'capitalize',
                    }}
                  >
                    {manga.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Placeholder if neither chapters nor manga list is available
            <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>No content available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
