# Manga Viewer

Manga Viewer is a Next.js application designed to display manga images in a stacked format, featuring a collapsible sidebar for navigation.

## Project Structure

The project is organized as follows:

```
manga-viewer
├── components
│   ├── ChapterNav.tsx      # Displays list of chapters for a manga
│   ├── Header.tsx          # Displays the title, hides/shows on scroll
│   ├── Layout.tsx          # Main layout structure including Header and Sidebar
│   ├── MangaViewer.tsx     # Renders manga images
│   ├── Sidebar.tsx         # Collapsible sidebar for navigation (manga list or chapters)
│   └── SidebarToggle.tsx   # Button to toggle the sidebar visibility
├── context
│   └── SidebarContext.tsx  # React context for managing sidebar state
├── hooks
│   └── useScrollDirection.ts # Hook to detect scroll direction
├── pages
│   ├── _app.tsx            # Custom App component, applies Layout and Context Provider
│   ├── index.tsx           # Homepage, displays welcome message
│   └── manga
│       └── [mangaName].tsx # Dynamic page for displaying a specific manga
├── public
│   └── manga               # Directory containing static manga images (organized by manga name)
├── styles
│   └── globals.css         # Global CSS styles
├── .gitignore              # Specifies intentionally untracked files
├── next-env.d.ts           # Next.js TypeScript environment types
├── next.config.js          # Next.js configuration file
├── package.json            # Project metadata and dependencies
├── pnpm-lock.yaml          # pnpm lock file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # This file
```

## Features

*   Displays manga images chapter by chapter, page by page.
*   Collapsible sidebar:
    *   Shows a list of available manga on the homepage.
    *   Shows a list of chapters for the selected manga on the manga page.
    *   Allows searching within the displayed list (manga or chapters).
*   Header displays the current manga title (or default) and hides on scroll down, appears on scroll up.
*   Built with Next.js for server-side rendering and static generation.
*   Uses TypeScript for type safety.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:henry0hai/manga-viewer.git
    cd manga-viewer
    ```

2.  **Install dependencies (using pnpm):**
    ```bash
    pnpm install
    ```

3.  **Add your manga images:**
    *   Create subdirectories within `public/manga/` for each manga series (e.g., `public/manga/your-manga-name`).
    *   Place your manga images inside the respective manga directory.
    *   Ensure the images are named in the format `chapter_<chapter_number>_page_<page_number>.(jpg|jpeg|png)`. Example: `chapter_1_page_0.jpg`.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

5.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

## Usage

*   Navigate the available manga series using the sidebar on the homepage.
*   Click a manga series to view its chapters in the sidebar and the images in the main area.
*   Use the search bar in the sidebar to filter the manga list or chapter list.
*   Scroll down to read the manga; the header will hide. Scroll up to reveal the header.
*   Use the toggle button (☰/‹) to show or hide the sidebar.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.