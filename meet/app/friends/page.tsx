"use client";
import { useState } from "react";
import { FaUserFriends, FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const initialFriends = [
  { name: "Audrey Phung", 
    username: "audreyp4" 
  },

  { 
    name: "Allison Hua", 
    username: "huaat" 
  },
  { 
    name: "Nicole Saengsouvanna", 
    username: "saengson" 
},
];

function NavBar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-3 sm:px-6 flex items-center justify-between">
      <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-full bg-gray-200" />
      <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
        <button aria-label="Friends" className="hover:text-black transition-colors">
          <FaUserFriends size={32} />
        </button>
        <button aria-label="Notifications" className="hover:text-black transition-colors">
          <FaBell size={32} />
        </button>
        <button aria-label="Profile" className="hover:text-black transition-colors">
          <BsPersonCircle size={32} />
        </button>
      </div>
    </header>
  );
}

export default function FriendsPage() {
  const [friends, setFriends] = useState(initialFriends);

  const removeFriend = (username: string) => {
    setFriends((prev) => prev.filter((f) => f.username !== username));
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="p-4 sm:p-6 sm:pl-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Friends</h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-4">
          Your Friends - {friends.length}
        </p>

        <ul className="space-y-3 w-full max-w-lg">
          {friends.map((friend) => (
            <li
              key={friend.username}
              className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-3 sm:px-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                <BsPersonCircle size={30} className="text-gray-500" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{friend.name}</p>
                <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
              </div>

              <button
                onClick={() => removeFriend(friend.username)}
                className="shrink-0 w-20 py-1 border border-gray-400 text-xs text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
