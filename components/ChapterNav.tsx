// filepath: components/ChapterNav.tsx
import React from 'react';

interface ChapterNavProps {
    chapters: number[]; 
    isVisible?: boolean; 
    headerHeight: number; 
}

const ChapterNav: React.FC<ChapterNavProps> = ({ chapters, isVisible = true, headerHeight }) => {

    // Handle case where the filtered list might be empty
    if (!chapters || chapters.length === 0) {
        return <p style={{color: '#888', fontSize: '0.9em'}}>No matching chapters found.</p>;
    }

    return (
        <nav style={{
            display: isVisible ? 'block' : 'none',
        }}>
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Chapters:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {chapters.map((chapter) => ( 
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