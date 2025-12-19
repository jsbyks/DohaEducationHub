import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { ComparisonProvider } from '../contexts/ComparisonContext';
import { Header } from '../components/Header';
import { ComparisonBar } from '../components/ComparisonBar';
import Analytics from '../components/Analytics';
import ErrorBoundary from '../components/ErrorBoundary';
import { queryClient } from '../lib/queryClient';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ComparisonProvider>
            <Analytics />
            <Header />
            <Component {...pageProps} />
            <ComparisonBar />
            <Footer />
          </ComparisonProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
