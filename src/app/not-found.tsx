import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
                404
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-md">
                This paste is either unavailable, expired, or has reached its view limit.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-all text-emerald-400 hover:text-emerald-300 font-semibold"
            >
                Create New Paste
            </Link>
        </main>
    );
}
