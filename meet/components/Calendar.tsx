"use client";

import { useMemo } from "react";
import { people, availabilitySlots } from "@/lib/userData";
import { AvailabilitySlot } from "@/lib/types";

type CalendarProps = {
  selectedPeople: string[];
  mySlots?: AvailabilitySlot[];
  showAvailability?: boolean;
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const overlapColor = (count: number) => {
  if (count === 1) return "bg-green-200";
  if (count === 2) return "bg-green-400";
  if (count === 3) return "bg-green-600";
  return "bg-green-800";
};

export default function Calendar({ selectedPeople, mySlots = [], showAvailability = true }: CalendarProps) {
  const personMap = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])),
    []
  );

  const hardcodedSlots: AvailabilitySlot[] = availabilitySlots.filter((slot) =>
    selectedPeople.includes(slot.personId)
  );

  const allSlots = [...hardcodedSlots, ...mySlots];

  const getSlotsInCell = (dayIndex: number, hour: number) =>
    allSlots.filter(
      (slot) => slot.dayIndex === dayIndex && hour >= slot.startHour && hour < slot.endHour
    );

  const getName = (slot: AvailabilitySlot) =>
    slot.personId === "me" ? "You" : (personMap[slot.personId]?.name ?? "");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex">
        <div className="w-20 border-r border-gray-300" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex-1 border-r border-gray-300 px-4 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-900"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="flex border-b border-gray-300">
            {/* Time */}
            <div className="w-20 border-r border-gray-300 px-3 py-4 text-sm text-gray-800 bg-gray-50">
              {hour > 12 ? hour - 12 : hour}
              {hour >= 12 ? "pm" : "am"}
            </div>

            {/* Cells */}
            {DAYS.map((_, dayIndex) => {
              const slots = getSlotsInCell(dayIndex, hour);
              const hasContent = slots.length > 0;
              const startingSlots = slots.filter((s) => s.startHour === hour);

              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  className={`flex-1 border-r border-gray-300 relative h-16 transition-colors ${
                    showAvailability && hasContent
                      ? overlapColor(slots.length)
                      : "bg-white"
                  }`}
                >
                  {showAvailability && startingSlots.map((slot) => (
                    <div
                      key={`${slot.personId}-${slot.startHour}`}
                      className="text-[10px] text-gray-800 px-1 pt-1 truncate font-semibold leading-tight"
                    >
                      {getName(slot)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
