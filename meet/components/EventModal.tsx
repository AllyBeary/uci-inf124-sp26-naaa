"use client";

import type { CalendarEvent } from "@/lib/types";
import { people } from "@/lib/sampleData";

type Props = {
  event: CalendarEvent;
  onClose: () => void;
};

export default function EventModal({ event, onClose }: Props) {
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const personMap = Object.fromEntries(people.map((p) => [p.id, p.name]));

  const formatTime = (h: number) =>
    `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

  const availableNames =
    event.availablePeople?.map((id) => personMap[id]).filter(Boolean) ?? [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div
          className="relative bg-white rounded-xl shadow-xl p-6 w-96 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h2>

          <p className="text-sm text-gray-800 mb-1">
            <span className="font-medium">Day:</span>{" "}
            {DAYS[event.dayIndex]}
          </p>

          <p className="text-sm text-gray-800 mb-2">
            <span className="font-medium">Time:</span>{" "}
            {formatTime(event.startHour)} - {formatTime(event.endHour)}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-900 mb-3">
            {event.description ? event.description : "No description available"}
          </p>

          {/* Available people */}
          <div className="mt-3">
            <div className="text-sm text-gray-800">
              {availableNames.length > 0
                ? availableNames.join(", ")
                : "No people available"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}