# Pastebin-Lite

A secure, ephemeral text sharing application built with Next.js and Redis.

## Description
This application allows users to create text pastes that are shared via a unique URL. Pastes can secure themselves with:
- **Time-to-Live (TTL)**: Automatically expire after a set duration.
- **View Limits**: Automatically expire after a shared number of views (burn after reading).

## How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file in the root directory (or rename the example) and add your Redis credentials:
   ```bash
   # Upstash or Vercel KV URL and Token
   KV_REST_API_URL="your_redis_url"
   KV_REST_API_TOKEN="your_redis_token"
   
   # Optional base URL
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000).

## Persistence Layer
I chose **Redis** (specifically @upstash/redis compatible with Vercel KV) for the persistence layer. 

**Why Redis?**
- **Native Expiry (TTL)**: Redis supports key expiration natively, making it perfect for the "Time-to-Live" requirement without needing background cleanup jobs.
- **Atomic Operations**: The `HINCRBY` command allows for atomic increments of view counts, ensuring accuracy even under concurrent load, satisfying the "Robustness" requirement.
- **Speed**: In-memory storage provides the lowest latency for ephemeral data.

## Design Decisions
- **Next.js App Router**: Used for its modern features, including Server Components which reduce client-side JavaScript and improve initial load performance.
- **Tailwind CSS**: For rapid, responsive, and maintainable UI development.
- **Sanitization**: React/Next.js handles basic XSS protection. No raw HTML is rendered from user input.
- **Deterministic Testing**: Support for `x-test-now-ms` header enables accurate testing of expiry logic.

## Deployment
This project is optimized for deployment on **Vercel**.
1. Push to GitHub.
2. Import project in Vercel.
3. Add the `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables (or create a Vercel KV store).
