"use client";
import { useState } from "react";
import Link from "next/link";
import { FaUserFriends, FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";

//Hard coded data (replace later)
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
    username: "zivh"
  }
];

const activity = [
  {
    name: "Ethan Votran",
    username: "evotran"
  },
  {
    name: "John Doe",
    username: "jd26"
  }
]

function NavBar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-3 sm:px-6 flex items-center justify-between">
      <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-full bg-gray-200" />
      <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
        <Link href="/friends" aria-label="Friends" className="hover:text-black transition-colors">
          <FaUserFriends size={32} />
        </Link>
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

function SideBar({ sentRequests }: { sentRequests: { name: string; username: string }[] })
{
    return (
        <aside className="w-85 shrink-0 border-l border-gray-200 p-6">

        {/* Sent Requests */}
        <h2 className="text-lg font-bold text-gray-900 mb-3">Sent Requests</h2>
        <ul className="space-y-3 mb-6">
          {sentRequests.map((req) => (
            <li key={req.username} className="flex items-center gap-2">
              <BsPersonCircle size={28} className="text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{req.name}</p>
                <p className="text-xs text-gray-500 truncate">@{req.username}</p>
              </div>
              <span className="text-xs w-20 px-4 py-0.5 bg-gray-100 border border-gray-300 text-gray-500 rounded-full">
                Pending
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 mb-6" />
        {/* Activity */}
        <h2 className="text-lg font-bold text-gray-900 mb-3">Activity</h2>
        <ul className="space-y-4">
          {activity.map((person) => (
            <li key={person.name} className="flex items-start gap-2">
              <BsPersonCircle size={28} className="text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-black">
                  <span className="font-medium">{person.name}</span> sent you a friend request
                </p>
                <p className="text-xs text-gray-500 truncate">@{person.username}</p>
                <div className="flex gap-2 mt-1.5">
                  <button
                    className="text-xs px-4 py-0.5 bg-gray-100 border border-gray-300 text-gray-600 rounded-full hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    className="text-xs px-4 py-0.5 bg-gray-100 border border-gray-300 text-gray-600 rounded-full hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </aside>
    );
}

export default function FriendsPage() {
  const [friends, setFriends] = useState(initialFriends);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sentRequests, setSentRequests] = useState([
    {
      name: "Anver Chou",
      username: "anverc"
    },
    {
      name: "Jane Doe",
      username: "username"
    }
  ]);

  const sendFriendRequest = (user: { name: string; username: string }) => {
    setSentRequests((prev) => {
      // prevent duplicates
      if (prev.some((u) => u.username === user.username)) return prev;
      return [...prev, user];
    });
  };

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
    <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <div className="flex flex-1">
          <div className="flex-1 p-4 sm:p-6 sm:pl-8">

            {/* Displays Friends */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Friends</h1>

                {/* Add Friends */}
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
                            {searchResults.map((user) => {
                              const isSent = sentRequests.some((u) => u.username === user.username);

                              return (
                                <li key={user.username} className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-100">
                                  <BsPersonCircle size={28} className="text-gray-500 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                                  </div>
                                  <button
                                    onClick={() => sendFriendRequest(user)}
                                    disabled={isSent}
                                    className="shrink-0 w-15 py-1 border border-gray-400 text-xs rounded-lg 
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isSent ? "Sent" : "+ Add"}
                                  </button>
                                </li>);
                            })}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">Your Friends - {friends.length}</p>
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

                  {/* Remove Friends (Consider adding some error guard for users) */}
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
          <SideBar sentRequests={sentRequests}/>
        </div>
    </div>
);}
