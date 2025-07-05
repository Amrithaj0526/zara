import React, { useState, useEffect } from 'react';
import { profileApi } from './api';

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

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
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
      <div className="max-w-4xl mx-auto p-4">
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <button 
            onClick={() => window.location.href = '/profile/edit'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {profile ? (
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {profile.image ? (
                  <img 
                    src={`http://localhost:5000${profile.image}`}
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-2xl">
                    {profile.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profile.user?.username || 'Username'}
                </h2>
                <p className="text-gray-600">{profile.user?.email || 'email@example.com'}</p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{profile.bio}</p>
              </div>
            )}

            {/* Location */}
            {profile.location && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{profile.location}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                <div className="bg-gray-50 p-3 rounded">
                  {profile.skills.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experience && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="whitespace-pre-wrap text-gray-700">{profile.experience}</pre>
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="whitespace-pre-wrap text-gray-700">{profile.education}</pre>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!profile.bio && !profile.location && !profile.skills && !profile.experience && !profile.education && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No profile information yet</h3>
                <p className="text-gray-500 mb-4">Add some information to make your profile complete</p>
                <button 
                  onClick={() => window.location.href = '/profile/edit'}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add Profile Info
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-500 mb-4">Create your profile to get started</p>
            <button 
              onClick={() => window.location.href = '/profile/edit'}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 