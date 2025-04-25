import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <> {/* Use a Fragment or a div to wrap multiple elements */}
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;