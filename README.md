# Manga Viewer

Manga Viewer is a Next.js application designed to display manga images in a stacked format. Each image represents a page from various chapters, allowing users to scroll through the content easily.

## Project Structure

The project is organized as follows:

```
manga-viewer
├── components
│   ├── Header.tsx        # Component for displaying the manga name
│   └── MangaViewer.tsx   # Component for rendering manga images
├── pages
│   ├── _app.tsx          # Custom App component for global styles
│   └── index.tsx         # Main entry point for the application
├── public
│   └── manga             # Directory containing static manga images
├── styles
│   └── globals.css       # Global CSS styles
├── next.config.js        # Next.js configuration file
├── package.json          # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd manga-viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add your manga images:**
   Place your manga images in the `public/manga` directory. Ensure the images are named in the format `chapter_<chapter_number>_page_<page_number>.jpg`.

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000` to view the manga.

## Usage

The application will display the manga name in the header, and the images will be rendered in a stacked format, allowing for easy scrolling through the chapters and pages.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.