"use client";

import { useMemo } from "react";
import { availabilitySlots, people } from "@/lib/sampleData";

type CalendarProps = {
  selectedPeople: string[];
  currentDate: Date;
  googleEvents?: Array<{
    dayIndex: number;
    startHour: number;
    endHour: number;
    duration: number;
    event: {
      id: string;
      summary: string;
    };
  }>;
  isLoggedIn?: boolean;
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am to 5pm
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6];

export default function Calendar({ selectedPeople, currentDate, googleEvents = [], isLoggedIn = false }: CalendarProps) {
  const personMap = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])),
    []
  );

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);

  const getSlotColor = (personId: string) => {
    const person = personMap[personId];
    if (!person) return "";

    // Add opacity to the color for semi-transparency
    const colorClass = person.color;
    return colorClass + " opacity-70";
  };

  // Determine which slots to show based on selected people
  const visibleSlots = availabilitySlots.filter((slot) =>
    selectedPeople.includes(slot.personId)
  );

  // Group slots by position for proper rendering
  const slotsByPosition = useMemo(() => {
    const map = new Map<string, string[]>();

    visibleSlots.forEach((slot) => {
      const key = `${slot.dayIndex}-${slot.startHour}-${slot.endHour}`;
      const personIds = map.get(key) || [];
      personIds.push(slot.personId);
      map.set(key, personIds);
    });

    return map;
  }, [visibleSlots]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Header - Days of week */}
          <div className="flex">
            <div className="w-20 flex-shrink-0 border-r border-gray-200"></div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex-1 border-r border-gray-200 px-4 py-3 bg-gray-100"
              >
                <div className="text-sm font-semibold text-center text-gray-900">{day}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {HOURS.map((hour) => (
            <div key={hour} className="flex border-b border-gray-200">
              {/* Time label */}
              <div className="w-20 flex-shrink-0 border-r border-gray-200 px-3 py-4 bg-gray-50 text-sm text-gray-600">
                {`${hour > 12 ? hour - 12 : hour}${hour >= 12 ? "pm" : "am"}`}
              </div>

              {/* Daily slots */}
              {DAY_INDICES.map((dayIndex) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="flex-1 border-r border-gray-200 p-1 relative h-16 bg-white"
                >
                  {/* Render availability blocks for this time slot */}
                  {visibleSlots
                    .filter(
                      (slot) =>
                        slot.dayIndex === dayIndex &&
                        slot.startHour === hour
                    )
                    .map((slot, index) => {
                      const duration = slot.endHour - slot.startHour;
                      const height = `${duration * 4}rem`;
                      const person = personMap[slot.personId];

                      return (
                        <div
                          key={`${slot.personId}-${index}`}
                          className={`absolute left-1 right-1 ${getSlotColor(
                            slot.personId
                          )} rounded border border-gray-300 cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
                          style={{
                            height,
                            top: `${index * 20}%`,
                            width: `calc(100% / ${visibleSlots.filter(
                              (s) =>
                                s.dayIndex === dayIndex &&
                                s.startHour === hour
                            ).length})`,
                            left: `${(index * 100) / visibleSlots.filter(
                              (s) =>
                                s.dayIndex === dayIndex &&
                                s.startHour === hour
                            ).length}%`,
                          }}
                          title={person?.name}
                        >
                          <div className="text-[10px] text-gray-800 p-1 truncate font-semibold">
                            {slot.title || person?.name}
                          </div>
                        </div>
                      );
                    })}

                  {/* Render Google Calendar events for this time slot */}
                  {googleEvents
                    .filter(
                      (event) =>
                        event.dayIndex === dayIndex &&
                        event.startHour === hour
                    )
                    .map((event, index) => {
                      const rawHeight = event.duration * 4;
                      const height = `${Math.max(rawHeight, 2)}rem`;

                      return (
                        <div
                          key={`google-${event.event.id}-${index}`}
                          className="absolute left-1 right-1 bg-blue-500 opacity-80 rounded border border-blue-600 cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                          style={{
                            height,
                            minHeight: "2rem",
                            top: 0,
                          }}
                          title={`${event.event.summary} (${event.startHour > 12 ? event.startHour - 12 : event.startHour}${event.startHour >= 12 ? "pm" : "am"} - ${event.endHour > 12 ? event.endHour - 12 : event.endHour}${event.endHour >= 12 ? "pm" : "am"})`}
                        >
                          <div className="text-xs text-white p-1 truncate font-medium leading-tight">
                            {event.event.summary}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
