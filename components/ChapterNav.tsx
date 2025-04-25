// filepath: components/ChapterNav.tsx
import React from 'react';

interface ChapterNavProps {
    chapters: number[];
    isVisible?: boolean; // New prop to control visibility
    headerHeight: number; // New prop for positioning below header
}

const ChapterNav: React.FC<ChapterNavProps> = ({ chapters, isVisible, headerHeight }) => {
    if (!chapters || chapters.length === 0) {
        return null;
    }

    return (
        <nav style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            background: '#fafafa',
            position: 'sticky', // Make it sticky
            top: `${headerHeight}px`, // Position it right below the header
            zIndex: 9, // Below header (zIndex 10), above content
            // Use flexbox for layout and wrapping
            display: 'flex',
            flexWrap: 'wrap', // Allow items to wrap to the next line
            justifyContent: 'center', // Center items horizontally
            alignItems: 'center', // Align items vertically in the center
            gap: '5px 10px', // Add spacing between wrapped items (row-gap column-gap)
            transition: 'opacity 0.5s ease-in-out, visibility 1s ease-in-out',  // Add transition for smooth show/hide
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden',
        }}>
            <span style={{ fontWeight: 'bold', flexShrink: 0, marginRight: '10px' }}>Chapters:</span>
            {/* Links container (optional, but can help with alignment if needed) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
                {chapters.map((chapter) => (
                    <a
                        key={chapter}
                        href={`#chapter-${chapter}`}
                        style={{
                            // Remove margin, use gap instead
                            padding: '3px 8px',
                            textDecoration: 'none',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: '#fff',
                            color: '#333',
                            whiteSpace: 'nowrap' // Prevent chapter number itself from wrapping
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