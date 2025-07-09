import React, { useState, useEffect } from 'react';
import { profileApi } from './api';
import { FaUser, FaMapMarkerAlt, FaTools, FaBriefcase, FaGraduationCap, FaInfoCircle, FaEnvelope, FaGlobe, FaLinkedin, FaLanguage, FaUserFriends, FaCheckCircle, FaStar, FaAward, FaDownload, FaChartLine, FaCertificate, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface Profile {
  id: number;
  user_id: number;
  bio: string;
  location: string;
  skills: string;
  experience: string;
  education: string;
  image: string;
  user: {
    username: string;
    email: string;
  };
}

// Demo/mock data for new fields
const demoLanguages = ['English', 'Tamil', 'Hindi'];
const demoLinks = [
  { type: 'Email', icon: <FaEnvelope />, value: 'email@example.com', href: 'mailto:email@example.com' },
  { type: 'Website', icon: <FaGlobe />, value: 'www.example.com', href: 'https://www.example.com' },
  { type: 'LinkedIn', icon: <FaLinkedin />, value: 'linkedin.com/in/example', href: 'https://linkedin.com/in/example' },
];
const demoConnections = [
  { id: 1, name: 'Aathman Ansari', avatar: null },
  { id: 2, name: 'Dheena', avatar: null },
  { id: 3, name: 'Priya Sharma', avatar: null },
  { id: 4, name: 'Ravi Kumar', avatar: null },
  { id: 5, name: 'Meera Patel', avatar: null },
];
const demoProfileCompletion = 80;
const demoPeopleSuggestions = [
  { id: 6, name: 'Sundar Rajan', avatar: null },
  { id: 7, name: 'Anjali Menon', avatar: null },
];

// Demo awards/certifications
const demoAwards = [
  { id: 1, title: 'AWS Certified Solutions Architect', year: 2024 },
  { id: 2, title: 'Best Innovator Award', year: 2023 },
];
// Demo profile stats
const demoStats = [
  { label: 'Connections', value: 187 },
  { label: 'Profile Views', value: 1420 },
  { label: 'Search Appearances', value: 312 },
];

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.id) {
      setPostsLoading(true);
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      fetch(`http://localhost:5000/posts/?user_id=${user.id}`, { headers })
        .then(res => res.json())
        .then(data => {
          setMyPosts(data.posts || []);
          setPostsError(null);
        })
        .catch(() => setPostsError('Failed to load your posts'))
        .finally(() => setPostsLoading(false));
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="md:w-1/3 w-full space-y-8 order-2 md:order-1">
        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-200">
          <div className="font-bold text-blue-700 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-400 animate-bounce" /> Profile Completion</div>
          <div className="w-full bg-blue-100 rounded-full h-3 mb-2">
            <motion.div className="bg-blue-600 h-3 rounded-full" style={{ width: `${demoProfileCompletion}%` }} initial={{ width: 0 }} animate={{ width: `${demoProfileCompletion}%` }} transition={{ duration: 1 }} />
          </div>
          <div className="text-xs text-gray-500 mb-2">{demoProfileCompletion}% complete</div>
          <button className="mt-2 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform">Complete your profile</button>
        </motion.div>
        {/* Profile Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-200">
          <div className="font-bold text-yellow-700 mb-2 flex items-center gap-2"><FaChartLine className="text-yellow-400" /> Profile Stats</div>
          <ul className="space-y-1">
            {demoStats.map(stat => (
              <li key={stat.label} className="flex justify-between text-sm">
                <span>{stat.label}</span>
                <span className="font-bold text-blue-700">{stat.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Awards/Certifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="bg-white rounded-xl shadow p-5 border-l-4 border-green-200">
          <div className="font-bold text-green-700 mb-2 flex items-center gap-2"><FaAward className="text-green-400" /> Awards & Certifications</div>
          <ul className="space-y-1">
            {demoAwards.map(a => (
              <li key={a.id} className="flex items-center gap-2 text-sm">
                <FaCertificate className="text-blue-400" />
                <span>{a.title}</span>
                <span className="ml-auto text-xs text-gray-400">{a.year}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Download Resume */}
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-semibold shadow flex items-center justify-center gap-2 hover:scale-105 transition-transform">
          <FaDownload /> Download Resume
        </motion.button>
        {/* People Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="bg-white rounded-xl shadow p-5 border-l-4 border-pink-200">
          <div className="font-bold text-pink-700 mb-2">People you may know</div>
          <ul className="space-y-2">
            {demoPeopleSuggestions.map(p => (
              <li key={p.id} className="flex items-center gap-2 group cursor-pointer hover:bg-pink-50 p-2 rounded transition">
                <FaUser className="text-2xl text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium group-hover:text-pink-700 transition-colors">{p.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </aside>
      {/* Main Profile Content */}
      <main className="flex-1 order-1 md:order-2">
        {/* Banner/Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mb-8">
          <div className="h-32 md:h-40 bg-gradient-to-r from-blue-200 to-blue-400 rounded-t-xl"></div>
          <div className="absolute left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 -bottom-12 md:bottom-0">
            <motion.div whileHover={{ scale: 1.05 }} className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow-xl cursor-pointer group">
              {profile?.image ? (
                <img 
                  src={`http://localhost:5000${profile.image}`}
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover group-hover:brightness-90 transition"
                />
              ) : (
                <FaUser className="text-gray-400 text-6xl" />
              )}
              {/* User hover card demo */}
              <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-4 w-64 z-10 border border-blue-100 hidden group-hover:block">
                <div className="flex items-center gap-3 mb-2">
                  <FaUser className="text-blue-400 text-2xl" />
                  <div>
                    <div className="font-bold text-blue-800">{profile?.user?.username || 'Username'}</div>
                    <div className="text-xs text-gray-400">{profile?.location || 'Location'}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{profile?.bio?.slice(0, 60) || 'No bio yet.'}</div>
                <div className="flex gap-2 flex-wrap">
                  {profile?.skills?.split(',').slice(0, 3).map((s, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{s.trim()}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <div className="pt-16 md:pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-400" /> {profile?.user?.username || 'Username'}
            </h2>
            <div className="text-blue-600 text-lg font-semibold">Professional Headline or Role</div>
            <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-300" /> {profile?.location || 'Location'}</p>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.location.href = '/profile/edit'} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow font-semibold flex items-center gap-2">
            <FaEdit /> Edit Profile
          </motion.button>
        </div>
        {/* About/Bio */}
        {profile?.bio && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaInfoCircle /> About</h3>
            <p className="text-gray-700 bg-blue-50 p-4 rounded shadow-inner">{profile.bio}</p>
          </motion.div>
        )}
        {/* Contact/Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaEnvelope /> Contact & Links</h3>
          <div className="flex flex-wrap gap-4">
            {demoLinks.map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition">
                {link.icon} {link.value}
              </a>
            ))}
          </div>
        </motion.div>
        {/* Skills with interactive endorsements */}
        {profile?.skills && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaTools /> Skills</h3>
            <div className="bg-blue-50 p-4 rounded shadow-inner flex flex-wrap gap-2">
              {profile.skills.split(',').map((skill, index) => (
                <motion.span 
                  key={index}
                  whileHover={{ scale: 1.08 }}
                  className="inline-block bg-blue-200 text-blue-900 px-3 py-1 rounded-full font-semibold shadow flex items-center gap-1 cursor-pointer group relative"
                >
                  {skill.trim()} <FaStar className="text-yellow-400 group-hover:scale-125 transition-transform" />
                  {/* Endorsement count demo */}
                  <span className="ml-1 text-xs text-gray-500 group-hover:text-blue-700 transition-colors">+{Math.floor(Math.random()*20)+1}</span>
                  {/* Endorse button demo */}
                  <motion.button whileTap={{ scale: 0.95 }} className="absolute right-0 top-full mt-1 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow hidden group-hover:block">Endorse</motion.button>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        {/* Languages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaLanguage /> Languages</h3>
          <div className="flex gap-2 flex-wrap">
            {demoLanguages.map((lang, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{lang}</span>
            ))}
          </div>
        </motion.div>
        {/* Experience Timeline */}
        {profile?.experience && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaBriefcase /> Experience</h3>
            <div className="bg-blue-50 p-4 rounded shadow-inner">
              {/* Timeline demo: split by lines, add icons */}
              {profile.experience.split('\n').map((exp, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <FaBriefcase className="text-blue-400 mt-1" />
                  <span className="text-gray-700 whitespace-pre-wrap">{exp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {/* Education Timeline */}
        {profile?.education && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaGraduationCap /> Education</h3>
            <div className="bg-blue-50 p-4 rounded shadow-inner">
              {profile.education.split('\n').map((edu, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <FaGraduationCap className="text-blue-400 mt-1" />
                  <span className="text-gray-700 whitespace-pre-wrap">{edu}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {/* Connections with hover cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2"><FaUserFriends /> Connections</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {demoConnections.map(conn => (
              <motion.div key={conn.id} whileHover={{ scale: 1.08 }} className="flex flex-col items-center group cursor-pointer relative">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-2xl text-blue-700 mb-1">
                  <FaUser />
                </div>
                <span className="text-xs text-blue-800 font-medium text-center w-16 truncate">{conn.name}</span>
                {/* Hover card demo */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-3 w-48 z-10 border border-blue-100 hidden group-hover:block">
                  <div className="font-bold text-blue-800 mb-1">{conn.name}</div>
                  <div className="text-xs text-gray-400 mb-1">Mutual: 3</div>
                  <button className="w-full bg-blue-600 text-white py-1 rounded text-xs font-semibold hover:bg-blue-700 transition">Connect</button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* My Posts/Recent Activity with animated transitions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-2">Recent Activity</h3>
          {postsLoading ? (
            <div>Loading your posts...</div>
          ) : postsError ? (
            <div className="text-red-500">{postsError}</div>
          ) : myPosts.length === 0 ? (
            <div className="text-gray-400">No recent activity yet.</div>
          ) : (
            <ul className="space-y-2">
              {myPosts.slice(0, 5).map(post => (
                <motion.li key={post.id} whileHover={{ scale: 1.02 }} className="bg-blue-50 rounded p-3 shadow flex flex-col md:flex-row md:items-center gap-2 cursor-pointer hover:bg-blue-100 transition">
                  <span className="font-semibold text-blue-800">{post.title || post.content?.slice(0, 40) || 'Untitled Post'}</span>
                  <span className="text-xs text-gray-400 ml-auto">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileView; 