# Multimedia Verification & Safe Pin Ingestion Rules

This rule governs the creation, modification, enrichment, and database synchronization of all mystery and folklore pins in the Worldofmys platform.

## 1. Zero Placeholder Policy
- **No Dummy Paths**: Never insert pins into Cloudflare D1 (`ghost_pins`) or `src/data/seedData.ts` with placeholder or non-existent local paths (such as `/entities/pin-xxx.jpg`) unless the actual image file is physically verified in `public/entities/`.
- **No Repetitive Fallbacks**: Never assign duplicate stock photos across different pins in a batch. Each entity must have a distinct, contextual image representing its specific folklore.

## 2. Mandatory YouTube Embed & Thumbnail Validation
- **OEmbed Verification Required**: Every YouTube video URL added to `gallery_media` must return HTTP `200 OK` from `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<videoId>&format=json`.
- **No Dead Embeds**: If a video returns HTTP `404` or `401/403` (deleted, private, or blocked), it must NOT be saved. Search for an alternative authentic documentary or story immediately.
- **High-Resolution Thumbnail**: Use the verified video thumbnail (`https://i.ytimg.com/vi/<videoId>/hqdefault.jpg`) as `image_url` and in `gallery_media[0].url` to ensure high visual quality and 100% availability without 404 errors.

## 3. Pacing & Query Formatting for YouTube Searches
- **Rate-Limit Prevention**: Enforce a strict minimum delay of **1.8 to 2.2 seconds** between YouTube search requests.
- **High-Signal Search Queries**: Use concise, specific search queries rather than overly long sentences. E.g.:
  - Thai folklore: `ตำนาน <ชื่อเรื่อง> <จังหวัด/สถานที่>`
  - Japanese yokai: `<name> yokai`
  - Latin American lore: `<name> leyenda`
  - Western cryptids/urban legends: `<name> folklore documentary` or `<name> cryptid`

## 4. Safe Database Ingestion & Mutation
- **Complete Before Persisting**: Never push incomplete batch data (e.g. records containing unresolved `yt_query` or dummy images) to D1 via `POST /api/pins`. All media must be verified and resolved first.
- **Never Over-Purge Pins**: Never run broad deletions or purge database records assuming they are dirty simply because D1 row count exceeds a seed file. Always cross-check pin IDs against recent user requests and batch generation files (`mcp/batches/*.json`).
