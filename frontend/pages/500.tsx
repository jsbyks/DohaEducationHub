import Link from 'next/link';
import { Button } from '../components/Button';

export default function Custom500() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-red-600 mb-4">500</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Server Error</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Oops! Something went wrong on our end. We're working to fix the problem. Please try again later.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
