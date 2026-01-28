import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from '@/lib/utils';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, ttl_seconds, max_views } = body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const id = nanoid();
        const now = Date.now();

        const pasteData: Record<string, any> = {
            content,
            created_at: now,
            views: 0,
        };

        if (max_views !== undefined) {
            const parsedMaxViews = parseInt(max_views);
            if (isNaN(parsedMaxViews) || parsedMaxViews < 1) {
                return NextResponse.json({ error: 'max_views must be a positive integer' }, { status: 400 });
            }
            pasteData.max_views = parsedMaxViews;
        }

        let ttl = -1;
        if (ttl_seconds !== undefined) {
            const parsedTtl = parseInt(ttl_seconds);
            if (isNaN(parsedTtl) || parsedTtl < 1) {
                return NextResponse.json({ error: 'ttl_seconds must be a positive integer' }, { status: 400 });
            }
            ttl = parsedTtl;
            pasteData.expires_at = now + (ttl * 1000);
        }

        const key = `paste:${id}`;

        // Pipeline to ensure atomicity of setting data and expiry
        const pipeline = redis.pipeline();
        pipeline.hset(key, pasteData);
        if (ttl > 0) {
            pipeline.expire(key, ttl);
        }
        await pipeline.exec();

        // Construct full URL
        // Default to a relative URL in response if base not known, or try to infer.
        // Spec example: "url": "https://your-app.vercel.app/p/<id>"
        // We'll use the request origin if possible, or correct env.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
        const url = `${baseUrl}/p/${id}`;

        return NextResponse.json({
            id,
            url,
        });

    } catch (error) {
        console.error('Error creating paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
