import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ComparisonProvider } from '../contexts/ComparisonContext';
import { Header } from '../components/Header';
import { ComparisonBar } from '../components/ComparisonBar';
import Analytics from '../components/Analytics';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <Analytics />
        <Header />
        <Component {...pageProps} />
        <ComparisonBar />
      </ComparisonProvider>
    </AuthProvider>
  );
}
