import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
    try {
        // Ping Redis to ensure persistence is reachable
        await redis.ping();
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Health check failed:', error);
        // Explicitly return 200 with error info or 503? 
        // Spec says: Must return HTTP 200, Example: { "ok": true }
        // Spec also says: "Should reflect whether the application can access its persistence layer"
        // Usually if health check fails, we return 500 or 503. 
        // ONE of the requirements is "Must return HTTP 200". 
        // Another is "Should reflect whether the application can access its persistence layer".
        // If I return 500, I violate "Must return HTTP 200".
        // If I return 200 with { ok: false }, I satisfy both technically (status 200, payload shows fail).
        // But "Example response: { "ok": true }" implies the structure.
        // Let's return 200 but if it fails, maybe ok: false.
        return NextResponse.json({ ok: false, error: 'Persistence unreachable' }, { status: 200 });
    }
}
