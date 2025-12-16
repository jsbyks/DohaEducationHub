import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ComparisonProvider } from '../contexts/ComparisonContext';
import { Header } from '../components/Header';
import { ComparisonBar } from '../components/ComparisonBar';
import Analytics from '../components/Analytics';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ComparisonProvider>
          <Analytics />
          <Header />
          <Component {...pageProps} />
          <ComparisonBar />
        </ComparisonProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
