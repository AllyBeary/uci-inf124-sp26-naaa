"use client";
import { useState } from "react";
import Link from "next/link";
import { FaUserFriends, FaCalendar } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import Header from "@/components/Header";
import { HiMagnifyingGlass } from "react-icons/hi2";

//Hard coded data (replace later)
const friendsList = [
  { name: "Audrey Phung", username: "audreyp4" },
  { name: "Allison Hua", username: "huaat" },
  { name: "Nicole Saengsouvanna", username: "saengson" },
];

const sentRequestsList = [
  { name: "Anver Chou", username: "anverc" },
  { name: "Jane Doe", username: "username" },
];

const activityList = [
  { name: "Ethan Votran", username: "evotran" },
  { name: "John Doe", username: "jd26" },
];

const otherUsers = [
  {
    name: "Ziv Hadar",
    username: "zivh",
  },
];

function SideBar({
  sentRequests,
  activity,
  onAccept,
  onDecline,
}: {
  sentRequests: { name: string; username: string }[];
  activity: { name: string; username: string }[];
  onAccept: (user: { name: string; username: string }) => void;
  onDecline: (username: string) => void;
}) {
  return (
    <aside className="w-85 shrink-0 border-l border-gray-200 p-6">
      {/* Sent Requests */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">Sent Requests</h2>
      <ul className="space-y-3 mb-6">
        {sentRequests.map((req) => (
          <li key={req.username} className="flex items-center gap-2">
            <BsPersonCircle size={28} className="text-gray-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {req.name}
              </p>
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
            <BsPersonCircle
              size={28}
              className="text-gray-500 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-black">
                <span className="font-medium">{person.name}</span> sent you a
                friend request
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{person.username}
              </p>
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => onAccept(person)}
                  className="text-xs px-4 py-0.5 bg-gray-100 border border-gray-300 text-gray-600 rounded-full hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-colors"
                >
                  Accept
                </button>

                <button
                  onClick={() => onDecline(person.username)}
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
  const [friends, setFriends] = useState(friendsList);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sentRequests, setSentRequests] = useState(sentRequestsList);
  const [activity, setActivity] = useState(activityList);

  const sendFriendRequest = (user: { name: string; username: string }) => {
    if (sentRequestsList.some((u) => u.username === user.username)) return;
    sentRequestsList.push(user);
    setSentRequests([...sentRequestsList]);
  };

  const removeFriend = (username: string) => {
    const idx = friendsList.findIndex((f) => f.username === username);
    if (idx !== -1) friendsList.splice(idx, 1);
    setFriends([...friendsList]);
  };

  const acceptRequest = (user: { name: string; username: string }) => {
    if (!friendsList.some((f) => f.username === user.username)) {
      friendsList.push(user);
    }
    const idx = activityList.findIndex((u) => u.username === user.username);
    if (idx !== -1) activityList.splice(idx, 1);
    setFriends([...friendsList]);
    setActivity([...activityList]);
  };

  const declineRequest = (username: string) => {
    const idx = activityList.findIndex((u) => u.username === username);
    if (idx !== -1) activityList.splice(idx, 1);
    setActivity([...activityList]);
  };

  const friendUsernames = new Set(friends.map((f) => f.username));
  const searchResults =
    searchValue.trim() === ""
      ? []
      : otherUsers.filter(
          (u) =>
            !friendUsernames.has(u.username) &&
            (u.username.toLowerCase().includes(searchValue.toLowerCase()) ||
              u.name.toLowerCase().includes(searchValue.toLowerCase())),
        );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-1">
        <div className="flex-1 p-4 sm:p-6 sm:pl-8">
          {/* Displays Friends */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Friends
              </h1>

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
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => {
                        setShowModal(false);
                        setSearchValue("");
                      }}
                    />
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
                      <div className="relative">
                        <HiMagnifyingGlass
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
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
                            const isSent = sentRequests.some(
                              (u) => u.username === user.username,
                            );

                            return (
                              <li
                                key={user.username}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-100"
                              >
                                <BsPersonCircle
                                  size={28}
                                  className="text-gray-500 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    @{user.username}
                                  </p>
                                </div>
                                <button
                                  onClick={() => sendFriendRequest(user)}
                                  disabled={isSent}
                                  className="shrink-0 w-15 py-1 border border-gray-400 text-xs rounded-lg 
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSent ? "Sent" : "+ Add"}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Your Friends - {friends.length}
            </p>
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
                  <p className="font-semibold text-gray-900 truncate">
                    {friend.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    @{friend.username}
                  </p>
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
        <SideBar
          sentRequests={sentRequests}
          activity={activity}
          onAccept={acceptRequest}
          onDecline={declineRequest}
        />
      </div>
    </div>
  );
}
