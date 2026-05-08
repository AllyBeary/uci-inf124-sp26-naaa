"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CalendarConfirmationModal from "@/components/CalendarConfirmationModal";
import { calendarEvents } from "@/app/home/page";

type Person = {
  id: string;
  name: string;
  username: string;
  status: "invite-sent" | "pending";
};

export default function CreateCalendarPage() {
  const router = useRouter();
  const [calendarName, setCalendarName] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeople, setSelectedPeople] = useState([] as string[]);
  const [showModal, setShowModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonUsername, setNewPersonUsername] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [people, setPeople] = useState<Person[]>([
    {
      id: "1",
      name: "Audrey Phung",
      username: "@audreyphung",
      status: "invite-sent",
    },
    {
      id: "2",
      name: "Nicole Saeng",
      username: "@nicolesaeng",
      status: "invite-sent",
    },
  ]);

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      username: newPersonUsername.trim()
        ? newPersonUsername.trim().startsWith("@")
          ? newPersonUsername.trim()
          : `@${newPersonUsername.trim()}`
        : `@${newPersonName.trim().toLowerCase().replace(/\s+/, "")}`,
      status: "pending",
    };
    setPeople((prev) => [...prev, newPerson]);
    setNewPersonName("");
    setNewPersonUsername("");
    setShowAddForm(false);
  };

  const handleRemovePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreate = () => {
    console.log("Create clicked");
    if (!calendarName.trim()) return;
    setShowModal(true);
  };

  const handleConfirm = () => {
    calendarEvents.push({
      id: Date.now(),
      title: calendarName,
      owner: "Jane Doe",
      username: "username",
    });
    setShowModal(false);
    router.push("/home");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
  ];

  const getAvatarColor = (id: string) =>
    avatarColors[parseInt(id) % avatarColors.length];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-1 mb-6 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Create new calendar
              </h1>
              <p className="text-sm text-gray-800 mt-1">
                Set up a shared calendar and invite people to collaborate.
              </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Calendar Name Section */}
              <div className="p-6 border-b border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">
                  Calendar name
                </label>
                <input
                  type="text"
                  placeholder="Type Calendar Name Here..."
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  className="w-full px-0 py-1 text-sm font-medium text-gray-900 placeholder-gray-300 bg-transparent border-none outline-none focus:ring-0"
                />
                {/* Underline */}
                <div
                  className={`mt-2 h-px transition-all duration-200 ${
                    calendarName ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              </div>

              {/* Shared With Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                      Shared with
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {people.length}{" "}
                      {people.length === 1 ? "person" : "people"} invited
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add person
                  </button>
                </div>

                {/* Add Person Form */}
                {showAddForm && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-medium text-gray-800 mb-3">
                      New invitee
                    </p>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Full name"
                        value={newPersonName}
                        onChange={(e) => setNewPersonName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddPerson()
                        }
                        className="w-full px-3 py-2 text-sm bg-white border text-gray-700 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      />
                      <input
                        type="text"
                        placeholder="Username (optional)"
                        value={newPersonUsername}
                        onChange={(e) => setNewPersonUsername(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddPerson()
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      />
                      <div className="flex gap-2 justify-end mt-1">
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setNewPersonName("");
                            setNewPersonUsername("");
                          }}
                          className="px-3 py-2 text-xs text-gray-700 hover:text-gray-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddPerson}
                          disabled={!newPersonName.trim()}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* People List */}
                <div className="divide-y divide-gray-50">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between py-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(person.id)}`}
                        >
                          {getInitials(person.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {person.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs text-gray-600 px-2 py-0.5 rounded-full font-medium ${
                            person.status === "invite-sent"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {person.status === "invite-sent"
                            ? "Invite sent"
                            : "Pending"}
                        </span>
                        <button
                          onClick={() => handleRemovePerson(person.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-700 hover:text-red-400 rounded transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {people.length === 0 && (
                    <div className="py-8 text-center text-sm text-gray-300">
                      No one added yet. Use "+ Add person" to invite
                      collaborators.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {calendarName ? (
                    <span>
                      Creating{" "}
                      <span className="font-medium text-gray-600">
                        "{calendarName}"
                      </span>
                    </span>
                  ) : (
                    "Enter a name to get started"
                  )}
                </p>
                <button
                  onClick={handleCreate}
                  disabled={!calendarName.trim()}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium cursor-pointer text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Create calendar
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CalendarConfirmationModal
        isOpen={showModal}
        calendarName={calendarName}
        invitedCount={people.length}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}