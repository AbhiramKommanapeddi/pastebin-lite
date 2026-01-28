import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const key = `paste:${id}`;

        // Fetch data
        const paste = await redis.hgetall(key) as Record<string, any>;

        if (!paste || Object.keys(paste).length === 0) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        // Determine "current time"
        let now = Date.now();
        const isTestMode = process.env.TEST_MODE === '1';
        if (isTestMode) {
            const testNowStr = req.headers.get('x-test-now-ms');
            if (testNowStr) {
                const testNow = parseInt(testNowStr);
                if (!isNaN(testNow)) {
                    now = testNow;
                }
            }
        }

        // Check expiry
        if (paste.expires_at) {
            const expiresAt = parseInt(paste.expires_at);
            if (expiresAt < now) {
                // Expired
                // Ideally delete it to clean up, but for 404 compliance, just returning 404 is enough.
                // Spec says "Unavailable cases... must return HTTP 404".
                return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
            }
        }

        // Check Views
        let views = 0;
        if (paste.views) views = parseInt(paste.views);

        let remaining_views = null;

        if (paste.max_views) {
            const maxViews = parseInt(paste.max_views);

            // Increment view count
            const newViews = await redis.hincrby(key, 'views', 1);

            if (newViews > maxViews) {
                // Limit exceeded
                return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
            }

            remaining_views = maxViews - newViews;
        }

        // Construct response
        const responseData: any = {
            content: paste.content,
            remaining_views,
            expires_at: paste.expires_at ? new Date(parseInt(paste.expires_at)).toISOString() : null,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error fetching paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
