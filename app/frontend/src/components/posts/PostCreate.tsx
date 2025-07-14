import React, { useState, useEffect, useRef, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import 'react-quill/dist/quill.snow.css';
import { FaEdit, FaImage, FaUserCircle, FaCheckCircle, FaExclamationCircle, FaPoll, FaSmile, FaPaperclip } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import FontFamily from '@tiptap/extension-font-family';

// For type safety
type RequestInit = globalThis.RequestInit;

const demoUser = { name: 'Aathman Ansari', avatar: null, job: 'Embedded Engineer' };

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PostCreate Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-10">
          <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-red-100">
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-4">Editor Error</h2>
              <p className="text-gray-600 mb-6">There was an issue loading the rich text editor. Please refresh the page to try again.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PostCreate: React.FC = () => {
  const { user } = useAuth() || {};
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Restored error state
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [showUserCard, setShowUserCard] = useState(false);
  const [editorFailed, setEditorFailed] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable extensions that we're adding separately
        bold: false,
        italic: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      FontFamily,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Check if editor failed to initialize
  useEffect(() => {
    if (!editor && !editorFailed) {
      const timer = setTimeout(() => {
        if (!editor) {
          setEditorFailed(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editor, editorFailed]);

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

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'].includes(file.type)) {
      setError('Only JPG, PNG, and MP4 files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };
  const addTag = (tag: string) => {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!tagList.includes(tag)) {
      setTags([...tagList, tag].join(','));
    }
    setTagInput('');
  };
  const removeTag = (tag: string) => {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    setTags(tagList.filter(t => t !== tag).join(','));
  };
  const filteredSuggestions = popularTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.split(',').map(t => t.trim()).includes(t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!content || content === '<p><br></p>') {
      setError('Post content cannot be empty.');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);
    if (category) formData.append('category', category);
    if (tags) formData.append('tags', tags);
    if (visibility) formData.append('visibility', visibility);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/posts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create post');
      setSuccess(true);
      setContent('');
      setMedia(null);
      setPreviewUrl(null);
      setCategory('');
      setTags('');
      setVisibility('public');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-10">
        <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
          {/* User avatar and name with hover card */}
          <div className="flex items-center gap-4 mb-6 relative">
            <span
              onMouseEnter={() => setShowUserCard(true)}
              onMouseLeave={() => setShowUserCard(false)}
              tabIndex={0}
              aria-label="User profile"
              className="outline-none"
            >
              {demoUser.avatar ? (
                <img src={demoUser.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
              ) : (
                <FaUserCircle className="text-4xl text-blue-400" />
              )}
            </span>
            <div>
              <div className="font-bold text-blue-800 text-lg cursor-pointer" aria-label="User name">{user?.username || demoUser.name}</div>
              <div className="text-xs text-gray-400">{demoUser.job}</div>
            </div>
            {/* Demo user hover card */}
            {showUserCard && (
              <div className="absolute left-0 top-14 z-20 bg-white border shadow-lg rounded-xl p-4 w-64 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <FaUserCircle className="text-2xl text-blue-400" />
                  <div>
                    <div className="font-bold text-blue-800">{user?.username || demoUser.name}</div>
                    <div className="text-xs text-gray-400">{demoUser.job}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">"Building the future of embedded systems."</div>
              </div>
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
            <FaEdit className="text-blue-400" /> Create a Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create post form">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                <FaEdit className="text-blue-400" /> Content
              </label>
              {/* Formatting Toolbar */}
              {editor && (
                <div className="flex flex-wrap gap-2 mb-2 bg-blue-50 p-2 rounded-lg shadow-sm">
                  <button type="button" title="Bold" aria-label="Bold" className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
                  <button type="button" title="Italic" aria-label="Italic" className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
                  <button type="button" title="Underline" aria-label="Underline" className={`p-1 rounded ${editor.isActive('underline') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
                  <button type="button" title="Strike" aria-label="Strike" className={`p-1 rounded ${editor.isActive('strike') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
                  <button type="button" title="Heading 1" aria-label="Heading 1" className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                  <button type="button" title="Heading 2" aria-label="Heading 2" className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                  <button type="button" title="Heading 3" aria-label="Heading 3" className={`p-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
                  <input
                    type="color"
                    title="Text Color"
                    aria-label="Text Color"
                    className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                    onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    style={{ verticalAlign: 'middle' }}
                  />
                  {/* New controls for lists, blockquote, code, font family */}
                  <button type="button" title="Bullet List" aria-label="Bullet List" className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                  <button type="button" title="Ordered List" aria-label="Ordered List" className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                  <button type="button" title="Blockquote" aria-label="Blockquote" className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;Quote&rdquo;</button>
                  <button type="button" title="Code Block" aria-label="Code Block" className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100'}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
                  <select
                    title="Font Family"
                    aria-label="Font Family"
                    className="rounded p-1 border border-blue-200 bg-white text-blue-800"
                    value={editor.getAttributes('fontFamily').fontFamily || 'inherit'}
                    onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                  >
                    <option value="inherit">Default</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                  </select>
                </div>
              )}
              <div className="rounded-lg border border-blue-100 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                {editorFailed ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white rounded-lg p-2 min-h-[120px] focus:outline-none resize-none"
                    placeholder="Write your post content here..."
                    aria-label="Post content (fallback editor)"
                  />
                ) : (
                  <EditorContent editor={editor} className="bg-white rounded-lg p-2 min-h-[120px] focus:outline-none" aria-label="Post content" />
                )}
              </div>
            </div>
            {/* Media Upload Section */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-blue-400" /> Media (Image/Video)
              </label>
              <input 
                type="file" 
                accept="image/*,video/mp4" 
                onChange={handleMediaChange} 
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-2 focus:ring-blue-200" 
                aria-label="Upload media" 
              />
              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  {media && media.type.startsWith('image') ? (
                    <img src={previewUrl} alt="Preview" className="max-h-56 rounded-lg shadow-lg border border-blue-100" />
                  ) : (
                    <video src={previewUrl} controls className="max-h-56 rounded-lg shadow-lg border border-blue-100" />
                  )}
                </div>
              )}
            </div>
            {/* Action bar */}
            <div className="flex items-center gap-4 mb-2">
              <button type="button" className="text-blue-400 text-xl" aria-label="Add poll" tabIndex={0}><FaPoll /></button>
              <button type="button" className="text-blue-400 text-xl" aria-label="Add emoji" tabIndex={0}><FaSmile /></button>
              <button type="button" className="text-blue-400 text-xl" aria-label="Attach file" tabIndex={0}><FaPaperclip /></button>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200" aria-label="Select category">
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.split(',').map(tag => tag && (
                  <span key={tag} className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {tag}
                    <button type="button" className="ml-1 text-blue-400 hover:text-red-500" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Type and press Enter to add tag"
                aria-label="Add tag"
              />
              {filteredSuggestions.length > 0 && tagInput && (
                <div className="bg-white border rounded shadow mt-1 max-h-32 overflow-y-auto z-10 absolute">
                  {filteredSuggestions.map(sug => (
                    <div
                      key={sug}
                      className="px-3 py-1 cursor-pointer hover:bg-blue-100"
                      onClick={() => addTag(sug)}
                      tabIndex={0}
                      aria-label={`Add suggested tag ${sug}`}
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Visibility</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200" aria-label="Select visibility">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded p-2 animate-pulse" role="alert">
                <FaExclamationCircle /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded p-2 animate-bounce" role="status">
                <FaCheckCircle /> Post created successfully!
                {/* Demo confetti animation */}
                <span className="ml-2 animate-confetti">🎉</span>
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-bold text-white text-xl shadow-lg transition-all duration-200 ${loading ? 'bg-blue-300' : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 scale-105 hover:scale-110'}`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center"><span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span> Posting...</span>
              ) : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PostCreate; 