import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Flame,
  Clock,
  Heart,
  Send,
  CornerDownRight,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import {
  getPinComments,
  syncPinCommentsFromRemote,
  addPinComment,
  toggleCommentLike,
  addCommentReply,
  toggleReplyLike,
  type CommentItem,
} from '../../lib/comments';

interface CommentsPanelProps {
  pin: GhostPin;
  language: SupportedLanguage;
  onClose?: () => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  pin,
  language,
}) => {
  const [sortMode, setSortMode] = useState<'popular' | 'latest'>('popular');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply States
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Load comments whenever pin or sortMode changes
  const loadComments = useCallback(() => {
    const list = getPinComments(
      pin.id,
      pin.title_th,
      pin.category,
      pin.province_th,
      sortMode
    );
    setComments(list);

    syncPinCommentsFromRemote(pin.id, sortMode).then((remoteList) => {
      setComments(remoteList);
    });
  }, [pin, sortMode]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Handle Like on Comment
  const handleLike = (commentId: string) => {
    const res = toggleCommentLike(pin.id, commentId);
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes: res.likes, userLiked: res.userLiked }
          : c
      )
    );
  };

  // Toggle Reply Box for a Comment
  const handleToggleReplyBox = (commentId: string) => {
    if (replyingCommentId === commentId) {
      setReplyingCommentId(null);
    } else {
      setReplyingCommentId(commentId);
      setReplyContent('');
      if (!replyAuthor && authorName) {
        setReplyAuthor(authorName);
      }
    }
  };

  // Submit Reply to Comment
  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);

    const author =
      replyAuthor.trim() ||
      authorName.trim() ||
      (language === 'th' ? 'ผู้สำรวจนิรนาม' : 'Anonymous Explorer');

    const newReply = addCommentReply(pin.id, commentId, author, replyContent.trim());

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      )
    );

    setReplyContent('');
    setReplyingCommentId(null);
    setIsSubmittingReply(false);
  };

  // Handle Like on Reply
  const handleReplyLike = (commentId: string, replyId: string) => {
    const res = toggleReplyLike(pin.id, commentId, replyId);
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === replyId
                ? { ...r, likes: res.likes, userLiked: res.userLiked }
                : r
            ),
          };
        }
        return c;
      })
    );
  };

  // Handle Main Comment Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const newCmt = addPinComment(
      pin.id,
      authorName || (language === 'th' ? 'ผู้สำรวจนิรนาม' : 'Anonymous Explorer'),
      commentText
    );

    setCommentText('');
    setIsSubmitting(false);

    if (sortMode === 'latest') {
      setComments((prev) => [newCmt, ...prev]);
    } else {
      loadComments();
    }
  };

  // Total likes across this pin's comments & replies
  const totalLikes = useMemo(
    () =>
      comments.reduce(
        (sum, c) =>
          sum + c.likes + (c.replies ? c.replies.reduce((rSum, r) => rSum + r.likes, 0) : 0),
        0
      ),
    [comments]
  );

  return (
    <div className="relative flex flex-col h-full bg-parchment-sheet border-r-2 border-[#5a3818] shadow-[20px_0_50px_rgba(0,0,0,0.35)] overflow-hidden select-none text-[#22140a] font-parchment">
      {/* Occult ambient subtle warm glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(217, 119, 6, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative px-5 pt-5 pb-3.5 border-b-2 border-[#6d411b]/40 bg-[#f4ebd5]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#dfcaa8] border border-[#8b5a2b] text-[#3d2008] shadow-sm">
              <MessageSquare className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1a0f05] leading-tight">
                {language === 'th' ? 'บันทึกคำบอกเล่า & พยาน' : 'Eyewitness & Theories'}
              </h3>
              <p className="text-[10.5px] text-[#6b4728] font-mono tracking-wide">
                {comments.length} {language === 'th' ? 'บันทึก' : 'records'} • {totalLikes}{' '}
                {language === 'th' ? 'ถูกใจ' : 'likes'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Popular (🔥 ยอดนิยม) vs Latest (🕒 ล่าสุด) */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#eadbbd]/90 border border-[#8b5a2b]/60 text-xs">
          <button
            type="button"
            onClick={() => setSortMode('popular')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              sortMode === 'popular'
                ? 'bg-[#fbf5e8] text-[#3d2008] border border-[#8b5a2b] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                sortMode === 'popular' ? 'text-amber-600' : 'text-stone-500'
              }`}
            />
            <span>{language === 'th' ? '🔥 ยอดนิยม' : '🔥 Popular'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSortMode('latest')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              sortMode === 'latest'
                ? 'bg-[#fbf5e8] text-[#3d2008] border border-[#8b5a2b] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Clock
              className={`w-3.5 h-3.5 ${
                sortMode === 'latest' ? 'text-emerald-700' : 'text-stone-500'
              }`}
            />
            <span>{language === 'th' ? '🕒 ล่าสุด' : '🕒 Latest'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Comments List */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-stone-300">
        {comments.length === 0 ? (
          <div className="text-center py-12 px-4 text-stone-500">
            <MessageSquare className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="text-xs">
              {language === 'th'
                ? 'ยังไม่มีบันทึกคำบอกเล่า ร่วมเป็นคนแรกที่บันทึกข้อมูล!'
                : 'No comments yet. Be the first to share an eyewitness account!'}
            </p>
          </div>
        ) : (
          comments.map((item, index) => {
            const isTop1 = sortMode === 'popular' && index === 0 && item.likes >= 50;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all text-xs select-text ${
                  isTop1
                    ? 'bg-[#fffdf5] border-2 border-[#8b5a2b] shadow-sm'
                    : 'bg-parchment-panel border border-[#cfb68a] hover:border-[#8b5a2b] shadow-[0_1px_4px_rgba(70,40,15,0.06)]'
                }`}
              >
                {/* Author row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 to-emerald-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm">
                      {item.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-stone-900 truncate">
                      {item.author}
                    </span>
                  </div>

                  {item.roleBadge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium shrink-0 ${
                        item.isPopular || isTop1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {item.roleBadge}
                    </span>
                  )}
                </div>

                {/* Comment body */}
                <p className="text-[#292524] font-serif leading-relaxed text-[13px] pl-2 border-l-2 border-amber-600/40 my-2">
                  “{item.content}”
                </p>

                {/* Footer with timestamp, Reply button, and Like button */}
                <div className="flex items-center justify-between pt-2 text-[10.5px] text-stone-500 border-t border-[#f0ebe0]">
                  <span className="font-mono text-stone-500">
                    {new Date(item.createdAt).toLocaleDateString(
                      language === 'th' ? 'th-TH' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Reply Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleReplyBox(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        replyingCommentId === item.id
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-medium'
                          : 'bg-stone-100 text-stone-700 border-stone-300 hover:text-stone-900 hover:bg-stone-200'
                      }`}
                    >
                      <MessageSquare className="w-2.5 h-2.5 text-amber-700" />
                      <span>
                        {item.replies && item.replies.length > 0
                          ? `${language === 'th' ? 'ตอบกลับ' : 'Reply'} (${item.replies.length})`
                          : language === 'th'
                          ? 'ตอบกลับ'
                          : 'Reply'}
                      </span>
                    </button>

                    {/* Interactive Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        item.userLiked
                          ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                          : 'bg-stone-100 text-stone-600 border-stone-300 hover:text-rose-600 hover:bg-stone-200'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          item.userLiked ? 'fill-rose-600 text-rose-600 scale-110' : 'text-stone-500'
                        } transition-transform`}
                      />
                      <span className="font-mono font-semibold">{item.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Nested Threaded Replies List */}
                {item.replies && item.replies.length > 0 && (
                  <div className="mt-2.5 ml-2 pl-3 border-l-2 border-amber-600/30 space-y-2">
                    {item.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-2.5 rounded-lg bg-[#f7f3ea] border border-[#dfd7c6] text-xs"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-700 to-emerald-700 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                              {reply.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-stone-900 text-[11px] truncate">
                              {reply.author}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-500 shrink-0">
                            {new Date(reply.createdAt).toLocaleDateString(
                              language === 'th' ? 'th-TH' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-[#292524] text-[12px] pl-1 leading-relaxed font-serif">
                          {reply.content}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleReplyLike(item.id, reply.id)}
                            className="flex items-center gap-1 text-[9px] text-stone-600 hover:text-rose-600 cursor-pointer"
                          >
                            <Heart
                              className={`w-2.5 h-2.5 ${
                                reply.userLiked ? 'fill-rose-600 text-rose-600 scale-110' : ''
                              }`}
                            />
                            <span className="font-mono">{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Form */}
                {replyingCommentId === item.id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitReply(item.id);
                    }}
                    className="mt-2.5 ml-2 pl-3 border-l-2 border-amber-600/40 space-y-2 bg-[#f3ede2] p-2.5 rounded-xl border border-[#d6cbb6] animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-900 font-medium">
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-amber-800" />
                        {language === 'th'
                          ? `ตอบกลับ @${item.author}`
                          : `Reply to @${item.author}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingCommentId(null)}
                        className="text-stone-500 hover:text-stone-900 text-[10px] cursor-pointer"
                      >
                        ✕ {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                      </button>
                    </div>

                    <input
                      id={`reply-author-${item.id}`}
                      name="reply_author"
                      aria-label={language === 'th' ? 'ชื่อของคุณ หรือ นามแฝง' : 'Your name or alias'}
                      type="text"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      placeholder={
                        language === 'th' ? 'ชื่อของคุณ หรือ นามแฝง...' : 'Your name / alias...'
                      }
                      className="w-full text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-300 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 outline-none"
                      maxLength={40}
                    />

                    <div className="relative">
                      <textarea
                        id={`reply-content-${item.id}`}
                        name="reply_content"
                        aria-label={language === 'th' ? 'ข้อความตอบกลับ' : 'Reply content'}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={
                          language === 'th'
                            ? `เขียนคำตอบกลับถึง @${item.author}...`
                            : `Write reply to @${item.author}...`
                        }
                        rows={2}
                        className="w-full text-xs px-2.5 py-1 pr-9 rounded-lg bg-white border border-stone-300 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 outline-none resize-none font-serif"
                        maxLength={300}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!replyContent.trim() || isSubmittingReply}
                        className="absolute right-1.5 bottom-2 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 disabled:opacity-30 text-white font-bold transition-all cursor-pointer shadow-sm"
                        title={language === 'th' ? 'ส่งคำตอบกลับ' : 'Submit Reply'}
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Main Comment Form (Add new testimony) */}
      <form
        onSubmit={handleSubmit}
        className="relative px-4 py-3.5 border-t-2 border-[#6d411b]/40 bg-[#eedbb8]/90 space-y-2.5 shrink-0"
      >
        <div className="flex items-center gap-1.5 text-[11px] text-amber-950 font-medium">
          <MessageSquare className="w-3 h-3 text-amber-800" />
          <span>{language === 'th' ? 'ร่วมบันทึกคำบอกเล่า' : 'Add Eyewitness Report'}</span>
        </div>

        <div>
          <input
            id="new-comment-author"
            name="comment_author"
            aria-label={language === 'th' ? 'ชื่อของคุณ หรือ นามแฝง' : 'Your name or alias'}
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={language === 'th' ? 'ชื่อของคุณ หรือ นามแฝง...' : 'Your name / alias...'}
            className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-stone-300 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 outline-none transition-colors"
            maxLength={40}
          />
        </div>

        <div className="relative">
          <textarea
            id="new-comment-text"
            name="comment_text"
            aria-label={language === 'th' ? 'ข้อความบอกเล่าประสบการณ์' : 'Eyewitness testimony content'}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              language === 'th'
                ? 'แบ่งปันประสบการณ์ คำบอกเล่า หรือข้อมูลเกี่ยวกับสิ่งนี้...'
                : 'Share your sightings, folklore, or thoughts...'
            }
            rows={2}
            className="w-full text-xs px-3 py-1.5 pr-10 rounded-lg bg-white border border-stone-300 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 outline-none transition-colors resize-none font-serif"
            maxLength={350}
          />

          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="absolute right-1.5 bottom-2.5 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 disabled:opacity-30 disabled:hover:bg-stone-800 text-white font-bold transition-all cursor-pointer shadow-sm"
            title={language === 'th' ? 'ส่งความคิดเห็น' : 'Submit'}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
