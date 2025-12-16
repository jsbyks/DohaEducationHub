import Link from 'next/link';
import { Button } from '../components/Button';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/schools">
            <Button variant="outline" size="lg">
              Browse Schools
            </Button>
          </Link>
          <Link href="/teachers">
            <Button variant="outline" size="lg">
              Find Teachers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
