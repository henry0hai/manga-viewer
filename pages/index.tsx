import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import Link from 'next/link'; // Import Next.js Link component
import React from 'react';
import Header from '../components/Header'; // Optional: Reuse Header

interface HomeProps {
    mangaList: string[];
}

// Function to format manga names for display (e.g., 'manga-name' -> 'Manga Name')
const formatMangaName = (name: string): string => {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const Home: React.FC<HomeProps> = ({ mangaList }) => {
    return (
        <div>
            <Header title="Manga Collection" /> {/* Optional Header */}
            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2>Available Manga</h2>
                {mangaList.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {mangaList.map((mangaName) => (
                            <li key={mangaName} style={{ marginBottom: '1rem' }}>
                                {/* Add legacyBehavior prop here */}
                                <Link href={`/manga/${mangaName}`} passHref legacyBehavior>
                                    <a style={{
                                        textDecoration: 'none',
                                        color: '#0070f3', // Example link color
                                        fontSize: '1.2rem',
                                        display: 'block',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                       onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                       onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {formatMangaName(mangaName)}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No manga found in the 'public/manga' directory.</p>
                )}
            </main>
        </div>
    );
};

// ... getStaticProps remains the same ...
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const mangaBaseDir = path.join(process.cwd(), 'public/manga');
    let mangaNames: string[] = [];

    try {
        // Read all entries in the base manga directory
        const entries = fs.readdirSync(mangaBaseDir, { withFileTypes: true });
        // Filter for directories only
        mangaNames = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        console.error(`Error reading manga directory ${mangaBaseDir}:`, error);
        // If the directory doesn't exist or there's an error, return an empty list
        // You might want to handle this more gracefully depending on your needs
    }

    return {
        props: {
            mangaList: mangaNames,
        },
        // Optional: Revalidate the list periodically if manga are added/removed without rebuilding
        // revalidate: 60, // Re-generate the page at most once every 60 seconds
    };
};


export default Home;