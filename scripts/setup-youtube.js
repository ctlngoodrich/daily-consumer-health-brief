/**
 * setup-youtube.js
 *
 * One-time setup script: resolves YouTube handles → channel IDs using the
 * YouTube Data API v3, then saves them to youtube-handle-cache.json.
 *
 * Run once (or whenever you add a new company to feed-builders.json):
 *   node --env-file=../.env setup-youtube.js
 *
 * Requires YOUTUBE_API_KEY in .env.
 * Free quota: 10,000 units/day. Each handle lookup costs 1 unit.
 * Get a key: https://console.cloud.google.com → APIs & Services → YouTube Data API v3
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const CACHE_PATH = path.join(ROOT, 'youtube-handle-cache.json');
const buildersConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'feed-builders.json'), 'utf8'));

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('❌ YOUTUBE_API_KEY not set in .env');
  console.error('   Get a free key at: https://console.cloud.google.com');
  console.error('   Enable: YouTube Data API v3');
  process.exit(1);
}

async function resolveHandle(handle) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent('@' + handle)}&key=${API_KEY}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  if (data.items?.length > 0) return data.items[0].id;
  throw new Error(`No channel found for @${handle}`);
}

async function main() {
  // Load existing cache
  let cache = {};
  try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch {}

  const companies = buildersConfig.builders.filter(b => b.youtube_handle);
  if (companies.length === 0) {
    console.log('No youtube_handle entries found in feed-builders.json. Nothing to resolve.');
    process.exit(0);
  }

  console.log(`\nResolving ${companies.length} YouTube handle(s)...\n`);

  for (const company of companies) {
    const handle = company.youtube_handle;
    if (cache[handle]) {
      console.log(`  ✓ @${handle} → ${cache[handle]} (already cached)`);
      continue;
    }
    try {
      const channelId = await resolveHandle(handle);
      cache[handle] = channelId;
      console.log(`  ✓ @${handle} → ${channelId}`);
    } catch (err) {
      console.warn(`  ✗ @${handle}: ${err.message}`);
    }
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  console.log(`\n✅ Saved to youtube-handle-cache.json`);
  console.log('\nYou can now run generate-feed.js normally — YouTube channels will be fetched.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
