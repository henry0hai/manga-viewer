// filepath: pages/manga/[mangaName].tsx
import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react'; 
import MangaViewer from '../../components/MangaViewer';

interface MangaPageProps {
    mangaName: string;
    imageFilenames: string[];
    chapters: number[];
}

const MangaPage: React.FC<MangaPageProps> = ({ mangaName, imageFilenames, chapters }) => {
    return (
        <MangaViewer mangaName={mangaName} imageFilenames={imageFilenames} />
    );
};

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