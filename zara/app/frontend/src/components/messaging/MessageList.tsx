import React, { useState } from 'react';
import { FaUserCircle, FaPaperclip, FaSmile, FaSearch, FaCircle } from 'react-icons/fa';

// Demo users and chats
const users = [
  { id: 1, name: 'Aathman Ansari', avatar: null, online: true, lastMessage: 'Let’s connect soon!', unread: 2 },
  { id: 2, name: 'Dheena', avatar: null, online: false, lastMessage: 'Thanks for the update.', unread: 0 },
  { id: 3, name: 'Priya Sharma', avatar: null, online: true, lastMessage: 'See you at the meeting.', unread: 1 },
];

const demoMessages = [
  { id: 1, sender: 'You', content: 'Hi there!', time: '10:00 AM' },
  { id: 2, sender: 'Aathman Ansari', content: 'Hello! How can I help you?', time: '10:01 AM' },
  { id: 3, sender: 'You', content: 'I wanted to discuss the new project.', time: '10:02 AM' },
  { id: 4, sender: 'Aathman Ansari', content: 'Sure, let’s chat!', time: '10:03 AM' },
];

const peopleSuggestions = [
  { id: 4, name: 'Ravi Kumar', avatar: null, online: false },
  { id: 5, name: 'Meera Patel', avatar: null, online: true },
];

const MessageList: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages] = useState(demoMessages);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4 h-[70vh]">
      {/* Sidebar: Chat List */}
      <aside className="md:w-1/3 w-full space-y-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-200 h-full flex flex-col">
          <div className="font-bold text-blue-700 mb-4 flex items-center gap-2"><FaSearch /> Chats</div>
          <input className="mb-4 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-200" placeholder="Search..." />
          <ul className="flex-1 space-y-3 overflow-y-auto">
            {users.map(u => (
              <li key={u.id} onClick={() => setSelectedUser(u)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-50 transition ${selectedUser.id === u.id ? 'bg-blue-100' : ''}`}>
                <span className="relative">
                  <FaUserCircle className="text-3xl text-blue-400" />
                  {u.online && <FaCircle className="absolute bottom-0 right-0 text-green-400 text-xs" />}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">{u.name}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[120px]">{u.lastMessage}</div>
                </div>
                {u.unread > 0 && <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{u.unread}</span>}
              </li>
            ))}
          </ul>
        </div>
        {/* People Suggestions */}
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-pink-200">
          <div className="font-bold text-pink-700 mb-2">People you may want to message</div>
          <ul className="space-y-2">
            {peopleSuggestions.map(p => (
              <li key={p.id} className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-blue-400" />
                <span className="font-medium">{p.name}</span>
                {p.online && <FaCircle className="text-green-400 text-xs" />}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col bg-white rounded-xl shadow p-5 border-l-4 border-blue-200 h-full">
        <div className="flex items-center gap-3 mb-4">
          <FaUserCircle className="text-3xl text-blue-400" />
          <div>
            <div className="font-semibold text-blue-800">{selectedUser.name}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">{selectedUser.online ? <FaCircle className="text-green-400 text-xs" /> : <FaCircle className="text-gray-300 text-xs" />} {selectedUser.online ? 'Online' : 'Offline'}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-2">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center my-auto">No messages yet. Start a conversation!</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'You' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="text-xs font-semibold">{msg.sender}</div>
                  <div>{msg.content}</div>
                  <div className="text-[10px] text-gray-400 text-right">{msg.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Message input */}
        <form className="border-t pt-3 flex gap-2 items-center mt-2" onSubmit={e => e.preventDefault()}>
          <button type="button" className="text-blue-400 text-xl"><FaSmile /></button>
          <input type="text" className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} disabled />
          <button type="button" className="text-blue-400 text-xl"><FaPaperclip /></button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" disabled>Send</button>
        </form>
      </main>
    </div>
  );
};

export default MessageList; 