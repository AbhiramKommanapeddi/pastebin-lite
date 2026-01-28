import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL || 'https://example.com';
const redisToken = process.env.KV_REST_API_TOKEN || 'example_token';

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
