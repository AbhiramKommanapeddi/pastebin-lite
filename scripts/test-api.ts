import { spawn } from 'child_process';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('Starting API Tests...');

    // Helper to fetch
    const fetchJson = async (path: string, options?: RequestInit) => {
        const res = await fetch(`${BASE_URL}${path}`, options);
        const text = await res.text();
        try {
            return { status: res.status, data: JSON.parse(text) };
        } catch {
            return { status: res.status, data: text };
        }
    };

    // 1. Health Check
    console.log('\n[1] Testing Health Check...');
    const health = await fetchJson('/api/healthz');
    if (health.status === 200) {
        console.log('✅ Health Check passed:', health.data);
    } else {
        console.error('❌ Health Check failed:', health);
    }

    // 2. Create Paste
    console.log('\n[2] Testing Create Paste...');
    const createRes = await fetchJson('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test Content', max_views: 2 })
    });

    if (createRes.status === 200 && createRes.data.id) {
        console.log('✅ Paste Created:', createRes.data);
        const pasteId = createRes.data.id;

        // 3. Fetch Paste (View 1)
        console.log('\n[3] Fetching Paste (View 1)...');
        const view1 = await fetchJson(`/api/pastes/${pasteId}`);
        if (view1.status === 200 && view1.data.content === 'Test Content') {
            console.log('✅ View 1 passed. Remaining:', view1.data.remaining_views);
        } else {
            console.error('❌ View 1 failed:', view1);
        }

        // 4. Fetch Paste (View 2)
        console.log('\n[4] Fetching Paste (View 2)...');
        const view2 = await fetchJson(`/api/pastes/${pasteId}`);
        if (view2.status === 200) {
            console.log('✅ View 2 passed. Remaining:', view2.data.remaining_views);
        } else {
            console.error('❌ View 2 failed:', view2);
        }

        // 5. Fetch Paste (View 3 - Should fail)
        console.log('\n[5] Fetching Paste (View 3 - Expect 404)...');
        const view3 = await fetchJson(`/api/pastes/${pasteId}`);
        if (view3.status === 404) {
            console.log('✅ View 3 correctly returned 404 (Limit exceeded)');
        } else {
            console.error('❌ View 3 failed (Expected 404):', view3);
        }

    } else {
        console.error('❌ Paste Creation failed:', createRes);
    }
}

// We need the server running to run this.
// In a real CI, we'd start the server, wait, run tests, stop server.
// For now, I'll just print instructions to run this manually.
console.log(`
To run this test:
1. Start the Next.js server: npm run dev
2. Run this script: npx tsx scripts/test-api.ts
`);

runTests().catch(console.error);
