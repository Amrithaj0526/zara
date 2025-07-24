import React, { useState } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaRegBookmark, FaBookmark, FaFire, FaStar, FaMoneyBillWave } from 'react-icons/fa';

// Demo job data
const jobs = [
  {
    id: 1,
    title: 'Embedded Systems Engineer',
    company: 'Tech Innovators',
    logo: null,
    location: 'Chennai, India',
    posted: '2 days ago',
    type: 'Full-time',
    salary: '₹12-18 LPA',
    tags: ['Embedded', 'IoT', 'C++'],
    saved: false,
    featured: true,
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Web Solutions',
    logo: null,
    location: 'Remote',
    posted: '1 day ago',
    type: 'Remote',
    salary: '₹8-14 LPA',
    tags: ['React', 'TypeScript', 'UI/UX'],
    saved: true,
    featured: false,
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Startup Hub',
    logo: null,
    location: 'Bangalore, India',
    posted: '3 days ago',
    type: 'Full-time',
    salary: '₹20-30 LPA',
    tags: ['Product', 'Agile', 'Leadership'],
    saved: false,
    featured: true,
  },
];

const featuredCompanies = [
  { name: 'Tech Innovators', logo: null, jobs: 12 },
  { name: 'Web Solutions', logo: null, jobs: 8 },
  { name: 'Startup Hub', logo: null, jobs: 5 },
];

const trendingRoles = [
  { title: 'AI Engineer', count: 120 },
  { title: 'Frontend Developer', count: 98 },
  { title: 'Product Manager', count: 80 },
];

const JobList: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<{ [id: number]: boolean }>({});

  const handleSave = (id: number) => {
    setSavedJobs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
      {/* Sidebar */}
      <aside className="md:w-1/3 w-full space-y-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-200">
          <div className="font-bold text-blue-700 mb-2 flex items-center gap-2"><FaStar className="text-yellow-400" /> Featured Companies</div>
          <ul className="space-y-3">
            {featuredCompanies.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <FaBuilding className="text-2xl text-blue-400" />
                <div>
                  <div className="font-semibold text-blue-800">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.jobs} open jobs</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-pink-200">
          <div className="font-bold text-pink-700 mb-2 flex items-center gap-2"><FaFire className="text-pink-500" /> Trending Roles</div>
          <ul className="space-y-2">
            {trendingRoles.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <FaBriefcase className="text-gray-400" />
                <span className="font-medium">{r.title}</span>
                <span className="ml-auto text-xs text-gray-400">{r.count} jobs</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main job list */}
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Job Board</h2>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className={`bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center gap-4 border-l-4 ${job.featured ? 'border-blue-400' : 'border-gray-200'}`}>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="bg-blue-100 rounded-full p-3">
                  <FaBuilding className="text-3xl text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-blue-800">{job.title}</div>
                  <div className="text-gray-600">{job.company}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaMapMarkerAlt /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaBriefcase /> {job.type}
                    <FaMoneyBillWave /> {job.salary}
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-auto">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-28">Apply</button>
                <button onClick={() => handleSave(job.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                  {savedJobs[job.id] || job.saved ? <FaBookmark /> : <FaRegBookmark />} Save
                </button>
                <div className="text-xs text-gray-400 mt-2">Posted {job.posted}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JobList; 