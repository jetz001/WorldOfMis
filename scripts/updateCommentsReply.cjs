const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'lib', 'comments.ts');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Add CommentReply interface
const interfaceCode = `export interface CommentReply {
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
}`;

code = code.replace(
  /export interface CommentItem \{[\s\S]*?\}/,
  interfaceCode
);

// 2. Add sample seed replies in generateProceduralComments
const proceduralTarget = `return [
    {
      id: \`seed-\${pinId}-1\`,
      pinId,
      author: w1.name,
      content: texts[0],
      likes: likes1,
      isPopular: true,
      roleBadge: '🔥 ยอดนิยม',
      createdAt: new Date(Date.now() - 3600000 * ((seed % 12) + 2)).toISOString(),
    },
    {
      id: \`seed-\${pinId}-2\`,
      pinId,
      author: w2.name,
      content: texts[1],
      likes: likes2,
      isPopular: false,
      roleBadge: w2.role,
      createdAt: new Date(Date.now() - 3600000 * ((seed % 36) + 14)).toISOString(),
    },
  ];`;

const proceduralReplacement = `return [
    {
      id: \`seed-\${pinId}-1\`,
      pinId,
      author: w1.name,
      content: texts[0],
      likes: likes1,
      isPopular: true,
      roleBadge: '🔥 ยอดนิยม',
      createdAt: new Date(Date.now() - 3600000 * ((seed % 12) + 2)).toISOString(),
      replies: [
        {
          id: \`rep-\${pinId}-1-1\`,
          commentId: \`seed-\${pinId}-1\`,
          author: 'นักสำรวจดึกดำบรรพ์',
          content: 'เห็นด้วยเลยครับ เคยเดินทางไปสำรวจแถบนั้น บรรยากาศช่วงโพล้เพล้ชวนขนลุกจริงๆ',
          likes: 12,
          createdAt: new Date(Date.now() - 3600000 * ((seed % 12) + 1)).toISOString(),
        }
      ]
    },
    {
      id: \`seed-\${pinId}-2\`,
      pinId,
      author: w2.name,
      content: texts[1],
      likes: likes2,
      isPopular: false,
      roleBadge: w2.role,
      createdAt: new Date(Date.now() - 3600000 * ((seed % 36) + 14)).toISOString(),
      replies: []
    },
  ];`;

code = code.replace(proceduralTarget, proceduralReplacement);

// 3. Add addCommentReply and toggleReplyLike functions
const replyFunctions = `
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
  } catch {}

  const newReply: CommentReply = {
    id: \`rep-\${Date.now()}-\${Math.random().toString(36).slice(2, 6)}\`,
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
  } catch {}

  // Sync to remote API
  fetch(\`/api/comments/\${encodeURIComponent(commentId)}/reply\`, {
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
  } catch {}

  let userLikes: Set<string> = new Set();
  try {
    const rawLikes = localStorage.getItem(USER_LIKES_KEY);
    if (rawLikes) userLikes = new Set(JSON.parse(rawLikes));
  } catch {}

  const isLiked = userLikes.has(replyId);
  const nextLiked = !isLiked;

  if (nextLiked) {
    userLikes.add(replyId);
  } else {
    userLikes.delete(replyId);
  }

  try {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]));
  } catch {}

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
  } catch {}

  if (nextLiked) {
    fetch(\`/api/replies/\${encodeURIComponent(replyId)}/like\`, { method: 'POST' }).catch(() => {});
  }

  return { likes: updatedLikes, userLiked: nextLiked };
}
`;

if (!code.includes('addCommentReply')) {
  code += replyFunctions;
}

fs.writeFileSync(targetPath, code);
console.log('Updated comments.ts with reply system!');
