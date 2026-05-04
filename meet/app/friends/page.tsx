"use client";
import { useState } from "react";
import { FaUserFriends, FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";

const initialFriends = [
  { 
    name: "Audrey Phung", 
    username: "audreyp4" 
  },

  { 
    name: "Allison Hua", 
    username: "huaat" 
  },
  { 
    name: "Nicole Saengsouvanna", 
    username: "saengson"
  }
];

const otherUsers = [
    {
        name: "Ziv Hadar",
        username: "username"
    }
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
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const removeFriend = (username: string) => {
    setFriends((prev) => prev.filter((f) => f.username !== username));
  };

  const friendUsernames = new Set(friends.map((f) => f.username));
  const searchResults =
    searchValue.trim() === ""
      ? []
      : otherUsers.filter(
          (u) =>
            !friendUsernames.has(u.username) &&
            (u.username.toLowerCase().includes(searchValue.toLowerCase()) ||
              u.name.toLowerCase().includes(searchValue.toLowerCase()))
        );

  return (
    <div className="min-h-screen bg-white">
        <NavBar />
        <div className="p-4 sm:p-6 sm:pl-8">

        <div className="flex items-center justify-between mb-4">
            <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Friends</h1>
            <p className="text-sm text-gray-500 mt-0.5">
                Your Friends - {friends.length}
            </p>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowModal((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-medium text-gray-700 rounded-full transition-colors"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Friend
                </button>

                {showModal && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => { setShowModal(false); setSearchValue(""); }} />
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
                            <div className="relative">
                                <HiMagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search Users"
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {searchResults.map((user) => (
                                        <li key={user.username} className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-100">
                                            <BsPersonCircle size={28} className="text-gray-500 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                                            </div>
                                            <button
                                                className="shrink-0 w-15 py-1 border border-gray-400 text-xs text-gray-600 rounded-lg"
                                            >
                                                + Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
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
                className="shrink-0 w-20 py-1 border border-gray-400 text-xs text-gray-600 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
                >
                Remove
                </button>
            </li>
            ))}
        </ul>

    </div>
    </div>
);}
