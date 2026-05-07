"use client";

import { useMemo, useState } from "react";
import {
  people,
  availabilitySlots,
  googleEvents,
} from "@/lib/sampleData";
import {
  AvailabilitySlot,
  CalendarEvent,
} from "@/lib/types";
import EventModal from "./EventModal";

type CalendarProps = {
  selectedPeople: string[];
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

export default function Calendar({ selectedPeople }: CalendarProps) {
  const personMap = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])),
    []
  );

  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  const getSlotColor = (personId: string) => {
    const person = personMap[personId];
    if (!person) return "";
    return person.color + " opacity-70";
  };

  const visibleSlots: AvailabilitySlot[] = availabilitySlots.filter((slot) =>
    selectedPeople.includes(slot.personId)
  );

  const getAvailabilityInCell = (dayIndex: number, hour: number) =>
    visibleSlots.filter(
      (slot) =>
        slot.dayIndex === dayIndex &&
        slot.startHour === hour
    );

  const getGoogleEventInCell = (dayIndex: number, hour: number) =>
    googleEvents.filter(
      (event) =>
        event.dayIndex === dayIndex &&
        event.startHour === hour
    );

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
              const slots = getAvailabilityInCell(dayIndex, hour);
              const events = getGoogleEventInCell(dayIndex, hour);

              const hasContent =
                slots.length > 0 || events.length > 0;

              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="flex-1 border-r border-gray-300 p-1 relative h-16 bg-white"
                  onClick={() => {
                    if (!hasContent) return;

                    const googleEvent = events[0];
                    const slot = slots[0];

                    if (googleEvent) {
                      setSelectedEvent(googleEvent);
                      return;
                    }

                    if (slot) {
                      const person = personMap[slot.personId];

                      setSelectedEvent({
                        id: `${slot.personId}-${dayIndex}-${hour}`,
                        personId: slot.personId,
                        title:
                          person?.name || "Availability",
                        dayIndex,
                        startHour: slot.startHour,
                        endHour: slot.endHour,
                        availablePeople: selectedPeople,
                      });
                    }
                  }}
                >
                  {/* Availability */}
                  {slots.map((slot, index) => {
                    const duration =
                      slot.endHour - slot.startHour;
                    const person = personMap[slot.personId];

                    return (
                      <div
                        key={`${slot.personId}-${index}`}
                        className={`absolute left-1 right-1 ${getSlotColor(
                          slot.personId
                        )} rounded border border-gray-300 cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
                        style={{
                          height: `${duration * 4}rem`,
                          top: `${index * 20}%`,
                          width: `calc(100% / ${slots.length})`,
                          left: `${
                            (index * 100) / slots.length
                          }%`,
                        }}
                      >
                        <div className="text-[10px] text-gray-900 p-1 truncate font-semibold">
                          {person?.name}
                        </div>
                      </div>
                    );
                  })}

                  {/* Google Events */}
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 bg-blue-500 opacity-80 rounded border border-blue-600 cursor-pointer hover:shadow-md transition-shadow overflow-hidden z-10"
                      style={{
                        height: `${
                          Math.max(
                            event.endHour - event.startHour,
                            1
                          ) * 4
                        }rem`,
                        top: 0,
                      }}
                    >
                      <div className="text-xs text-white p-1 truncate font-medium leading-tight">
                        {event.title}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}