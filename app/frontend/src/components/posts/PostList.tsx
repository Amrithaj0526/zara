import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaUserCircle, FaCalendarAlt, FaRegHeart, FaHeart, FaRegCommentDots, FaTag, FaEllipsisH, FaSearch, FaSortAmountDown, FaSortAmountUp, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// Custom hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = useCallback((node: Element | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });
    if (node) observer.current.observe(node);
  }, [callback, hasMore, loading]);
  return lastRef;
}

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

// For type safety
type RequestInit = globalThis.RequestInit;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const debouncedSearch = useDebounce(search, 500);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [likeLoading, setLikeLoading] = useState<{ [key: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [key: number]: boolean }>({});
  const [commentError, setCommentError] = useState<{ [key: number]: string | null }>({});
  const commentRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const { user } = useAuth();
  const [myPostsOnly, setMyPostsOnly] = useState(false);

  // Fetch posts with filters, sort, and pagination
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      search: debouncedSearch,
      category,
      sort,
      order,
    });
    if (tagsFilter.length > 0) {
      tagsFilter.forEach(tag => params.append('tags', tag));
    }
    if (myPostsOnly && user?.id) {
      params.append('user_id', user.id.toString());
    }
    
    const token = localStorage.getItem('token');
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/?${params}`, {
      headers,
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
      })
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [debouncedSearch, category, sort, order, page, tagsFilter, myPostsOnly, user?.id]);

  // Fetch categories
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/categories`, { headers })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/popular-tags`, { headers })
      .then(res => res.json())
      .then(data => setPopularTags(data))
      .catch(() => setPopularTags([]));
  }, []);

  // Infinite scroll
  const loadMore = () => {
    if (!loading) setPage(p => p + 1);
  };
  const lastPostRef = useInfiniteScroll(loadMore, true, loading);

  const handleLike = async (postId: number) => {
    setLikeLoading(l => ({ ...l, [postId]: true }));
    try {
      const token = localStorage.getItem('token');
      const headers: RequestInit['headers'] = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/${postId}/like`, { 
        method: 'POST', 
        headers,
        credentials: 'include' 
      });
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
      const token = localStorage.getItem('token');
      const headers: RequestInit['headers'] = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add comment');
      }
      // Refetch comments for this post
      const commentsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/${postId}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const comments = await commentsRes.json();
      setPosts(posts => posts.map(p => p.id === postId ? { ...p, comments } : p));
      setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
      if (commentRefs.current[postId]) commentRefs.current[postId]!.value = '';
    } catch (error: any) {
      setCommentError(e => ({ ...e, [postId]: error.message }));
    } finally {
      setCommentLoading(l => ({ ...l, [postId]: false }));
    }
  };

  const handleTagFilter = (tag: string) => {
    setTagsFilter(tags => tags.includes(tag) ? tags : [...tags, tag]);
    setPage(1);
  };
  const handleRemoveTagFilter = (tag: string) => {
    setTagsFilter(tags => tags.filter(t => t !== tag));
    setPage(1);
  };
  const handleClearTagFilters = () => {
    setTagsFilter([]);
    setPage(1);
  };

  // Filter/search/sort UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Filter/Search/Sort Bar */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="outline-none bg-transparent text-gray-700"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="bg-white rounded-lg shadow px-3 py-2 text-gray-700"
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button
            className="flex items-center gap-1 bg-white rounded-lg shadow px-3 py-2 text-gray-700"
            onClick={() => { setOrder(o => o === 'asc' ? 'desc' : 'asc'); setPage(1); }}
          >
            {order === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />} {sort === 'created_at' ? 'Date' : sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        </div>
        {/* My Posts Toggle */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="my-posts-toggle"
            checked={myPostsOnly}
            onChange={e => { setMyPostsOnly(e.target.checked); setPage(1); }}
            className="accent-blue-600"
          />
          <label htmlFor="my-posts-toggle" className="text-sm font-semibold text-blue-700 cursor-pointer">Show only my posts</label>
        </div>
        {/* Tag Filter Bar */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <span className="font-semibold text-gray-600 mr-2">Popular Tags:</span>
            {popularTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${tagsFilter.includes(tag) ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}`}
                onClick={() => handleTagFilter(tag)}
                disabled={tagsFilter.includes(tag)}
              >
                {tag}
              </button>
            ))}
            {tagsFilter.length > 0 && (
              <button className="ml-4 text-xs text-red-500 underline" onClick={handleClearTagFilters}>Clear Tags</button>
            )}
          </div>
        )}
        {/* Active Tag Filters */}
        {tagsFilter.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tagsFilter.map(tag => (
              <span key={tag} className="inline-flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                {tag}
                <button type="button" className="ml-1 text-blue-400 hover:text-red-500" onClick={() => handleRemoveTagFilter(tag)}>&times;</button>
              </span>
            ))}
          </div>
        )}
        {/* Post List */}
        {posts.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 text-lg">No posts found.</div>
        )}
        {error && <div className="text-red-600">{error}</div>}
        <div className="space-y-8">
          {posts.map((post, i) => (
            <div ref={i === posts.length - 1 ? lastPostRef : undefined} key={post.id}>
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
                  <button
                    onClick={() => {
                      const postUrl = `${window.location.origin}/posts/${post.id}`;
                      if (navigator.share) {
                        navigator.share({ url: postUrl, title: 'Check out this post!' });
                      } else {
                        navigator.clipboard.writeText(postUrl);
                        alert('Post link copied to clipboard!');
                      }
                    }}
                    className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <FaShareAlt />
                    <span className="font-semibold">Share</span>
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
            </div>
          ))}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border-l-8 border-blue-200 p-6 animate-pulse h-40" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList; 