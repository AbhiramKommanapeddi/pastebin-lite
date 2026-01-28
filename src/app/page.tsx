'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedUrl(null);

    try {
      const payload: any = { content };
      if (ttl) payload.ttl_seconds = parseInt(ttl);
      if (maxViews) payload.max_views = parseInt(maxViews);

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      setCreatedUrl(data.url);
      setContent('');
      setTtl('');
      setMaxViews('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent drop-shadow-sm">
            Pastebin-Lite
          </h1>
          <p className="text-neutral-400 text-lg font-light">Secure, ephemeral text sharing.</p>
        </header>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-neutral-300">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none transition-all resize-y font-mono text-sm"
                placeholder="Paste your text here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="ttl" className="block text-sm font-medium text-neutral-300">
                  TTL (Seconds) <span className="text-neutral-500 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="ttl"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    min="1"
                    placeholder="e.g. 3600"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxViews" className="block text-sm font-medium text-neutral-300">
                  Max Views <span className="text-neutral-500 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxViews"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    min="1"
                    placeholder="e.g. 5"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-neutral-900 transition-all shadow-lg hover:shadow-emerald-500/20 ${loading
                ? 'bg-neutral-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:scale-[0.99]'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Secure Paste...
                </span>
              ) : 'Get Shareable Link'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              <span>{error}</span>
            </div>
          )}

          {createdUrl && (
            <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <p className="text-emerald-300 text-sm font-medium mb-3 uppercase tracking-wider text-center">Your Secure Link</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/30 p-2 rounded-lg border border-white/5">
                <input
                  readOnly
                  value={createdUrl}
                  className="flex-1 bg-transparent text-emerald-400 font-mono text-sm px-2 focus:outline-none w-full text-center sm:text-left"
                  onClick={(e) => e.currentTarget.select()}
                />
                <a
                  href={createdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-md transition-colors whitespace-nowrap"
                >
                  Open
                </a>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} Pastebin-Lite. Ephemeral by design.
        </footer>
      </div>
    </main>
  );
}
