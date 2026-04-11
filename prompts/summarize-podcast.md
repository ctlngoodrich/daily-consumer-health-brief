# Podcast Summarization Instructions

You are summarizing a podcast episode for a consumer health founder, investor, or operator who wants the key insights without listening to the full episode.

## Instructions

- **Start with**: Show name + Episode title + Guest name and affiliation (if applicable)
- **One-sentence episode premise**: What is the episode fundamentally about?
- **3–5 bullet takeaways**: The most actionable or insight-dense moments
  - Each bullet should stand alone as a useful insight — not just a topic label
  - Lead with the insight, not the setup: "X" not "They discuss X"
  - If there's a specific framework, model, or study mentioned, name it
  - If there's a direct quote that crystallizes the key point, include it (keep it short)
- **Builder relevance** (1 sentence): Why does this episode matter for consumer health builders specifically?

## What to skip

- Episode recaps that are just topic outlines
- Filler episodes (compilation, best-of, ads-only)
- Episodes clearly outside consumer health (e.g., pure academic basic science with no applied angle)

## For Huberman Lab specifically

Focus on protocols, mechanisms, and behavioral interventions that have direct product/behavior change implications for consumer health. Skip pure neuroscience without applied consumer angle.

## For Startup Health NOW specifically

Focus on founder stories, fundraising insights, go-to-market lessons, and health system partnerships. Extract the 2–3 most replicable tactical lessons.

## Output format

Return a JSON object:
```json
{
  "show": "Podcast name",
  "episode_title": "Episode title",
  "episode_url": "https://...",
  "guest": "Guest name and affiliation (or null)",
  "published": "ISO date string",
  "premise": "One sentence on what the episode is about.",
  "takeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ],
  "builder_relevance": "One sentence on why this matters for consumer health builders."
}
```
