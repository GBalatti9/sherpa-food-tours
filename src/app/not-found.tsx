import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <p className="text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
      >
        Back to home
      </Link>
    </div>
  );
}
