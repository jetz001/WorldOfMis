import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB?: D1Database;
  MEDIA_BUCKET?: R2Bucket;
  JWT_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// CORS / Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'worldofmys-cf-worker' }));

// 1. Get all published pins
app.get('/pins', async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: 'D1 Database not bound' }, 500);
  }

  try {
    const { results } = await db
      .prepare('SELECT * FROM ghost_pins ORDER BY views_count DESC')
      .all();
    const formatted = results.map((r: any) => {
      let gallery_media = [];
      if (r.gallery_media) {
        try {
          gallery_media = typeof r.gallery_media === 'string' ? JSON.parse(r.gallery_media) : r.gallery_media;
        } catch {}
      }
      return { ...r, gallery_media };
    });
    return c.json({ success: true, data: formatted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 500);
  }
});

// 2. Get single pin & increment views
app.get('/pins/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);

  try {
    await db.prepare('UPDATE ghost_pins SET views_count = views_count + 1 WHERE id = ?').bind(id).run();
    const pin = (await db.prepare('SELECT * FROM ghost_pins WHERE id = ?').bind(id).first()) as any;
    if (!pin) return c.json({ error: 'Pin not found' }, 404);
    let gallery_media = [];
    if (pin.gallery_media) {
      try {
        gallery_media = typeof pin.gallery_media === 'string' ? JSON.parse(pin.gallery_media) : pin.gallery_media;
      } catch {}
    }
    return c.json({ success: true, data: { ...pin, gallery_media } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 500);
  }
});

// 2.1 Get comments for a pin
app.get('/pins/:id/comments', async (c) => {
  const db = c.env.DB;
  const pinId = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    const { results } = await db
      .prepare('SELECT * FROM pin_comments WHERE pin_id = ? ORDER BY likes DESC, created_at DESC')
      .bind(pinId)
      .all();
    return c.json({ success: true, data: results });
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 2.2 Add comment to a pin
app.post('/pins/:id/comments', async (c) => {
  const db = c.env.DB;
  const pinId = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    const body = await c.req.json();
    const id = body.id || 'cmt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const author = (body.author || 'ผู้สำรวจนิรนาม').trim();
    const content = (body.content || '').trim();
    const roleBadge = body.roleBadge || 'พยานบอกเล่า';
    if (!content) return c.json({ success: false, error: 'Content required' }, 400);
    await db
      .prepare('INSERT INTO pin_comments (id, pin_id, author, content, likes, is_popular, role_badge) VALUES (?, ?, ?, ?, 0, 0, ?)')
      .bind(id, pinId, author, content, roleBadge)
      .run();
    return c.json({ success: true, data: { id, pin_id: pinId, author, content, likes: 0, is_popular: 0, role_badge: roleBadge, created_at: new Date().toISOString() } }, 201);
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 2.3 Add reply to a comment
app.post('/comments/:id/reply', async (c) => {
  const db = c.env.DB;
  const commentId = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    const body = await c.req.json();
    const id = body.id || 'rep-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const author = (body.author || 'ผู้สำรวจนิรนาม').trim();
    const content = (body.content || '').trim();
    const pinId = body.pinId || '';
    if (!content) return c.json({ success: false, error: 'Content required' }, 400);
    await db
      .prepare('INSERT INTO comment_replies (id, comment_id, pin_id, author, content, likes) VALUES (?, ?, ?, ?, ?, 0)')
      .bind(id, commentId, pinId, author, content)
      .run();
    return c.json({ success: true, data: { id, comment_id: commentId, pin_id: pinId, author, content, likes: 0, created_at: new Date().toISOString() } }, 201);
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 2.4 Like a reply
app.post('/replies/:id/like', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    await db.prepare('UPDATE comment_replies SET likes = likes + 1 WHERE id = ?').bind(id).run();
    const rep = await db.prepare('SELECT * FROM comment_replies WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: rep });
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 2.3 Upvote comment
app.post('/comments/:id/like', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    await db.prepare('UPDATE pin_comments SET likes = likes + 1 WHERE id = ?').bind(id).run();
    const cmt = await db.prepare('SELECT * FROM pin_comments WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: cmt });
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 2.5 World Comments (Global Fountain Shoutbox)
app.get('/world-comments', async (c) => {
  const db = c.env.DB;
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    await db
      .prepare(
        'CREATE TABLE IF NOT EXISTS world_comments (id TEXT PRIMARY KEY, author TEXT NOT NULL, content TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
      )
      .run();
    const { results } = await db
      .prepare('SELECT * FROM world_comments ORDER BY created_at DESC LIMIT 40')
      .all();
    return c.json({ success: true, data: results });
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

app.post('/world-comments', async (c) => {
  const db = c.env.DB;
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);
  try {
    await db
      .prepare(
        'CREATE TABLE IF NOT EXISTS world_comments (id TEXT PRIMARY KEY, author TEXT NOT NULL, content TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
      )
      .run();
    const body = await c.req.json();
    const author = String(body.author || 'ผู้สำรวจโลก').trim().slice(0, 32);
    const content = String(body.content || '').trim().slice(0, 140);
    if (!content) {
      return c.json({ success: false, error: 'Content required' }, 400);
    }
    const id = 'wcmt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    await db
      .prepare('INSERT INTO world_comments (id, author, content) VALUES (?, ?, ?)')
      .bind(id, author, content)
      .run();
    return c.json(
      {
        success: true,
        data: { id, author, content, created_at: new Date().toISOString() },
      },
      201
    );
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

// 3. Create pin
app.post('/pins', async (c) => {
  const db = c.env.DB;
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);

  try {
    const body = await c.req.json();
    const id = body.id || `pin-${Date.now()}`;

    await db
      .prepare(`
        INSERT INTO ghost_pins (
          id, title_th, title_en, category, province_th, province_en,
          district_th, district_en, lat, lng, story_th, story_en,
          folklore_history_th, folklore_history_en, image_url, audio_url, gallery_media,
          sound_preset, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        body.title_th,
        body.title_en,
        body.category,
        body.province_th,
        body.province_en,
        body.district_th || '',
        body.district_en || '',
        body.lat,
        body.lng,
        body.story_th,
        body.story_en,
        body.folklore_history_th || '',
        body.folklore_history_en || '',
        body.image_url || '',
        body.audio_url || '',
        body.gallery_media ? JSON.stringify(body.gallery_media) : '[]',
        body.sound_preset || 'whisper',
        body.is_published ?? 1
      )
      .run();

    return c.json({ success: true, id }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 500);
  }
});

// 4. Update pin
app.put('/pins/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);

  try {
    const body = await c.req.json();
    await db
      .prepare(`
        UPDATE ghost_pins SET
          title_th = ?, title_en = ?, category = ?, province_th = ?, province_en = ?,
          district_th = ?, district_en = ?, lat = ?, lng = ?, story_th = ?, story_en = ?,
          folklore_history_th = ?, folklore_history_en = ?, image_url = ?, audio_url = ?, gallery_media = ?,
          sound_preset = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        body.title_th,
        body.title_en,
        body.category,
        body.province_th,
        body.province_en,
        body.district_th || '',
        body.district_en || '',
        body.lat,
        body.lng,
        body.story_th,
        body.story_en,
        body.folklore_history_th || '',
        body.folklore_history_en || '',
        body.image_url || '',
        body.audio_url || '',
        body.gallery_media ? JSON.stringify(body.gallery_media) : '[]',
        body.sound_preset || 'whisper',
        body.is_published ?? 1,
        id
      )
      .run();

    return c.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 500);
  }
});

// 5. Delete pin
app.delete('/pins/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  if (!db) return c.json({ error: 'D1 Database not bound' }, 500);

  try {
    await db.prepare('DELETE FROM ghost_pins WHERE id = ?').bind(id).run();
    return c.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 500);
  }
});

// 6. Admin Login
app.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  if (username === 'admin' && (password === 'password123' || password === 'admin')) {
    return c.json({ success: true, token: 'session_token_ok', user: { username: 'admin' } });
  }
  return c.json({ success: false, error: 'Invalid credentials' }, 401);
});

// 7. Cloudflare R2 Upload
app.post('/upload', async (c) => {
  const bucket = c.env.MEDIA_BUCKET;
  if (!bucket) {
    return c.json({ error: 'Cloudflare R2 Bucket not bound' }, 500);
  }

  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ success: true, key, url: `/api/media/${key}` });
});

// 7.1 Serve Cloudflare R2 Media directly
app.get('/media/:key', async (c) => {
  const bucket = c.env.MEDIA_BUCKET;
  if (!bucket) {
    return c.text('Cloudflare R2 Bucket not bound', 500);
  }
  const key = c.req.param('key');
  const object = await bucket.get(key);
  if (!object) {
    return c.text('Media not found in R2', 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
});

// 8. RAG Vector Semantic Search API
app.post('/rag-search', async (c) => {
  const db = c.env.DB;
  const { query = '' } = await c.req.json<{ query?: string }>();
  if (!db) {
    return c.json({ error: 'D1 Database not bound' }, 500);
  }
  const q = `%${query.trim()}%`;
  const { results } = await db
    .prepare(
      `SELECT * FROM ghost_pins
       WHERE title_th LIKE ? OR title_en LIKE ?
          OR province_th LIKE ? OR province_en LIKE ?
          OR story_th LIKE ? OR story_en LIKE ?
          OR folklore_history_th LIKE ? OR folklore_history_en LIKE ?
       ORDER BY views_count DESC LIMIT 20`
    )
    .bind(q, q, q, q, q, q, q, q)
    .all();

  return c.json({ success: true, query, data: results });
});

export const onRequest = handle(app);
