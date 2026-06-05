"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MiniCalendar from "@/components/MiniCalendar";
import Calendar from "@/components/Calendar";
import { useState, useEffect, useMemo } from "react";
import { LocalCalendarEvent } from "./lib/types";

type CalendarGroup = {
  _id: string;
  name: string;
  owner: string | null;
};

type GroupEvent = {
  id: string;
  title: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  groupId: string;
  groupName: string;
};

const STATIC_GROUP: CalendarGroup = {
  _id: "inf124-group",
  name: "INF 124 Group",
  owner: "Nicole Saengsouvanna",
};

export default function MyCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendars, setCalendars] = useState<CalendarGroup[]>([STATIC_GROUP]);
  const [allEvents, setAllEvents] = useState<GroupEvent[]>([]);

  useEffect(() => {
    fetch("/api/calendar-groups")
      .then((r) => r.json())
      .then(({ groups }) => {
        if (Array.isArray(groups)) setCalendars([STATIC_GROUP, ...groups]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (calendars.length === 0) return;

    Promise.all(
      calendars.map((group) =>
        fetch(`/api/events?groupId=${group._id}`)
          .then((r) => r.json())
          .then(({ events }) =>
            Array.isArray(events)
              ? (events as Omit<GroupEvent, "groupId" | "groupName">[]).map((e) => ({
                  ...e,
                  groupId: group._id,
                  groupName: group.name,
                }))
              : []
          )
          .catch(() => [] as GroupEvent[])
      )
    ).then((results) => setAllEvents(results.flat()));
  }, [calendars]);

  const calendarEvents = useMemo<LocalCalendarEvent[]>(
    () =>
      allEvents.map((e) => ({
        id: e.id,
        title: e.title,
        dayIndex: e.dayIndex,
        startHour: e.startHour,
        endHour: e.endHour,
        invitees: [],
      })),
    [allEvents]
  );

  const eventGroupMap = useMemo(
    () => Object.fromEntries(allEvents.map((e) => [e.id, e.groupId])),
    [allEvents]
  );

  const handleEventClick = (event: LocalCalendarEvent) => {
    const groupId = eventGroupMap[event.id];
    if (groupId) router.push(`/calendar/${groupId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="hidden sm:flex w-44 shrink-0 bg-gray-50 border-r border-gray-200 flex-col overflow-y-auto">
          <MiniCalendar currentDate={currentDate} onDateChange={setCurrentDate} />

          <div className="p-3 border-t border-gray-200">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              Calendars
            </p>
            {calendars.map((n) => (
              <Link
                key={n._id}
                href={`/calendar/${n._id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-xs truncate">{n.name}</span>
              </Link>
            ))}
            <Link
              href="/create-calendar"
              className="flex items-center gap-2 px-2 py-1.5 mt-1 rounded-lg hover:bg-gray-200 transition-colors text-gray-400 text-xs"
            >
              <span className="text-base leading-none">+</span>
              New Calendar
            </Link>
          </div>
        </div>

        {/* Main calendar area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 pb-2 shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Calendar</h1>
            <p className="text-xs text-gray-400 mt-0.5">Events across all your calendars</p>
          </div>

          <div className="flex flex-1 min-h-0">
            <Calendar
              selectedPeople={[]}
              events={calendarEvents}
              currentDate={currentDate}
              showAvailability={false}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
