import React, { useState, useRef } from 'react';
import type { Profile } from '../../types';

// Mock profile data
const mockProfile: Profile = {
  id: 1,
  user_id: 1,
  bio: 'Full Stack Developer passionate about building scalable web apps.',
  location: 'Bangalore, India',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
  experience: [],
  education: []
};

const mockUser = {
  username: 'amrithaj',
  email: 'amritha@example.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

const validateEmail = (email: string) => /.+@.+\..+/.test(email);
const validateUsername = (username: string) => username.length >= 3;
const validateSkill = (skill: string) => skill.length > 0;

const ProfileEdit: React.FC = () => {
  // Form state
  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);
  const [bio, setBio] = useState(mockProfile.bio);
  const [location, setLocation] = useState(mockProfile.location);
  const [skills, setSkills] = useState<string[]>(mockProfile.skills);
  const [newSkill, setNewSkill] = useState('');
  const [avatar, setAvatar] = useState<string>(mockUser.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(mockUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!validateUsername(username)) errs.username = 'Username must be at least 3 characters.';
    if (!validateEmail(email)) errs.email = 'Invalid email address.';
    if (skills.length === 0) errs.skills = 'Add at least one skill.';
    return errs;
  };

  // Handle image upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Add skill
  const handleAddSkill = () => {
    if (validateSkill(newSkill) && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Submit form (mock API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate image upload
    if (avatarFile) {
      setUploading(true);
      await new Promise(res => setTimeout(res, 1200));
      setUploading(false);
      setAvatar(avatarPreview);
    }
    // Simulate API call
    await new Promise(res => setTimeout(res, 1000));
    setSuccess('Profile updated successfully!');
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form className="bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        {/* Username & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Username</label>
            <input
              type="text"
              className={`mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.username ? 'border-red-500' : ''}`}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              className={`mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>
        </div>
        {/* Bio & Location */}
        <div>
          <label className="block font-semibold">Bio</label>
          <textarea
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold">Location</label>
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        {/* Skills */}
        <div>
          <label className="block font-semibold">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                {skill}
                <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveSkill(skill)} title="Remove">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="Add a skill"
            />
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddSkill}>
              Add
            </button>
          </div>
          {errors.skills && <div className="text-red-500 text-xs mt-1">{errors.skills}</div>}
        </div>
        {/* Submission States */}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {Object.keys(errors).length > 0 && !success && <div className="text-red-500 text-sm">Please fix the errors above.</div>}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded focus:outline-none ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit; 