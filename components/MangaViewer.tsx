import React from 'react';
import Image from 'next/image'; 

interface MangaViewerProps {
    mangaName: string;
    imageFilenames: string[];
}

const extractSortKeys = (filename: string): { chapter: number; page: number } => {
    const match = filename.match(/chapter_(\d+)_page_(\d+)\.(jpg|jpeg|png)$/i);
    if (match) {
        return { chapter: parseInt(match[1], 10), page: parseInt(match[2], 10) };
    }
    return { chapter: Infinity, page: Infinity };
};

const MANGA_PAGE_WIDTH = 800; 
const MANGA_PAGE_HEIGHT = 1800; 

const MangaViewer: React.FC<MangaViewerProps> = ({ mangaName, imageFilenames }) => {
    // Calculate scroll margin offset (adjust if your header/nav heights change)
    const headerHeight = 60; // Approximate height of your sticky Header
    const chapterNavHeight = 0; // ChapterNav is now inside Sidebar, not sticky above content
    const totalStickyHeight = headerHeight + chapterNavHeight;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {imageFilenames.map((filename, index) => {
                const keys = extractSortKeys(filename);
                const divId = (keys.page === 0 && keys.chapter !== Infinity)
                    ? `chapter-${keys.chapter}`
                    : undefined;
                
                const imageUrl = `/manga/${mangaName}/${filename}`;

                return (
                    // Container for ID, scroll margin, and controlling max-width
                    <div
                        key={filename} // Use filename as key for stability
                        id={divId}
                        style={{ 
                            textAlign: 'center', 
                            scrollMarginTop: `${totalStickyHeight}px`,  
                            width: '100%', 
                            maxWidth: `${MANGA_PAGE_WIDTH}px`, 
                            marginBottom: '0px',
                            fontSize: 0, 
                        }} 
                    >
                        <Image
                            src={imageUrl}
                            alt={`Page ${filename}`}
                            width={MANGA_PAGE_WIDTH} 
                            height={MANGA_PAGE_HEIGHT}
                            // layout="responsive" // Optional: Use if container size dictates image size, but still needs w/h for aspect ratio
                            priority={index < 3} // Prioritize loading the first few images
                            quality={75} // Adjust image quality
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MangaViewer;