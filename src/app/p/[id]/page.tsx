import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>;
};

// Force dynamic behavior since we need to check validity every time
export const dynamic = 'force-dynamic';

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Paste ${id}`,
    };
}

export default async function ViewPastePage({ params }: Props) {
    const { id } = await params;

    // We'll fetch from our own API to strictly follow the requirement 
    // "Each successful API fetch counts as a view" and the API logic handles it.
    // In a real app we might call a service function directly if we want to avoid HTTP overhead,
    // but calling the API ensures we trigger the exact same logic (view counting, expiry check).

    // We need an absolute URL for server-side fetch
    const port = process.env.PORT || 3000;
    // Use http://127.0.0.1 for local fetch to avoid some localhost resolution issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://127.0.0.1:${port}`;

    // Handle case where we might be building static pages or something, though we forced dynamic.
    // Fetch from the API
    let data;
    try {
        const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
            cache: 'no-store',
        });

        if (res.status === 404) {
            notFound();
        }

        if (!res.ok) {
            // Other error
            throw new Error(`Failed to fetch paste: ${res.status}`);
        }

        data = await res.json();
    } catch (err) {
        console.error("Error fetching paste:", err);
        // If we can't fetch, maybe 404 or 500. 
        // If it's a network error calling our own API, it's a 500.
        // If the API returns 404, we already called notFound()

        // If we are building, this fetch might fail if server isn't running?
        // But this is a page request, so server must be running.
        notFound();
    }

    if (!data || !data.content) {
        notFound();
    }

    return (
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl w-full z-10 animate-in fade-in zoom-in-95 duration-500">
                <header className="mb-6 flex justify-between items-center px-2">
                    <h1 className="text-xl font-bold text-neutral-200 tracking-tight">Pastebin-Lite</h1>
                    <a href="/" className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-emerald-400 transition-colors">
                        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                        Create New
                    </a>
                </header>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                    <div className="bg-black/20 p-4 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center text-xs text-neutral-400 font-mono">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                            <span className="opacity-70">ID:</span> <span className="text-neutral-200">{id}</span>
                        </div>
                        <div className="flex gap-4">
                            {data.expires_at && (
                                <div className="flex items-center gap-2" title={new Date(data.expires_at).toLocaleString()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    <span className="text-orange-300">Expires: {new Date(data.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )}
                            {data.remaining_views !== null && data.remaining_views !== undefined && (
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    <span className="text-cyan-300">{data.remaining_views} <span className="opacity-50">views left</span></span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Copy button could go here */}
                        </div>
                        <div className="p-0 overflow-x-auto max-h-[70vh] custom-scrollbar">
                            <pre className="font-mono text-sm leading-relaxed p-6 whitespace-pre-wrap break-words text-neutral-200 bg-transparent">
                                {data.content}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
