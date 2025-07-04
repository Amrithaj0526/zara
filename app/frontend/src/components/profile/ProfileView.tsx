import React, { useState } from 'react';
import type { Profile, Experience, Education, Post } from '../../types';
// If you see an error for the next line, run: npm install react-icons
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

// Mock profile data
const mockProfile: Profile = {
  id: 1,
  user_id: 1,
  bio: 'Full Stack Developer passionate about building scalable web apps.',
  location: 'Bangalore, India',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
  experience: [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Solutions',
      start_date: '2021-01-01',
      end_date: '2023-06-01',
      description: 'Worked on full stack web development projects.'
    }
  ],
  education: [
    {
      id: 1,
      school: 'ABC University',
      degree: 'B.Tech',
      field: 'Computer Science',
      start_date: '2017-08-01',
      end_date: '2021-06-01'
    }
  ]
};

const mockUser = {
  name: 'Amritha J',
  title: 'Full Stack Developer',
  social: {
    linkedin: 'https://linkedin.com/in/amrithaj',
    github: 'https://github.com/Amrithaj0526',
    twitter: 'https://twitter.com/amrithaj'
  },
  connections: 120,
  mutualConnections: 8,
  contact: {
    email: 'amritha@example.com',
    phone: '+91-9876543210'
  }
};

const mockPosts: Post[] = [
  {
    id: 1,
    user_id: 1,
    content: 'Excited to share my new project on GitHub!',
    created_at: '2023-07-01',
    likes: 12,
    comments: []
  },
  {
    id: 2,
    user_id: 1,
    content: 'Attended a great React conference last week.',
    created_at: '2023-06-20',
    likes: 8,
    comments: []
  }
];

const ProfileView: React.FC = () => {
  const [showBio, setShowBio] = useState(true);
  const [showExperience, setShowExperience] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  // Lazy load more activity (mock)
  const loadMoreActivity = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        {
          id: prev.length + 1,
          user_id: 1,
          content: 'This is a lazily loaded activity post.',
          created_at: '2023-05-10',
          likes: 3,
          comments: []
        }
      ]);
      setLoadingMore(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-6 mb-6">
        {/* Avatar removed for a clean look */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{mockUser.name}</h2>
          <p className="text-gray-600">{mockUser.title}</p>
          <p className="text-gray-500 text-sm">{mockProfile.location}</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            <a href={mockUser.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin className="text-blue-700" size={22} /></a>
            <a href={mockUser.social.github} target="_blank" rel="noopener noreferrer"><FaGithub className="text-gray-800" size={22} /></a>
            <a href={mockUser.social.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter className="text-blue-400" size={22} /></a>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-right">
          <div className="text-lg font-semibold">{mockUser.connections} Connections</div>
          <div className="text-sm text-gray-500">{mockUser.mutualConnections} mutual</div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Bio & Skills */}
        <button className="w-full text-left font-semibold text-lg mb-2" onClick={() => setShowBio(v => !v)}>
          Bio & Skills {showBio ? '▲' : '▼'}
        </button>
        {showBio && (
          <div className="mb-4">
            <p className="mb-2">{mockProfile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {mockProfile.skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {/* Experience */}
        <button className="w-full text-left font-semibold text-lg mb-2" onClick={() => setShowExperience(v => !v)}>
          Experience {showExperience ? '▲' : '▼'}
        </button>
        {showExperience && (
          <div className="mb-4">
            {mockProfile.experience.map(exp => (
              <div key={exp.id} className="mb-2">
                <div className="font-semibold">{exp.title} @ {exp.company}</div>
                <div className="text-sm text-gray-500">{exp.start_date} - {exp.end_date}</div>
                <div className="text-sm">{exp.description}</div>
              </div>
            ))}
          </div>
        )}
        {/* Education */}
        <button className="w-full text-left font-semibold text-lg mb-2" onClick={() => setShowEducation(v => !v)}>
          Education {showEducation ? '▲' : '▼'}
        </button>
        {showEducation && (
          <div className="mb-4">
            {mockProfile.education.map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="font-semibold">{edu.degree} in {edu.field} @ {edu.school}</div>
                <div className="text-sm text-gray-500">{edu.start_date} - {edu.end_date}</div>
              </div>
            ))}
          </div>
        )}
        {/* Contact */}
        <button className="w-full text-left font-semibold text-lg mb-2" onClick={() => setShowContact(v => !v)}>
          Contact Info {showContact ? '▲' : '▼'}
        </button>
        {showContact && (
          <div className="mb-4">
            <div>Email: <a href={`mailto:${mockUser.contact.email}`} className="text-blue-600 underline">{mockUser.contact.email}</a></div>
            <div>Phone: <a href={`tel:${mockUser.contact.phone}`} className="text-blue-600 underline">{mockUser.contact.phone}</a></div>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow p-6">
        <button className="w-full text-left font-semibold text-lg mb-2" onClick={() => setShowActivity(v => !v)}>
          Activity Feed {showActivity ? '▲' : '▼'}
        </button>
        {showActivity && (
          <div>
            <div className="mb-2 text-sm text-gray-500">Recent Posts & Interactions</div>
            <ul>
              {posts.map(post => (
                <li key={post.id} className="mb-3 border-b pb-2">
                  <div className="font-semibold">{mockUser.name}</div>
                  <div className="text-gray-700">{post.content}</div>
                  <div className="text-xs text-gray-400">{post.created_at} • {post.likes} likes</div>
                </li>
              ))}
            </ul>
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              onClick={loadMoreActivity}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 