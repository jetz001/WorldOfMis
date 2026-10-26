#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SEED_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'seedData.ts');

/**
 * Direct YouTube Search without any API Key
 * Queries YouTube web search and parses ytInitialData JSON payload.
 */
function searchYouTube(query, limit = 5) {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'th,en-US;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
          if (!match) return resolve([]);
          const data = JSON.parse(match[1]);
          const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
          const results = [];
          for (const item of contents) {
            const v = item.videoRenderer;
            if (v && v.videoId) {
              results.push({
                videoId: v.videoId,
                url: `https://www.youtube.com/watch?v=${v.videoId}`,
                title: v.title?.runs?.[0]?.text || '',
                channel: v.ownerText?.runs?.[0]?.text || '',
                views: v.shortViewCountText?.simpleText || '',
                duration: v.lengthText?.simpleText || '',
                thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
              });
            }
          }
          resolve(results.slice(0, limit));
        } catch (e) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve([]);
    });
  });
}

function loadPins() {
  if (!fs.existsSync(SEED_FILE)) {
    throw new Error(`Seed file not found: ${SEED_FILE}`);
  }
  const content = fs.readFileSync(SEED_FILE, 'utf8');
  const match = content.match(/export const INITIAL_GHOST_PINS: GhostPin\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Failed to parse INITIAL_GHOST_PINS from seedData.ts');
  }
  return JSON.parse(match[1]);
}

function savePins(pins) {
  const formatted = JSON.stringify(pins, null, 2);
  const updatedCode = `import type { GhostPin } from '../types/ghost';\n\nexport const INITIAL_GHOST_PINS: GhostPin[] = ${formatted};\n`;
  fs.writeFileSync(SEED_FILE, updatedCode, 'utf8');

  // Bump STORAGE_KEY in src/lib/api.ts to invalidate outdated client cache
  const apiFile = path.join(PROJECT_ROOT, 'src', 'lib', 'api.ts');
  if (fs.existsSync(apiFile)) {
    let apiCode = fs.readFileSync(apiFile, 'utf8');
    const keyMatch = apiCode.match(/const STORAGE_KEY = 'worldofmys_pins_v(\d+)';/);
    if (keyMatch) {
      const nextVer = Number(keyMatch[1]) + 1;
      apiCode = apiCode.replace(keyMatch[0], `const STORAGE_KEY = 'worldofmys_pins_v${nextVer}';`);
      fs.writeFileSync(apiFile, apiCode, 'utf8');
    }
  }
}

// Tool definitions for AI
const TOOLS = [
  {
    name: 'worldofmys_list_pins',
    description: 'List folklore and paranormal mystery pins from Worldofmys with optional filtering by category, search keyword, or pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['all', 'ghost', 'monster', 'curse', 'sacred', 'legend'],
          description: 'Filter by category (ghost, monster, curse, sacred, legend)'
        },
        search: {
          type: 'string',
          description: 'Search query in Thai or English (title, location, lore)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of pins to return (default 20, max 100)'
        },
        offset: {
          type: 'number',
          description: 'Pagination offset'
        }
      }
    }
  },
  {
    name: 'worldofmys_get_pin',
    description: 'Retrieve full details of a specific folklore pin by its ID (e.g. "pin-kuchisake", "pin-lochness").',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The unique pin ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'worldofmys_add_pin',
    description: 'Add a new folklore/paranormal mystery pin into Worldofmys with story, coordinates, YouTube video, and survival taboos.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique ID (e.g. "pin-pret-suthat"). If omitted, generated automatically.'
        },
        title_th: {
          type: 'string',
          description: 'Thai title of the folklore entity/mystery'
        },
        title_en: {
          type: 'string',
          description: 'English title of the folklore entity/mystery'
        },
        category: {
          type: 'string',
          enum: ['ghost', 'monster', 'curse', 'sacred', 'legend'],
          description: 'Folklore category'
        },
        province_th: {
          type: 'string',
          description: 'Province/Country in Thai (e.g. "กรุงเทพมหานคร (ไทย)", "ไฮแลนด์ (สกอตแลนด์)")'
        },
        province_en: {
          type: 'string',
          description: 'Province/Country in English (e.g. "Bangkok (Thailand)", "Highlands (Scotland, UK)")'
        },
        district_th: {
          type: 'string',
          description: 'District/City in Thai'
        },
        district_en: {
          type: 'string',
          description: 'District/City in English'
        },
        lat: {
          type: 'number',
          description: 'Latitude coordinate (-90 to 90)'
        },
        lng: {
          type: 'number',
          description: 'Longitude coordinate (-180 to 180)'
        },
        story_th: {
          type: 'string',
          description: 'Atmospheric lore/story in Thai'
        },
        story_en: {
          type: 'string',
          description: 'Atmospheric lore/story in English'
        },
        folklore_history_th: {
          type: 'string',
          description: 'Historical records, origin, cultural context in Thai'
        },
        folklore_history_en: {
          type: 'string',
          description: 'Historical records, origin, cultural context in English'
        },
        taboos_th: {
          type: 'string',
          description: 'Taboos & survival rules in Thai (1 rule per line)'
        },
        taboos_en: {
          type: 'string',
          description: 'Taboos & survival rules in English (1 rule per line)'
        },
        image_url: {
          type: 'string',
          description: 'URL of primary image or local entity image path (/entities/xxx.jpg)'
        },
        youtube_url: {
          type: 'string',
          description: 'YouTube video URL for documentary/story lore (e.g. "https://www.youtube.com/watch?v=...")'
        },
        youtube_title: {
          type: 'string',
          description: 'Title of the YouTube video'
        },
        sound_preset: {
          type: 'string',
          enum: ['whisper', 'water_spirit', 'jungle_curse', 'temple_bell', 'creepy_wind'],
          description: 'Atmospheric audio preset (default: whisper)'
        }
      },
      required: ['title_th', 'title_en', 'category', 'province_th', 'province_en', 'lat', 'lng', 'story_th', 'story_en']
    }
  },
  {
    name: 'worldofmys_update_pin',
    description: 'Update fields, media, coordinates, or lore of an existing pin in Worldofmys.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the pin to update'
        },
        updates: {
          type: 'object',
          description: 'Object containing fields to update (title_th, story_th, taboos_th, lat, lng, gallery_media, image_url, etc.)'
        }
      },
      required: ['id', 'updates']
    }
  },
  {
    name: 'worldofmys_delete_pin',
    description: 'Delete a pin by ID from Worldofmys.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the pin to delete'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'worldofmys_search_youtube',
    description: 'Search YouTube videos for any query WITHOUT ANY API KEY. Returns video ID, title, URL, channel name, views, duration, and thumbnail.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword (e.g. "ผีกระสือ หลอนไดอารี่", "Loch Ness monster documentary")'
        },
        limit: {
          type: 'number',
          description: 'Max number of results (default 5, max 15)'
        }
      },
      required: ['query']
    }
  }
];

async function handleToolCall(name, args) {
  if (name === 'worldofmys_search_youtube') {
    if (!args.query) {
      throw new Error('Missing required argument: query');
    }
    const limit = Math.min(Number(args.limit) || 5, 15);
    const videos = await searchYouTube(args.query, limit);
    return {
      query: args.query,
      count: videos.length,
      videos
    };
  }

  const pins = loadPins();

  switch (name) {
    case 'worldofmys_list_pins': {
      let filtered = pins;
      if (args.category && args.category !== 'all') {
        filtered = filtered.filter(p => p.category === args.category);
      }
      if (args.search) {
        const q = args.search.toLowerCase();
        filtered = filtered.filter(p =>
          (p.title_th && p.title_th.toLowerCase().includes(q)) ||
          (p.title_en && p.title_en.toLowerCase().includes(q)) ||
          (p.province_th && p.province_th.toLowerCase().includes(q)) ||
          (p.province_en && p.province_en.toLowerCase().includes(q)) ||
          (p.story_th && p.story_th.toLowerCase().includes(q)) ||
          (p.story_en && p.story_en.toLowerCase().includes(q))
        );
      }
      const total = filtered.length;
      const offset = Number(args.offset) || 0;
      const limit = Math.min(Number(args.limit) || 20, 100);
      const results = filtered.slice(offset, offset + limit).map(p => ({
        id: p.id,
        title_th: p.title_th,
        title_en: p.title_en,
        category: p.category,
        province_th: p.province_th,
        province_en: p.province_en,
        lat: p.lat,
        lng: p.lng,
        has_image: Boolean(p.image_url),
        media_count: p.gallery_media?.length || 0,
        has_youtube: Boolean(p.gallery_media?.some(m => m.type === 'youtube'))
      }));

      return {
        total,
        offset,
        limit,
        pins: results
      };
    }

    case 'worldofmys_get_pin': {
      const pin = pins.find(p => p.id === args.id);
      if (!pin) {
        throw new Error(`Pin with id "${args.id}" not found.`);
      }
      return pin;
    }

    case 'worldofmys_add_pin': {
      const id = args.id || `pin-${Date.now().toString(36)}`;
      if (pins.some(p => p.id === id)) {
        throw new Error(`A pin with id "${id}" already exists.`);
      }

      const gallery_media = [];
      const primaryImg = args.image_url || `/entities/${id}.jpg`;
      gallery_media.push({
        type: 'image',
        url: primaryImg,
        title: args.title_th
      });

      if (args.youtube_url) {
        gallery_media.push({
          type: 'youtube',
          url: args.youtube_url,
          title: args.youtube_title || args.title_th,
          thumbnail: primaryImg
        });
      }

      const newPin = {
        id,
        title_th: args.title_th,
        title_en: args.title_en,
        category: args.category,
        province_th: args.province_th,
        province_en: args.province_en,
        district_th: args.district_th || '',
        district_en: args.district_en || '',
        lat: Number(args.lat),
        lng: Number(args.lng),
        story_th: args.story_th,
        story_en: args.story_en,
        folklore_history_th: args.folklore_history_th || '',
        folklore_history_en: args.folklore_history_en || '',
        taboos_th: args.taboos_th || '',
        taboos_en: args.taboos_en || '',
        image_url: primaryImg,
        sound_preset: args.sound_preset || 'whisper',
        views_count: 0,
        gallery_media,
        is_published: 1
      };

      pins.push(newPin);
      savePins(pins);

      return {
        success: true,
        message: `Successfully created pin "${newPin.title_th}" (${id})`,
        pin: newPin,
        total_pins: pins.length
      };
    }

    case 'worldofmys_update_pin': {
      const idx = pins.findIndex(p => p.id === args.id);
      if (idx === -1) {
        throw new Error(`Pin with id "${args.id}" not found.`);
      }

      pins[idx] = {
        ...pins[idx],
        ...args.updates,
        id: args.id // immutable id
      };

      savePins(pins);
      return {
        success: true,
        message: `Successfully updated pin ${args.id}`,
        pin: pins[idx]
      };
    }

    case 'worldofmys_delete_pin': {
      const initialLen = pins.length;
      const updated = pins.filter(p => p.id !== args.id);
      if (updated.length === initialLen) {
        throw new Error(`Pin with id "${args.id}" not found.`);
      }
      savePins(updated);
      return {
        success: true,
        message: `Successfully deleted pin ${args.id}`,
        remaining_pins: updated.length
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC 2.0 Stdio Handler
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  let req;
  try {
    req = JSON.parse(line);
  } catch (err) {
    return;
  }

  const { id, method, params } = req;

  // Handle Notifications (no response needed)
  if (!id && method) {
    return;
  }

  if (method === 'initialize') {
    const res = {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'worldofmys-folklore-mcp',
          version: '1.0.0'
        }
      }
    };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (method === 'ping') {
    const res = { jsonrpc: '2.0', id, result: {} };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (method === 'tools/list') {
    const res = {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (method === 'tools/call') {
    try {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const output = await handleToolCall(toolName, toolArgs);
      const res = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: typeof output === 'string' ? output : JSON.stringify(output, null, 2)
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(res) + '\n');
    } catch (err) {
      const res = {
        jsonrpc: '2.0',
        id,
        result: {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Error executing tool: ${err.message}`
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(res) + '\n');
    }
    return;
  }

  // Fallback for unknown methods
  const res = {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`
    }
  };
  process.stdout.write(JSON.stringify(res) + '\n');
});
