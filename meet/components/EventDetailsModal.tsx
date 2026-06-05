"use client";

import { useState } from "react";
import { LocalCalendarEvent } from "@/lib/types";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am..5pm
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fmt = (h: number) => {
    const period = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}${period}`;
};

type Props = {
    event: LocalCalendarEvent;
    onSave: (updated: { startHour: number; endHour: number }) => void;
    onDelete: () => void;
    onClose: () => void;
};

export default function EventDetailsModal({ event, onSave, onDelete, onClose }: Props) {
    const [startHour, setStartHour] = useState(event.startHour);
    const [endHour, setEndHour] = useState(event.endHour);

    const canSave = endHour > startHour;

    const handleSave = () => {
        if (!canSave) return;
        onSave({ startHour, endHour });
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="event-details-title"
                    className="bg-white rounded-xl shadow-lg p-6 w-96 pointer-events-auto border border-gray-200"
                >
                    <div className="flex items-start justify-between mb-1">
                        <h2 id="event-details-title" className="text-lg font-semibold text-gray-900">{event.title}</h2>
                        <button onClick={onClose} aria-label="Close event details" className="text-gray-500 hover:text-black text-lg leading-none">
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{DAYS[event.dayIndex]}</p>

                    {/* Time range */}
                    <p className="text-sm text-gray-600 mb-2">Time:</p>
                    <div className="flex items-center gap-3 mb-6">
                        <select
                            aria-label="Start time"
                            value={startHour}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setStartHour(val);
                                if (endHour <= val) setEndHour(val + 1);
                            }}
                            className="flex-1 border-b border-gray-300 px-1 py-1 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
                        >
                            {HOURS.filter((h) => h < 17).map((h) => (
                                <option key={h} value={h}>{fmt(h)}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500" aria-hidden="true">to</span>
                        <select
                            aria-label="End time"
                            value={endHour}
                            onChange={(e) => setEndHour(Number(e.target.value))}
                            className="flex-1 border-b border-gray-300 px-1 py-1 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
                        >
                            {HOURS.filter((h) => h > startHour).map((h) => (
                                <option key={h} value={h}>{fmt(h)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="px-5 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}