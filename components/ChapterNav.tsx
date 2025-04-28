import React from 'react'; // Removed useState

interface ChapterNavProps {
    chapters: number[]; // This will now be the *filtered* list from Sidebar
    isVisible?: boolean; 
    headerHeight: number; 
}

// Remove internal state and filtering logic
const ChapterNav: React.FC<ChapterNavProps> = ({ chapters, isVisible = true, headerHeight }) => {
    // const [searchTerm, setSearchTerm] = useState(''); // Remove state
    // const filteredChapters = chapters.filter(...); // Remove filtering

    // Handle case where the filtered list might be empty
    if (!chapters || chapters.length === 0) {
        // Optionally show a message if search yields no results
        return <p style={{color: '#888', fontSize: '0.9em'}}>No matching chapters found.</p>;
    }

    return (
        // Keep the nav structure, but remove the input
        <nav style={{
            // padding: '10px', // Padding is likely handled by Sidebar now
            // borderBottom: '1px solid #eee', // Styling might be adjusted based on Sidebar
            // background: '#fafafa', // Styling might be adjusted based on Sidebar
            // position: 'sticky', // No longer sticky within the sidebar scroll container
            // top: `${headerHeight}px`, // Not needed if not sticky
            // zIndex: 9, // Not needed
            display: isVisible ? 'block' : 'none',
            // transition: 'opacity 0.5s ease-in-out', // Transitions handled by Sidebar
            // opacity: isVisible ? 1 : 0, // Visibility handled by Sidebar
        }}>
            {/* Remove the search input element */}
            {/* <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{...}}
            /> */}
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Chapters:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {/* Map directly over the chapters prop (already filtered by Sidebar) */}
                {chapters.map((chapter) => ( 
                    <a
                        key={chapter}
                        href={`#chapter-${chapter}`} // Keep link logic for scrolling to chapter sections
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