import React, { useState } from 'react';
import { FaUserCircle, FaHashtag, FaUserPlus, FaRegHeart, FaHeart, FaRegCommentDots, FaShareAlt, FaBookmark, FaEllipsisH, FaChartBar, FaRegEdit, FaTrash, FaFlag, FaRegEye, FaRegThumbsUp, FaRegSmile, FaRegClock, FaRegCopy, FaRegSave } from 'react-icons/fa';

// Demo trending topics and people
const trendingTopics = [
  { tag: 'AI', count: 1200 },
  { tag: 'WebDev', count: 950 },
  { tag: 'Career', count: 800 },
  { tag: 'RemoteWork', count: 650 },
  { tag: 'Startups', count: 500 },
];
const suggestedPeople = [
  { id: 1, name: 'Aathman Ansari', job: 'Embedded Engineer', avatar: null },
  { id: 2, name: 'Dheena', job: 'Blogger & Developer', avatar: null },
  { id: 3, name: 'Priya Sharma', job: 'Product Manager', avatar: null },
];

type Comment = {
  id: number;
  user: string;
  avatar: string | null;
  content: string;
  time: string;
  liked: boolean;
  likes: number;
};

type Poll = {
  question: string;
  options: string[];
  votes: number[];
};

type Analytics = {
  impressions: number;
  engagement: number;
};

type Post = {
  id: number;
  user: { name: string; job: string; avatar: string | null };
  content: string;
  time: string;
  image: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  views: number;
  bookmarked: boolean;
  poll: Poll | null;
  pinned: boolean;
  analytics: Analytics;
};

const samplePosts: Post[] = [
  {
    id: 1,
    user: { name: 'Aathman Ansari', job: 'Embedded Engineer', avatar: null },
    content: 'Excited to join Zara! Looking forward to connecting with everyone.',
    time: 'Just now',
    image: '/posts/uploads/20250709063619_pexels-13nuance-561463.jpg',
    likes: 12,
    liked: false,
    comments: [
      { id: 1, user: 'Dheena', avatar: null, content: 'Welcome!', time: '1 min ago', liked: false, likes: 0 },
    ],
    views: 120,
    bookmarked: false,
    poll: { question: 'What do you want to see more of?', options: ['Tech', 'Jobs', 'Events'], votes: [5, 3, 2] },
    pinned: true,
    analytics: { impressions: 200, engagement: 15 },
  },
  {
    id: 2,
    user: { name: 'Dheena', job: 'Blogger & Developer', avatar: null },
    content: 'Just published a new blog on Embedded Systems. Check it out!',
    time: '5 min ago',
    image: '/posts/uploads/20250709061236_pexels-beevee-1020478.jpg',
    likes: 5,
    liked: true,
    comments: [],
    views: 80,
    bookmarked: true,
    poll: null,
    pinned: false,
    analytics: { impressions: 100, engagement: 7 },
  },
];

const FeedSidebar: React.FC = () => (
  <aside className="w-full md:w-80 flex-shrink-0 md:sticky md:top-24 space-y-8">
    <div className="bg-white rounded-2xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaHashtag className="text-blue-400" /> Trending Topics</h3>
      <ul className="space-y-2">
        {trendingTopics.map(topic => (
          <li key={topic.tag} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-blue-800 font-semibold"><FaHashtag /> {topic.tag}</span>
            <span className="text-xs text-gray-400">{topic.count} posts</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaUserPlus className="text-blue-400" /> People You May Know</h3>
      <ul className="space-y-4">
        {suggestedPeople.map(person => (
          <li key={person.id} className="flex items-center gap-3">
            {person.avatar ? (
              <img src={person.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover" />
            ) : (
              <FaUserCircle className="text-blue-400 text-2xl" />
            )}
            <div>
              <div className="font-semibold text-gray-800">{person.name}</div>
              <div className="text-xs text-blue-500">{person.job}</div>
            </div>
            <button className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 transition">Connect</button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showShare, setShowShare] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<number | null>(null);

  // Demo handlers
  const handleLike = (id: number) => {
    setPosts(posts => posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };
  const handleBookmark = (id: number) => {
    setPosts(posts => posts.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  };
  const handleShowOptions = (id: number) => {
    setShowOptions(showOptions === id ? null : id);
  };
  const handleShowShare = (id: number) => {
    setShowShare(showShare === id ? null : id);
  };
  const handleShowAnalytics = (id: number) => {
    setShowAnalytics(showAnalytics === id ? null : id);
  };
  const handleCommentInput = (id: number, value: string) => {
    setCommentInputs(inputs => ({ ...inputs, [id]: value }));
  };
  const handleAddComment = (id: number) => {
    if (!commentInputs[id]?.trim()) return;
    setPosts(posts => posts.map(p => p.id === id ? {
      ...p,
      comments: [...p.comments, { id: Date.now(), user: 'You', avatar: null, content: commentInputs[id], time: 'Now', liked: false, likes: 0 }]
    } : p));
    setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
  };
  const handleToggleComments = (id: number) => {
    setExpandedComments(exp => ({ ...exp, [id]: !exp[id] }));
  };
  const handleSort = (type: 'recent' | 'popular') => {
    setSort(type);
    setPosts(posts => [...posts].sort((a, b) => type === 'recent' ? b.id - a.id : b.likes - a.likes));
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-8 flex flex-col md:flex-row gap-8">
      {/* Main Feed */}
      <section className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-extrabold text-blue-700 flex-1">Welcome to your Feed</h2>
          <button className={`px-3 py-1 rounded-full text-sm font-semibold border ${sort === 'recent' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`} onClick={() => handleSort('recent')}>Recent</button>
          <button className={`px-3 py-1 rounded-full text-sm font-semibold border ${sort === 'popular' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`} onClick={() => handleSort('popular')}>Popular</button>
        </div>
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-gray-500 text-center">No posts in your feed yet. Follow people or create a post to get started!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className={`bg-white rounded-2xl shadow-lg border-l-8 ${post.pinned ? 'border-yellow-400' : 'border-blue-200'} p-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-200 relative group`}>
                {/* Post header */}
                <div className="flex items-center gap-3 mb-2">
                  {post.user.avatar ? (
                    <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover" />
                  ) : (
                    <FaUserCircle className="text-blue-400 text-2xl" />
                  )}
                  <div className="group/hovercard relative">
                    <span className="font-bold text-gray-800 text-lg cursor-pointer">{post.user.name}</span>
                    {post.user.job && <span className="block text-xs text-blue-500 font-medium">{post.user.job}</span>}
                    {/* User hover card demo */}
                    <div className="hidden group-hover/hovercard:block absolute left-0 top-8 z-10 bg-white border rounded-lg shadow-lg p-4 w-64">
                      <div className="flex items-center gap-3 mb-2">
                        <FaUserCircle className="text-blue-400 text-2xl" />
                        <div>
                          <div className="font-bold text-gray-800">{post.user.name}</div>
                          <div className="text-xs text-blue-500">{post.user.job}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Demo: Profile preview, connect, message, etc.</div>
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400 flex items-center gap-1"><FaRegClock /> {post.time}</span>
                  <button className="ml-2 text-gray-400 hover:text-blue-500 p-1 rounded-full transition-colors relative" onClick={() => handleShowOptions(post.id)}><FaEllipsisH />
                    {showOptions === post.id && (
                      <div className="absolute right-0 top-8 z-20 bg-white border rounded-lg shadow-lg w-44 p-2 flex flex-col gap-2">
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaRegEdit /> Edit</button>
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaTrash /> Delete</button>
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaFlag /> Report</button>
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaRegSave /> Save Post</button>
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaRegEye /> Hide Post</button>
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaChartBar /> Analytics</button>
                      </div>
                    )}
                  </button>
                </div>
                {/* Poll demo */}
                {post.poll && post.poll.options && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-2">
                    <div className="font-semibold mb-2">{post.poll.question}</div>
                    <div className="space-y-2">
                      {post.poll.options.map((opt: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="radio" name={`poll-${post.id}`} className="accent-blue-600" disabled />
                          <span>{opt}</span>
                          <span className="ml-auto text-xs text-gray-400">{post.poll && post.poll.votes[i]} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Content */}
                <div className="text-gray-800 text-lg">{post.content}</div>
                {/* Media */}
                {post.image && (
                  <div className="mt-2 flex justify-center">
                    <img src={post.image} alt="Post media" className="max-h-64 rounded-lg border shadow cursor-pointer hover:scale-105 transition-transform" title="Click to preview" />
                  </div>
                )}
                {/* Actions */}
                <div className="flex items-center gap-6 mt-2">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 font-semibold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}><span>{post.liked ? <FaHeart /> : <FaRegHeart />}</span> {post.likes}</button>
                  <button onClick={() => handleToggleComments(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors font-semibold"><FaRegCommentDots /> {post.comments.length}</button>
                  <button onClick={() => handleShowShare(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors font-semibold"><FaShareAlt /> Share</button>
                  <button onClick={() => handleBookmark(post.id)} className={`flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors font-semibold ${post.bookmarked ? 'text-blue-600' : ''}`}><FaBookmark /> {post.bookmarked ? 'Saved' : 'Save'}</button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors font-semibold"><FaUserPlus /> Follow</button>
                  <button onClick={() => handleShowAnalytics(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors font-semibold"><FaChartBar /> Analytics</button>
                </div>
                {/* Share Modal Demo */}
                {showShare === post.id && (
                  <div className="absolute z-30 left-1/2 -translate-x-1/2 top-20 bg-white border rounded-lg shadow-lg p-4 w-80 flex flex-col gap-2">
                    <div className="font-semibold mb-2">Share this post</div>
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaRegCopy /> Copy Link</button>
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaShareAlt /> Share to Network</button>
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded"><FaRegThumbsUp /> Share with Comment</button>
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded" onClick={() => setShowShare(null)}>Close</button>
                  </div>
                )}
                {/* Analytics Modal Demo */}
                {showAnalytics === post.id && (
                  <div className="absolute z-30 left-1/2 -translate-x-1/2 top-20 bg-white border rounded-lg shadow-lg p-4 w-80 flex flex-col gap-2">
                    <div className="font-semibold mb-2">Post Analytics</div>
                    <div className="flex items-center gap-2"><FaRegEye /> Impressions: {post.analytics.impressions}</div>
                    <div className="flex items-center gap-2"><FaRegThumbsUp /> Engagement: {post.analytics.engagement}</div>
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded" onClick={() => setShowAnalytics(null)}>Close</button>
                  </div>
                )}
                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    {post.comments.length === 0 ? (
                      <div className="text-gray-400 text-sm">No comments yet.</div>
                    ) : (
                      post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                          ) : (
                            <FaUserCircle className="text-blue-300 text-xl mt-1" />
                          )}
                          <div>
                            <span className="font-semibold text-gray-700 text-sm">{comment.user}</span>
                            <span className="ml-2 text-xs text-gray-400">{comment.time}</span>
                            <div className="text-gray-800 text-sm mt-1">{comment.content}</div>
                            {/* Comment actions demo */}
                            <div className="flex gap-2 mt-1">
                              <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"><FaRegHeart /> Like</button>
                              <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"><FaRegEdit /> Edit</button>
                              <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"><FaTrash /> Delete</button>
                              <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"><FaRegSmile /> React</button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {/* Comment input */}
                    <div className="mt-3 flex items-start gap-2">
                      <input
                        className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-200"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={e => handleCommentInput(post.id, e.target.value)}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!(commentInputs[post.id]?.trim())}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
                {/* Pinned badge */}
                {post.pinned && <span className="absolute -left-8 top-4 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-r-lg shadow">PINNED</span>}
                {/* Views/analytics */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2"><FaRegEye /> {post.views} views</div>
              </div>
            ))
          )}
        </div>
      </section>
      {/* Sidebar */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <FeedSidebar />
      </div>
    </div>
  );
};

export default Feed; 