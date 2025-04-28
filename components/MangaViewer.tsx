import React from 'react';
import Image from 'next/image'; 
import { useMediaQuery } from 'react-responsive';

// Define the shape of the image data object (should match the one in [mangaName].tsx)
interface MangaImage {
    filename: string;
    width: number;
    height: number;
}

interface MangaViewerProps {
    mangaName: string;
    images: MangaImage[]; 
}

const extractSortKeys = (filename: string): { chapter: number; page: number } => {
    const match = filename.match(/chapter_(\d+)_page_(\d+)\.(jpg|jpeg|png)$/i);
    if (match) {
        return { chapter: parseInt(match[1], 10), page: parseInt(match[2], 10) };
    }
    return { chapter: Infinity, page: Infinity };
};

const MAX_DISPLAY_WIDTH = 1000; 

const MangaViewer: React.FC<MangaViewerProps> = ({ mangaName, images }) => {
    const headerHeight = 60; 
    const totalStickyHeight = headerHeight;

    // Check if the screen width is typical for mobile devices
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Map over the images array */}
            {images.map((image, index) => { 
                const keys = extractSortKeys(image.filename);
                const divId = (keys.page === 0 && keys.chapter !== Infinity)
                    ? `chapter-${keys.chapter}`
                    : undefined;
                
                const imageUrl = `/manga/${mangaName}/${image.filename}`;

                return (
                    <div
                        key={image.filename} // Use filename as key
                        id={divId}
                        style={{ 
                            textAlign: 'center', 
                            scrollMarginTop: `${totalStickyHeight}px`,  
                            width: '100%', 
                            maxWidth: `${MAX_DISPLAY_WIDTH}px`, 
                            fontSize: 0, // Prevent extra space below image
                            marginBottom: isMobile ? '-3px' : '0px', // Use -1px on mobile, 0px otherwise
                        }} 
                    >
                        <Image
                            src={imageUrl}
                            alt={`Page ${image.filename}`}
                            width={image.width} 
                            height={image.height}
                            priority={index < 3} 
                            quality={75} 
                            style={{ width: '100%', height: 'auto' }} 
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MangaViewer;