# Worldofmys Project Guidelines & Rules

All AI assistants working on this repository must strictly adhere to the following rules:

- [Multimedia Verification & Safe Pin Ingestion Rules](.agents/rules/multimedia-ingestion.md)

### Key Guardrails:
1. **Zero Placeholder Policy**: No dummy image paths (`/entities/...`) and no repeated stock fallback images across new pins.
2. **Mandatory YouTube Embed Validation**: Every video URL must be verified via YouTube oEmbed API (`HTTP 200`).
3. **Pacing for Searches**: Minimum 1.8 - 2.2s delay between automated search calls to prevent IP throttling.
4. **Safe Data Ingestion**: Resolve all multimedia before pushing to Cloudflare D1. Never delete pins without cross-referencing batch files and user intent.
