import React, { useState } from 'react';

interface ChapterNavProps {
    chapters: number[];
    isVisible?: boolean; // Controls visibility of the nav
    headerHeight: number; // For positioning below the header
}

const ChapterNav: React.FC<ChapterNavProps> = ({ chapters, isVisible = true, headerHeight }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChapters = chapters.filter(chapter => 
        chapter.toString().includes(searchTerm)
    );

    if (!chapters || chapters.length === 0) {
        return null;
    }

    return (
        <nav style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            background: '#fafafa',
            position: 'sticky',
            top: `${headerHeight}px`,
            zIndex: 9,
            display: isVisible ? 'block' : 'none',
            transition: 'opacity 0.5s ease-in-out',
            opacity: isVisible ? 1 : 0,
        }}>
            <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    marginBottom: '10px',
                    padding: '5px',
                    width: '100%',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Chapters:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filteredChapters.map((chapter) => (
                    <a
                        key={chapter}
                        href={`#chapter-${chapter}`}
                        style={{
                            padding: '3px 8px',
                            textDecoration: 'none',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: '#fff',
                            color: '#333',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {chapter}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default ChapterNav;