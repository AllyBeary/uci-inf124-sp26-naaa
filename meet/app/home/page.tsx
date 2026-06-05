"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MiniCalendar from "@/components/MiniCalendar";
import Calendar from "@/components/Calendar";
import { useState, useEffect, useMemo } from "react";
import { LocalCalendarEvent } from "@/lib/types";

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

export default function HomePage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendars, setCalendars] = useState<CalendarGroup[]>([STATIC_GROUP]);
  const [allEvents, setAllEvents] = useState<GroupEvent[]>([]);

  // Fetch all groups
  useEffect(() => {
    fetch("/api/calendar-groups")
      .then((r) => r.json())
      .then(({ groups }) => {
        if (Array.isArray(groups)) setCalendars([STATIC_GROUP, ...groups]);
      })
      .catch(console.error);
  }, []);

  // Fetch events for every real (DB-backed) group
  useEffect(() => {
    const dbGroups = calendars.filter((g) => g._id !== "inf124-group");
    if (dbGroups.length === 0) return;

    Promise.all(
      dbGroups.map((group) =>
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

  // Convert to the shape Calendar expects
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

  // Map event id → groupId so we can navigate on click
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
        {/* Left sidebar — mini calendar + group list */}
        <div className="hidden sm:flex w-44 shrink-0 bg-gray-50 border-r border-gray-200 flex-col overflow-y-auto">
          <MiniCalendar currentDate={currentDate} onDateChange={setCurrentDate} />

          {/* Group list in sidebar */}
          <div className="p-3 border-t border-gray-200">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              Calendars
            </p>
            {calendars.map((n) => (
              <Link
                key={n._id}
                href={`/calendar/${n._id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 group"
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

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* My Calendar heading */}
          <div className="px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Calendar</h1>
            <Link
              href="/create-calendar"
              className="sm:hidden flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-medium text-gray-700 rounded-full transition-colors"
            >
              <span>+</span> New Calendar
            </Link>
          </div>

          {/* Personal calendar grid — same component as shared calendar, no availability overlay */}
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
