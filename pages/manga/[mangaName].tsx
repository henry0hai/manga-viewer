// filepath: pages/manga/[mangaName].tsx

import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import MangaViewer from '../../components/MangaViewer';
import Header from '../../components/Header';
import ChapterNav from '../../components/ChapterNav'; 

interface MangaPageProps {
    mangaName: string;
    imageFilenames: string[];
    chapters: number[];
}

// Helper function to extract chapter and page numbers for sorting
const extractSortKeys = (filename: string): { chapter: number; page: number } => {
    // Matches chapter_NUMBER_page_NUMBER.jpg (or png, jpeg)
    const match = filename.match(/chapter_(\d+)_page_(\d+)\.(jpg|jpeg|png)$/i);
    if (match) {
        return { chapter: parseInt(match[1], 10), page: parseInt(match[2], 10) };
    }
    // Fallback for unexpected formats, place them at the end or handle as needed
    console.warn(`Could not parse chapter/page from filename: ${filename}`);
    return { chapter: Infinity, page: Infinity };
};


const MangaPage: React.FC<MangaPageProps> = ({ mangaName, imageFilenames, chapters }) => {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const visibilityTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timer ID

    const headerHeight = 112;
    const displayTitle = mangaName.replace(/-/g, ' ');

    // Function to show the nav and start the 5-second timer
    const showNavAndStartTimer = () => {
        // Clear any existing timer before starting a new one
        if (visibilityTimerRef.current) {
            clearTimeout(visibilityTimerRef.current);
        }

        setIsNavVisible(true); // Make nav visible

        // Start a timer to hide the nav after 5 seconds
        visibilityTimerRef.current = setTimeout(() => {
            setIsNavVisible(false);
            visibilityTimerRef.current = null; // Clear the ref after timer finishes
        }, 3000); // 3000 milliseconds = 3 seconds
    };

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (visibilityTimerRef.current) {
                clearTimeout(visibilityTimerRef.current);
            }
        };
    }, []);

    return (
        <div onMouseEnter={showNavAndStartTimer} >
            <Header 
                isVisible={isNavVisible}
                title={displayTitle} 
            />
            <ChapterNav 
                chapters={chapters} 
                isVisible={isNavVisible} // Pass visibility state
                headerHeight={headerHeight} // Pass header height
                />
            <MangaViewer mangaName={mangaName} imageFilenames={imageFilenames} />
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const mangaBaseDir = path.join(process.cwd(), 'public/manga');
    let mangaNames: string[] = [];

    try {
        // Read all entries in the base manga directory
        const entries = fs.readdirSync(mangaBaseDir, { withFileTypes: true });
        // Filter for directories
        mangaNames = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        console.error(`Error reading manga directory ${mangaBaseDir}:`, error);
        // If the base directory doesn't exist, return no paths
    }


    // Map directory names to the format required by getStaticPaths
    const paths = mangaNames.map(name => ({
        params: { mangaName: name },
    }));

    // fallback: false means pages for manga names not returned here will result in a 404
    return { paths, fallback: false };
};


export const getStaticProps: GetStaticProps<MangaPageProps, { mangaName: string }> = async (context) => {
    const mangaName = context.params?.mangaName;

    if (!mangaName) {
        console.error("[getStaticProps] mangaName is missing from context.params!");
        return { notFound: true };
    }

    const mangaFolderPath = path.join(process.cwd(), 'public/manga', mangaName);
    let imageFilenames: string[] = [];
    const chapterSet = new Set<number>(); 

    try {
        const files = fs.readdirSync(mangaFolderPath);
        imageFilenames = files
            .filter(file => {
                const isImage = /\.(jpg|jpeg|png)$/i.test(file);
                return isImage;
            })
            .sort((a, b) => {
                const keysA = extractSortKeys(a);
                const keysB = extractSortKeys(b);
                if (keysA.chapter !== keysB.chapter) {
                    return keysA.chapter - keysB.chapter;
                }
                return keysA.page - keysB.page;
            });

        imageFilenames.forEach(filename => {
            const keys = extractSortKeys(filename);
            if (keys.chapter !== Infinity) { // Only add valid chapter numbers
                chapterSet.add(keys.chapter);
            }
        });
    } catch (error) {
        console.error(`[getStaticProps] Error reading directory ${mangaFolderPath}:`, error);
        return { notFound: true };
    }

    const chapters = Array.from(chapterSet).sort((a, b) => a - b);

    // Ensure props are actually being returned
    const props = {
        mangaName,
        imageFilenames,
        chapters,
    };

    return {
        props: props,
        // revalidate: 60,
    };
};

export default MangaPage;