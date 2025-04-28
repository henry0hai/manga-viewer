import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import React from 'react';
import { SidebarProvider } from '../context/SidebarContext'; // Import the provider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Wrap the Layout (and thus the whole app) with the Provider
    <SidebarProvider>
      <Layout pageProps={pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SidebarProvider>
  );
}

export default MyApp;