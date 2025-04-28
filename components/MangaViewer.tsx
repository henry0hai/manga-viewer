import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

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
  // Return Infinity for files that don't match the pattern to sort them last
  return { chapter: Infinity, page: Infinity };
};

// Maximum width the manga images will be displayed at
const MAX_DISPLAY_WIDTH = 1000;

const MangaViewer: React.FC<MangaViewerProps> = ({ mangaName, images }) => {
  // --- Constants and Hooks ---
  const headerHeight = 60; // Adjust if your header height changes
  const totalStickyHeight = headerHeight;
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const router = useRouter();
  const chapterMarkerRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const [currentChapterInView, setCurrentChapterInView] = useState<number | null>(null);

  // --- Debounced URL Hash Update Function ---
  // Updates the URL hash without a full page reload after a short delay
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUrlHash = useCallback(
    debounce((chapter: number | null) => {
      const newHash = chapter !== null ? `#chapter-${chapter}` : '';
      if (window.location.hash !== newHash) {
        try {
          // Use shallow routing to update hash without re-running data fetching
          router.replace({ hash: newHash }, undefined, { shallow: true });
        } catch (error) {
          console.error(`[MangaViewer] Error calling router.replace:`, error); // Keep error log
        }
      }
    }, 300), // Debounce delay in milliseconds
    [router], // Dependency: router instance
  );

  // --- Intersection Observer Effect ---
  // Detects which chapter marker is currently near the top of the viewport
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let latestChapterNearTop: number | null = null;
      let minTop = Infinity;

      entries.forEach((entry) => {
        const chapterMatch = entry.target.id.match(/chapter-(\d+)/);
        if (!chapterMatch) return;
        const chapterNum = parseInt(chapterMatch[1], 10);
        const topPosition = entry.boundingClientRect.top;

        // Check if the element is intersecting within the defined rootMargin
        if (entry.isIntersecting) {
          // Find the intersecting element closest to the top (but below the sticky header)
          if (topPosition >= totalStickyHeight && topPosition < minTop) {
            minTop = topPosition;
            latestChapterNearTop = chapterNum;
          } else if (latestChapterNearTop === null && topPosition < totalStickyHeight) {
            // Fallback: If no element is fully below header, use the highest one intersecting
            latestChapterNearTop = chapterNum;
          }
        }
      });

      // Update the state only if the determined chapter has changed
      if (latestChapterNearTop !== null) {
        setCurrentChapterInView((prevChapter) => {
          if (prevChapter !== latestChapterNearTop) {
            return latestChapterNearTop;
          }
          return prevChapter; // No change needed
        });
      }
    };

    // Observer options: Define the area to observe relative to the viewport
    const observerOptions = {
      // Top margin accounts for sticky header, bottom margin focuses on the top ~25% of viewport
      rootMargin: `-${totalStickyHeight}px 0px -75% 0px`,
      threshold: 0.01, // Trigger if even a small part enters/leaves the zone
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each element stored in the refs map
    chapterMarkerRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    // Cleanup function: Disconnect the observer when the component unmounts or dependencies change
    return () => {
      observer.disconnect();
    };
    // Dependencies: Re-run observer setup if images or sticky height change
  }, [images, totalStickyHeight]);

  // --- URL Update Effect ---
  // Calls the debounced hash update function when the current chapter state changes
  useEffect(() => {
    updateUrlHash(currentChapterInView);

    // Cleanup function: Cancel any pending debounced update on unmount or state change
    return () => {
      updateUrlHash.cancel();
    };
  }, [currentChapterInView, updateUrlHash]); // Dependencies: State and the debounced function itself

  // --- Render Logic ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {images.map((image, index) => {
        const keys = extractSortKeys(image.filename);
        // Assign an ID only to the first page of each chapter
        const divId = keys.page === 0 && keys.chapter !== Infinity ? `chapter-${keys.chapter}` : undefined;

        const imageUrl = `/manga/${mangaName}/${image.filename}`;

        return (
          <div
            // Assign ref callback to store element reference in the map
            ref={
              divId
                ? (el) => {
                    if (el) {
                      chapterMarkerRefs.current.set(keys.chapter, el);
                    } else {
                      // Optional: Clean up map entry if element is removed
                      chapterMarkerRefs.current.delete(keys.chapter);
                    }
                  }
                : null
            }
            key={image.filename}
            id={divId}
            style={{
              scrollMarginTop: `${totalStickyHeight}px`, // Offset for sticky header when jumping to ID
              width: '100%',
              maxWidth: `${MAX_DISPLAY_WIDTH}px`,
              fontSize: 0, // Prevent extra space below image element
              marginBottom: isMobile ? '-5px' : '0px', // Adjust spacing for mobile
            }}
          >
            <Image
              src={imageUrl}
              alt={`Page ${image.filename}`}
              width={image.width}
              height={image.height}
              priority={index < 3} // Prioritize loading first few images
              quality={75} // Adjust image quality as needed
              style={{ width: '100%', height: 'auto' }} // Ensure image scales within container
            />
          </div>
        );
      })}
    </div>
  );
};

export default MangaViewer;
