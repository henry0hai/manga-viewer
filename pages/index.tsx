// filepath: pages/index.tsx
import React from 'react';
import fs from 'fs';
import path from 'path'; 
import { GetStaticProps } from 'next'; // Import GetStaticProps
import Link from 'next/link'; // Import Link for navigation

// Define props for the Home page, including the manga list
interface HomeProps {
    mangaList: string[];
}

const Home: React.FC<HomeProps> = ({ mangaList }) => {
    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Welcome to the Manga Viewer</h2>
            <p>Select a manga from the sidebar or the list below to get started!</p>
            <ul>
                {mangaList.map(manga => (
                    <li key={manga}>
                        <Link href={`/manga/${manga}`}>
                           {manga.replace(/-/g, ' ')}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};

// Fetch the list of manga directories at build time
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    console.log('[index.tsx getStaticProps] Fetching manga list...');
    const mangaBaseDir = path.join(process.cwd(), 'public/manga');
    let mangaList: string[] = [];
    try {
        const entries = fs.readdirSync(mangaBaseDir, { withFileTypes: true });
        mangaList = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        console.log('[index.tsx getStaticProps] Found manga list:', mangaList);
    } catch (error) {
        console.error(`[index.tsx getStaticProps] Error reading manga directory ${mangaBaseDir}:`, error);
        mangaList = []; 
    }

    return {
        props: {
            mangaList,
        },
    };
};


export default Home;