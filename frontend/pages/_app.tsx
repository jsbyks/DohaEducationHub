import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import Analytics from '../components/Analytics';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Analytics />
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
