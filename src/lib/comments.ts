/**
 * World of Mystery - Real User Comments & Replies System (Zero Mock Data)
 * Supports popular/latest sorting, interactive likes, and real D1 + local persistence.
 */

export interface CommentReply {
  id: string;
  commentId: string;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
  userLiked?: boolean;
}

export interface CommentItem {
  id: string;
  pinId: string;
  author: string;
  content: string;
  likes: number;
  isPopular?: boolean;
  roleBadge?: string;
  createdAt: string;
  userLiked?: boolean;
  replies?: CommentReply[];
}

const LOCAL_STORAGE_KEY = 'worldofmys_real_comments_v3';
const USER_LIKES_KEY = 'worldofmys_user_likes_v3';

// Purge legacy mock storage keys once
try {
  localStorage.removeItem('worldofmys_comments_v2');
  localStorage.removeItem('worldofmys_comments_v1');
} catch {
  // ignore
}

function getUserLikesSet(): Set<string> {
  try {
    const rawLikes = localStorage.getItem(USER_LIKES_KEY);
    if (rawLikes) return new Set(JSON.parse(rawLikes));
  } catch {
    // ignore
  }
  return new Set();
}

function sortComments(list: CommentItem[], sortMode: 'popular' | 'latest'): CommentItem[] {
  if (sortMode === 'popular') {
    return [...list].sort((a, b) => b.likes - a.likes);
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get all real comments for a pin from local storage, sorted by 'popular' or 'latest'.
 * Returns an empty array if no real user comments exist yet.
 */
export function getPinComments(
  pinId: string,
  _titleTh?: string,
  _category?: string,
  _provinceTh?: string,
  sortMode: 'popular' | 'latest' = 'popular'
): CommentItem[] {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {
    // ignore
  }

  const userLikes = getUserLikesSet();
  const list: CommentItem[] = (storedAll[pinId] || []).filter(
    (c) => !c.id.startsWith('seed-') && !c.id.startsWith('curated-')
  );

  const mapped = list.map((c) => ({
    ...c,
    userLiked: userLikes.has(c.id),
    replies: (c.replies || []).map((r) => ({
      ...r,
      userLiked: userLikes.has(r.id),
    })),
  }));

  return sortComments(mapped, sortMode);
}

/**
 * Fetch real comments for a pin from Cloudflare D1 and sync with local cache.
 */
export async function syncPinCommentsFromRemote(
  pinId: string,
  sortMode: 'popular' | 'latest' = 'popular'
): Promise<CommentItem[]> {
  try {
    const res = await fetch(`/api/pins/${encodeURIComponent(pinId)}/comments`);
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        const remoteItems: CommentItem[] = json.data
          .filter((r: any) => !String(r.id || '').startsWith('seed-') && !String(r.id || '').startsWith('curated-'))
          .map((r: any) => ({
            id: r.id,
            pinId: r.pin_id || pinId,
            author: r.author,
            content: r.content,
            likes: Number(r.likes || 0),
            isPopular: Number(r.likes || 0) >= 50,
            roleBadge: r.role_badge,
            createdAt: r.created_at || new Date().toISOString(),
            replies: Array.isArray(r.replies) ? r.replies : [],
          }));

        let storedAll: Record<string, CommentItem[]> = {};
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (raw) storedAll = JSON.parse(raw);
        } catch {
          // ignore
        }

        const localItems = (storedAll[pinId] || []).filter(
          (c) => !c.id.startsWith('seed-') && !c.id.startsWith('curated-')
        );
        const remoteIds = new Set(remoteItems.map((c) => c.id));
        const unsyncedLocal = localItems.filter((c) => !remoteIds.has(c.id));
        const merged = [...remoteItems, ...unsyncedLocal];

        storedAll[pinId] = merged;
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // offline fallback uses local real comments
  }

  return getPinComments(pinId, '', '', '', sortMode);
}

/**
 * Submit a new comment for a pin
 */
export function addPinComment(
  pinId: string,
  author: string,
  content: string,
  roleBadge = '👁️ พยานบอกเล่า'
): CommentItem {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {
    // ignore
  }

  const newComment: CommentItem = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pinId,
    author: author.trim() || 'ผู้สำรวจนิรนาม',
    content: content.trim(),
    likes: 1,
    roleBadge,
    createdAt: new Date().toISOString(),
    userLiked: true,
    replies: [],
  };

  const currentList = (storedAll[pinId] || []).filter(
    (c) => !c.id.startsWith('seed-') && !c.id.startsWith('curated-')
  );
  storedAll[pinId] = [newComment, ...currentList];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {
    // ignore
  }

  try {
    const set = getUserLikesSet();
    set.add(newComment.id);
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }

  fetch(`/api/pins/${encodeURIComponent(pinId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: newComment.id,
      author: newComment.author,
      content: newComment.content,
      roleBadge: newComment.roleBadge,
    }),
  }).catch(() => {});

  return newComment;
}

/**
 * Toggle like for a comment
 */
export function toggleCommentLike(pinId: string, commentId: string): { likes: number; userLiked: boolean } {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {
    // ignore
  }

  const userLikes = getUserLikesSet();
  const isLiked = userLikes.has(commentId);
  const nextLiked = !isLiked;

  if (nextLiked) {
    userLikes.add(commentId);
  } else {
    userLikes.delete(commentId);
  }

  try {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]));
  } catch {
    // ignore
  }

  let updatedLikes = 0;
  const list = storedAll[pinId] || [];
  storedAll[pinId] = list.map((c) => {
    if (c.id === commentId) {
      const delta = nextLiked ? 1 : -1;
      const count = Math.max(0, c.likes + delta);
      updatedLikes = count;
      return {
        ...c,
        likes: count,
        isPopular: count >= 50,
      };
    }
    return c;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {
    // ignore
  }

  if (nextLiked) {
    fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, { method: 'POST' }).catch(() => {});
  }

  return { likes: updatedLikes, userLiked: nextLiked };
}

/**
 * Add a reply to a comment
 */
export function addCommentReply(
  pinId: string,
  commentId: string,
  author: string,
  content: string
): CommentReply {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {
    // ignore
  }

  const newReply: CommentReply = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    commentId,
    author: author.trim() || 'ผู้ร่วมสนทนานิรนาม',
    content: content.trim(),
    likes: 0,
    createdAt: new Date().toISOString(),
    userLiked: false,
  };

  const currentList = storedAll[pinId] || [];
  storedAll[pinId] = currentList.map((c) => {
    if (c.id === commentId) {
      return {
        ...c,
        replies: [...(c.replies || []), newReply],
      };
    }
    return c;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {
    // ignore
  }

  fetch(`/api/comments/${encodeURIComponent(commentId)}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: newReply.id,
      pinId,
      author: newReply.author,
      content: newReply.content,
    }),
  }).catch(() => {});

  return newReply;
}

/**
 * Toggle like for a reply
 */
export function toggleReplyLike(
  pinId: string,
  commentId: string,
  replyId: string
): { likes: number; userLiked: boolean } {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {
    // ignore
  }

  const userLikes = getUserLikesSet();
  const isLiked = userLikes.has(replyId);
  const nextLiked = !isLiked;

  if (nextLiked) {
    userLikes.add(replyId);
  } else {
    userLikes.delete(replyId);
  }

  try {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]));
  } catch {
    // ignore
  }

  let updatedLikes = 0;
  const list = storedAll[pinId] || [];
  storedAll[pinId] = list.map((c) => {
    if (c.id === commentId && c.replies) {
      return {
        ...c,
        replies: c.replies.map((r) => {
          if (r.id === replyId) {
            const count = Math.max(0, r.likes + (nextLiked ? 1 : -1));
            updatedLikes = count;
            return { ...r, likes: count, userLiked: nextLiked };
          }
          return r;
        }),
      };
    }
    return c;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {
    // ignore
  }

  if (nextLiked) {
    fetch(`/api/replies/${encodeURIComponent(replyId)}/like`, { method: 'POST' }).catch(() => {});
  }

  return { likes: updatedLikes, userLiked: nextLiked };
}
