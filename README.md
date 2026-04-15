# Daily Consumer Health Brief

> Stay sharp on consumer health — without reading everything yourself.

A Claude Code skill that delivers a curated daily brief on consumer health news and builder insights — straight to your inbox, every morning.

---

## What You Get

**Section 1 — Daily News** (past 28h)
Curated signals from Fitt Insider, Out of Pocket, and Rock Health. Claude picks the 4–6 stories with the most strategic implication for builders and investors, with a tight 2–3 sentence summary per item.

**Section 2 — Builder Insight** (past 7 days)
What tracked consumer health founders published, said, or appeared in:

| Channel | What it finds |
|---|---|
| Owned podcasts | Latest episodes from Startup Health NOW, Huberman Lab, The Dr. Hyman Show |
| Owned newsletters | Health Tech Builders (Julia Yoo), The Focus with Mark Hyman, The Hemingway Report (Steve Duke) |
| Podcast Index API | Guest appearances by tracked builders across all indexed podcasts |
| Google News | Text interviews mentioning tracked builders |
| YouTube Data API | Interview videos featuring tracked builders |

**Tracked builders**: Tom Hale (Oura) · Will Ahmed (Whoop) · Joanna Strober (Midi Health) · Mark Hyman (Function Health) · Matteo Franceschetti (Eight Sleep)

---

## Install as a Claude Code Skill

The easiest way to use this is as a Claude Code skill — download and double-click to install.

**Option A — Install from file**

Download [`daily-health-brief.skill`](./daily-health-brief.skill) and double-click it. Claude Code will install it automatically.

**Option B — Install from GitHub**

```bash
/plugin install xxjaaa/daily-consumer-health-brief
```

Once installed, trigger it by typing `/daily-health-brief` in Claude Code.

---

## Self-Hosted Setup

To run the full pipeline (automated daily email via GitHub Actions), clone and configure the repo yourself.

### Prerequisites
- Node.js 18+
- A [Podcast Index API key](https://api.podcastindex.org) (free)
- A [YouTube Data API v3 key](https://console.cloud.google.com) (free)
- Optional: SMTP credentials for email delivery

### Install

```bash
git clone https://github.com/your-username/daily-consumer-health-brief
cd daily-consumer-health-brief

cp .env.example .env
# Fill in your API keys in .env

cd scripts && npm install
```

### One-time YouTube setup

Resolve YouTube channel handles to IDs (only needed once):

```bash
node --env-file=../.env setup-youtube.js
```

### Run manually

```bash
cd scripts
node --env-file=../.env generate-feed.js
node --env-file=../.env prepare-digest.js
```

Then ask Claude to generate the brief using the `SKILL.md` instructions.

### Schedule daily email delivery

The repo includes a GitHub Actions workflow that runs every day at 9:00 AM PT and emails you the brief automatically.

**Step 1 — Fork this repo**

Click **Fork** on `github.com/xxjaaa/daily-consumer-health-brief` to create your own copy.

**Step 2 — Add your secrets**

Go to your fork's **Settings → Secrets and variables → Actions → New repository secret** and add each of the following:

| Secret | How to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `PODCAST_INDEX_API_KEY` | [api.podcastindex.org](https://api.podcastindex.org) (free) |
| `PODCAST_INDEX_API_SECRET` | Same as above |
| `YOUTUBE_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) (free tier) |
| `EMAIL_TO` | Your email address |
| `EMAIL_FROM` | Your Gmail address |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Gmail App Password — generate at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (requires 2FA enabled) |

**Step 3 — Enable write permissions**

Go to **Settings → Actions → General → Workflow permissions** and select **Read and write permissions**. This lets the workflow save deduplication state between runs.

**Step 4 — Trigger the first run**

Go to **Actions → Daily Consumer Health Brief → Run workflow**. After the first successful run, it will fire automatically every day at 9:00 AM PT.

---

## Configuration

| What to change | Where |
|---|---|
| News sources | `feed-news.json` |
| Tracked builders + content types | `feed-builders.json` |
| Brief tone & format | `prompts/digest-intro.md` |
| Summarization style per section | `prompts/summarize-*.md` |
| Lookback windows | `.env` (`NEWS_LOOKBACK_HOURS`, `BUILDER_LOOKBACK_HOURS`) |
| Email delivery schedule | `.github/workflows/daily-brief.yml` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PODCAST_INDEX_API_KEY` | Yes | From [podcastindex.org](https://api.podcastindex.org) (free) |
| `PODCAST_INDEX_API_SECRET` | Yes | From [podcastindex.org](https://api.podcastindex.org) (free) |
| `YOUTUBE_API_KEY` | Yes | From [Google Cloud Console](https://console.cloud.google.com) (free tier) |
| `NEWS_LOOKBACK_HOURS` | No | Hours back to fetch news (default: 28) |
| `BUILDER_LOOKBACK_HOURS` | No | Hours back to fetch builder content (default: 168 = 7 days) |
| `EMAIL_TO` | Email only | Recipient address |
| `EMAIL_FROM` | Email only | Sender address |
| `SMTP_HOST` | Email only | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | Email only | e.g. `587` |
| `SMTP_USER` | Email only | SMTP username |
| `SMTP_PASS` | Email only | SMTP password / app password |

---

## Sources

**News**: Fitt Insider · Out of Pocket · Rock Health

**Builder Podcasts**: Startup Health NOW · Huberman Lab · The Dr. Hyman Show

**Builder Newsletters**: Health Tech Builders (Julia Yoo) · The Focus with Mark Hyman · The Hemingway Report (Steve Duke)

**Builder Insights via API**: Podcast Index · Google News · YouTube Data API

---

## License

MIT
