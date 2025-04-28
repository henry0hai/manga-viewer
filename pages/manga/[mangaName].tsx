// filepath: pages/manga/[mangaName].tsx
import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import MangaViewer from '../../components/MangaViewer';

import sizeOf from 'image-size';

interface MangaImage {
  filename: string;
  width: number;
  height: number;
}

interface MangaPageProps {
  mangaName: string;
  images: MangaImage[];
  chapters: number[];
}

const MANGA_PAGE_WIDTH = 800;
const MANGA_PAGE_HEIGHT = 1800;

const MangaPage: React.FC<MangaPageProps> = ({ mangaName, images, chapters }) => {
  // Pass the 'images' array to MangaViewer
  return <MangaViewer mangaName={mangaName} images={images} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const mangaBaseDir = path.join(process.cwd(), 'public/manga');
  let mangaNames: string[] = [];

  try {
    const entries = fs.readdirSync(mangaBaseDir, { withFileTypes: true });
    mangaNames = entries.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  } catch (error) {
    console.error(`Error reading manga directory ${mangaBaseDir}:`, error);
  }

  const paths = mangaNames.map((name) => ({
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
    console.log(`[getStaticProps] No mangaName found in params.`);
    return { notFound: true };
  }

  const mangaFolderPath = path.join(process.cwd(), 'public/manga', mangaName);

  // Change to store MangaImage objects
  let imagesData: MangaImage[] = [];
  const chapterSet = new Set<number>();

  try {
    const files = fs.readdirSync(mangaFolderPath);
    console.log(`[getStaticProps] Found files in ${mangaName}:`, files.length);

    const imageFilenames = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    // Get dimensions and sort
    imagesData = imageFilenames
      .map((filename) => {
        const filePath = path.join(mangaFolderPath, filename);
        try {
          const fileBuffer = fs.readFileSync(filePath);
          const dimensions = sizeOf(fileBuffer);
          return {
            filename,
            width: dimensions.width ?? MANGA_PAGE_WIDTH, // Fallback width
            height: dimensions.height ?? MANGA_PAGE_HEIGHT, // Fallback height
          };
        } catch (e) {
          console.error(`[getStaticProps] Error getting dimensions for ${filename}:`, e);
          // Provide fallback dimensions if sizeOf fails
          return { filename, width: MANGA_PAGE_WIDTH, height: MANGA_PAGE_HEIGHT };
        }
      })
      .sort((a, b) => {
        const keysA = extractSortKeys(a.filename);
        const keysB = extractSortKeys(b.filename);
        return keysA.chapter !== keysB.chapter ? keysA.chapter - keysB.chapter : keysA.page - keysB.page;
      });

    console.log(`[getStaticProps] Processed image data count: ${imagesData.length}`);

    imagesData.forEach((img) => {
      const keys = extractSortKeys(img.filename);
      if (keys.chapter !== Infinity) {
        chapterSet.add(keys.chapter);
      }
    });
  } catch (error) {
    console.error(`[getStaticProps] Error processing directory ${mangaFolderPath}:`, error);
    return { notFound: true };
  }

  const chapters = Array.from(chapterSet).sort((a, b) => a - b);

  return {
    props: {
      mangaName,
      images: imagesData,
      chapters,
    },
  };
};

export default MangaPage;
