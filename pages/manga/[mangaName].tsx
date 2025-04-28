import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react'; // Removed useState, useEffect, useRef
import MangaViewer from '../../components/MangaViewer';
// Removed Header, ChapterNav, Sidebar, useScrollDirection imports as they are handled by Layout
// Import Layout if it's not globally applied in _app.tsx
// import Layout from '../../components/Layout'; 
// Import useSidebar if needed for other reasons, but not for visibility control here
// import useSidebar from '../../hooks/useSidebar'; 

interface MangaPageProps {
    mangaName: string;
    imageFilenames: string[];
    chapters: number[];
}

// The component now just renders the MangaViewer
// Layout will handle Header, Sidebar, and their visibility
const MangaPage: React.FC<MangaPageProps> = ({ mangaName, imageFilenames, chapters }) => {
    // Removed local state and effects for visibility control
    // const [isNavVisible, setIsNavVisible] = useState(false);
    // const headerRef = useRef<HTMLDivElement>(null);
    // const scrollDirection = useScrollDirection();
    // const { isOpen } = useSidebar(); // Not needed directly here if Layout handles it

    // const displayTitle = mangaName.replace(/-/g, ' ');

    // useEffect(() => { ... visibility logic removed ... }, [scrollDirection]);

    // The actual rendering happens within the Layout component (applied either here or in _app.tsx)
    // If Layout is NOT in _app.tsx, wrap it here:
    /*
    return (
        <Layout pageProps={{ chapters }}> 
            <MangaViewer mangaName={mangaName} imageFilenames={imageFilenames} />
        </Layout>
    );
    */

    // If Layout IS in _app.tsx, just return the page content:
    return (
        <MangaViewer mangaName={mangaName} imageFilenames={imageFilenames} />
    );
};

// --- getStaticPaths remains the same ---
export const getStaticPaths: GetStaticPaths = async () => {
    const mangaBaseDir = path.join(process.cwd(), 'public/manga');
    let mangaNames: string[] = [];

    try {
        const entries = fs.readdirSync(mangaBaseDir, { withFileTypes: true });
        mangaNames = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        console.error(`Error reading manga directory ${mangaBaseDir}:`, error);
    }

    const paths = mangaNames.map(name => ({
        params: { mangaName: name },
    }));

    return { paths, fallback: false };
};


// --- getStaticProps remains the same ---
// Helper function (assuming it's defined elsewhere or here)
const extractSortKeys = (filename: string): { chapter: number; page: number } => {
    const match = filename.match(/chapter_(\d+)_page_(\d+)\.(jpg|jpeg|png)$/i);
    if (match) {
        return { chapter: parseInt(match[1], 10), page: parseInt(match[2], 10) };
    }
    // Ensure consistent return type if no match
    return { chapter: Infinity, page: Infinity }; 
};

export const getStaticProps: GetStaticProps<MangaPageProps, { mangaName: string }> = async (context) => {
    const mangaName = context.params?.mangaName;

    if (!mangaName) {
        return { notFound: true };
    }

    const mangaFolderPath = path.join(process.cwd(), 'public/manga', mangaName);
    let imageFilenames: string[] = [];
    const chapterSet = new Set<number>();

    try {
        const files = fs.readdirSync(mangaFolderPath);
        imageFilenames = files
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .sort((a, b) => {
                const keysA = extractSortKeys(a);
                const keysB = extractSortKeys(b);
                // Handle potential Infinity cases if needed, though sorting should place them last
                return keysA.chapter !== keysB.chapter 
                    ? keysA.chapter - keysB.chapter 
                    : keysA.page - keysB.page;
            });

        imageFilenames.forEach(filename => {
            const keys = extractSortKeys(filename);
            if (keys.chapter !== Infinity) {
                chapterSet.add(keys.chapter);
            }
        });
    } catch (error) {
        console.error(`[getStaticProps] Error reading directory ${mangaFolderPath}:`, error);
        // It's often better to return notFound here if the directory is expected but missing/unreadable
        return { notFound: true }; 
    }

    const chapters = Array.from(chapterSet).sort((a, b) => a - b);

    // Ensure props are returned correctly
    return {
        props: {
            mangaName,
            imageFilenames,
            chapters,
        },
    };
};


export default MangaPage;