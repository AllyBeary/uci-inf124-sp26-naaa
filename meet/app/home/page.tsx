"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { BsPersonCircle } from "react-icons/bs";
import { useState, useEffect } from "react";

type CalendarGroup = {
  _id: string;
  name: string;
  owner: { displayName?: string; email?: string } | null;
};

const calendarEvents: CalendarGroup = {
  _id: "inf124-group",
  name: "INF 124 Group",
  owner: { displayName: "Nicole Saengsouvanna" },
};

export default function HomePage() {
  const [calendars, setCalendars] = useState<CalendarGroup[]>([calendarEvents]);

  useEffect(() => {
    fetch("/api/calendar-groups")
      .then(r => r.json())
      .then(({ groups }) => { if (Array.isArray(groups)) setCalendars([calendarEvents, ...groups]); })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-1">
        <div className="flex-1 p-4 sm:p-6 sm:pl-8">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Calendars
              </h1>
              <Link href="/create-calendar" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-medium text-gray-700 rounded-full transition-colors">
                <span className="text-lg leading-none">+</span>
                New Calendar
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {calendars.map((n) => (
                <div key={n._id} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">{n.name}</h2>
                    <p className="text-xs text-gray-500 mb-1">Created By:</p>
                    <div className="flex items-center gap-2">
                      <BsPersonCircle size={28} className="text-gray-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{n.owner?.displayName ?? n.owner?.email ?? "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-200">
                    <button className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200">
                      Share
                    </button>
                    <Link
                      href={`/calendar/${n._id}`}
                      className="flex-1 py-2 text-sm text-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
