// filepath: components/MangaViewer.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer'; 

interface MangaViewerProps {
    mangaName: string;
    imageFilenames: string[];
}

// Placeholder component (optional, but good for layout stability)
const ImagePlaceholder: React.FC<{ height?: string }> = ({ height = '600px' }) => (
    <div style={{
        height: height, // Estimate or set a min-height
        width: '100%',
        maxWidth: '800px', // Match image max-width if possible
        margin: '5px auto',
        backgroundColor: '#f0f0f0', // Simple background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ccc'
     }}>
        Loading...
    </div>
);


const extractSortKeys = (filename: string): { chapter: number; page: number } => {
    const match = filename.match(/chapter_(\d+)_page_(\d+)\.(jpg|jpeg|png)$/i);
    if (match) {
        return { chapter: parseInt(match[1], 10), page: parseInt(match[2], 10) };
    }
    return { chapter: Infinity, page: Infinity };
};

const MangaViewer: React.FC<MangaViewerProps> = ({ mangaName, imageFilenames }) => {
    const headerHeight = 112; 
    const chapterNavHeight = 50;
    const totalStickyHeight = headerHeight + chapterNavHeight;

    // Intersection Observer options
    const observerOptions = {
        // Load the image when it's 1000px below the viewport
        // Adjust this value based on typical image height and desired pre-loading amount
        rootMargin: '0px 0px 1000px 0px',
        triggerOnce: true, // Only trigger once per image
    };

    return (
        <div>
            {imageFilenames.map((filename, index) => {
                const keys = extractSortKeys(filename);
                // Add an ID if it's the first page of a valid chapter
                const divId = (keys.page === 0 && keys.chapter !== Infinity)
                    ? `chapter-${keys.chapter}`
                    : undefined;

                 // Use the useInView hook for each image container
                 const { ref, inView } = useInView(observerOptions);

                return (
                    <div
                        ref={ref} // Attach the ref to the div
                        key={index}
                        id={divId} // Add the ID here
                        style={{ 
                            textAlign: 'center', 
                            scrollMarginTop: `${totalStickyHeight}px`,  
                            // Set a min-height to prevent layout shifts before image loads
                            minHeight: '300px',
                            marginTop: '-5px', // Adjust margin to prevent overlap with sticky header
                        }} // Add scroll margin to offset sticky headers
                    >
                        {/* Conditionally render the image or a placeholder */}
                        {inView ? (
                            <img
                                src={`/manga/${mangaName}/${filename}`}
                                alt={filename}
                                style={{ display: 'block', margin: '5px auto', maxWidth: '100%', height: 'auto' }}
                                loading="lazy" // Add native browser lazy loading as a fallback/enhancement
                            />
                        ) : (
                            <ImagePlaceholder /> // Show placeholder until inView is true
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MangaViewer;