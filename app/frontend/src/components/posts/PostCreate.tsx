import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaEdit, FaImage, FaVideo } from 'react-icons/fa';

const PostCreate: React.FC = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    try {
      const res = await fetch('http://localhost:5000/posts/', {
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
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
          <FaEdit className="text-blue-400" /> Create a Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <FaEdit className="text-blue-400" /> Content
            </label>
            <div className="rounded-lg border border-blue-100 shadow-sm bg-white">
              <ReactQuill value={content} onChange={setContent} theme="snow" className="bg-white rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <FaImage className="text-blue-400" /> Media (Image/Video)
            </label>
            <input type="file" accept="image/*,video/mp4" onChange={handleMediaChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
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
          {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center">Post created successfully!</div>}
          <div className="flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 disabled:opacity-50" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate; 