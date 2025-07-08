import React, { useEffect, useState, useRef } from 'react';
import { FaUserCircle, FaCalendarAlt, FaRegHeart, FaHeart, FaRegCommentDots, FaTag, FaEllipsisH } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  avatar: string | null;
  job_title: string | null;
}

interface Comment {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
}

interface Post {
  id: number;
  content: string;
  media_url: string | null;
  created_at: string;
  likes: number;
  tags: string[];
  user: User;
  comments: Comment[];
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [likeLoading, setLikeLoading] = useState<{ [key: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [key: number]: boolean }>({});
  const [commentError, setCommentError] = useState<{ [key: number]: string | null }>({});
  const commentRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/posts/');
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    setLikeLoading(l => ({ ...l, [postId]: true }));
    try {
      const res = await fetch(`/posts/${postId}/like`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setPosts(posts => posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      }
    } finally {
      setLikeLoading(l => ({ ...l, [postId]: false }));
    }
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(exp => ({ ...exp, [postId]: !exp[postId] }));
  };

  const handleCommentInput = (postId: number, value: string) => {
    setCommentInputs(inputs => ({ ...inputs, [postId]: value }));
  };

  const handleAddComment = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    setCommentLoading(l => ({ ...l, [postId]: true }));
    setCommentError(e => ({ ...e, [postId]: null }));
    try {
      const res = await fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add comment');
      }
      // Refetch comments for this post
      const commentsRes = await fetch(`/posts/${postId}/comments`);
      const comments = await commentsRes.json();
      setPosts(posts => posts.map(p => p.id === postId ? { ...p, comments } : p));
      setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
      if (commentRefs.current[postId]) commentRefs.current[postId]!.value = '';
    } catch (err: any) {
      setCommentError(e => ({ ...e, [postId]: err.message }));
    } finally {
      setCommentLoading(l => ({ ...l, [postId]: false }));
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No posts yet.</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg border-l-8 border-blue-200 p-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-200 relative group">
              {/* Post header */}
              <div className="flex items-center gap-3 mb-2">
                {post.user.avatar ? (
                  <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover" />
                ) : (
                  <FaUserCircle className="text-blue-400 text-2xl" />
                )}
                <div>
                  <span className="font-bold text-gray-800 text-lg">{post.user.name}</span>
                  {post.user.job_title && <span className="block text-xs text-blue-500 font-medium">{post.user.job_title}</span>}
                </div>
                <span className="ml-auto flex items-center gap-1 text-gray-400 text-sm">
                  <FaCalendarAlt />
                  {new Date(post.created_at).toLocaleString()}
                </span>
                <button className="ml-2 text-gray-400 hover:text-blue-500 p-1 rounded-full transition-colors"><FaEllipsisH /></button>
              </div>
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold"><FaTag />{tag}</span>
                  ))}
                </div>
              )}
              {/* Content */}
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
              {/* Media */}
              {post.media_url && (
                <div className="mt-2 flex justify-center">
                  {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={post.media_url} alt="Post media" className="max-h-64 rounded-lg border shadow" />
                  ) : post.media_url.match(/\.(mp4)$/i) ? (
                    <video src={post.media_url} controls className="max-h-64 rounded-lg border shadow" />
                  ) : null}
                </div>
              )}
              {/* Actions */}
              <div className="flex items-center gap-6 mt-2">
                <button onClick={() => handleLike(post.id)} disabled={likeLoading[post.id]} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                  {likeLoading[post.id] ? <FaHeart className="animate-pulse" /> : <FaRegHeart />}
                  <span className="font-semibold">{post.likes}</span>
                </button>
                <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <FaRegCommentDots />
                  <span className="font-semibold">{post.comments.length}</span>
                </button>
              </div>
              {/* Comments */}
              {expandedComments[post.id] && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {post.comments.length === 0 ? (
                    <div className="text-gray-400 text-sm">No comments yet.</div>
                  ) : (
                    post.comments.map(comment => (
                      <div key={comment.id} className="flex items-start gap-3">
                        {comment.user_avatar ? (
                          <img src={comment.user_avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                          <FaUserCircle className="text-blue-300 text-xl mt-1" />
                        )}
                        <div>
                          <span className="font-semibold text-gray-700 text-sm">{comment.user_name}</span>
                          <span className="ml-2 text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                          <div className="text-gray-800 text-sm mt-1">{comment.content}</div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Comment input */}
                  <div className="mt-3 flex items-start gap-2">
                    <textarea
                      ref={el => (commentRefs.current[post.id] = el)}
                      className="flex-1 border rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-200"
                      rows={2}
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e => handleCommentInput(post.id, e.target.value)}
                      disabled={commentLoading[post.id]}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={commentLoading[post.id] || !(commentInputs[post.id]?.trim())}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentLoading[post.id] ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                  {commentError[post.id] && <div className="text-red-500 text-xs mt-1">{commentError[post.id]}</div>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList; 