"use client";

import { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
const formatHour = (h: number) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;

type Props = {
  onConfirm: (dayIndices: number[], startHour: number, endHour: number) => void;
  onClose: () => void;
};

export default function AddAvailabilityModal({ onConfirm, onClose }: Props) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(11);

  const toggleDay = (i: number) => {
    setSelectedDays((prev) =>
      prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]
    );
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0 || endHour <= startHour) return;
    onConfirm(selectedDays, startHour, endHour);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-avail-title"
          className="bg-white rounded-xl shadow-lg p-6 w-96 pointer-events-auto"
        >
          <h2 id="add-avail-title" className="text-lg font-semibold text-gray-900 mb-4">Add Your Availability</h2>

          {/* Add by DAYS OF THE WEEK */}
          <p className="text-sm text-gray-600 mb-2" id="days-label">Days</p>
          <div role="group" aria-labelledby="days-label" className="flex flex-wrap gap-2 mb-5">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                aria-pressed={selectedDays.includes(i)}
                aria-label={day}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedDays.includes(i)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Selecting Time */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="avail-start" className="text-sm text-gray-600 block mb-1">Start Time</label>
              <select
                id="avail-start"
                value={startHour}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStartHour(val);
                  if (endHour <= val) setEndHour(val + 1);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {HOURS.filter((h) => h < 17).map((h) => (
                  <option key={h} value={h}>{formatHour(h)}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="avail-end" className="text-sm text-gray-600 block mb-1">End Time</label>
              <select
                id="avail-end"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {HOURS.filter((h) => h > startHour).map((h) => (
                  <option key={h} value={h}>{formatHour(h)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedDays.length === 0 || endHour <= startHour}
              className="flex-1 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
