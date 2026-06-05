"use client";

import { useState } from "react";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am..5pm
const fmt = (h: number) => {
    const period = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}${period}`;
};

type Props = {
    date: Date;
    initialStart: number;
    initialEnd: number;
    onSave: (data: { title: string; startHour: number; endHour: number }) => void;
    onClose: () => void;
};

export default function CreateEventModal({ date, initialStart, initialEnd, onSave, onClose }: Props) {
    const [title, setTitle] = useState("");
    const [startHour, setStartHour] = useState(initialStart);
    const [endHour, setEndHour] = useState(initialEnd);

    const dateLabel = date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });

    const canSave = title.trim().length > 0 && endHour > startHour;

    const handleSave = () => {
        if (!canSave) return;
        onSave({ title: title.trim(), startHour, endHour });
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-white rounded-xl shadow-lg p-6 w-96 pointer-events-auto border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Create Event on {dateLabel}?</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-black text-lg leading-none">
                            ✕
                        </button>
                    </div>

                    {/* Event name */}
                    <label className="block text-sm text-gray-600 mb-1">Event name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Study session"
                        autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />

                    {/* Time range */}
                    <p className="text-sm text-gray-600 mb-2">Selected time:</p>
                    <div className="flex items-center gap-3 mb-6">
                        <select
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
                        <span className="text-sm text-gray-500">to</span>
                        <select
                            value={endHour}
                            onChange={(e) => setEndHour(Number(e.target.value))}
                            className="flex-1 border-b border-gray-300 px-1 py-1 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
                        >
                            {HOURS.filter((h) => h > startHour).map((h) => (
                                <option key={h} value={h}>{fmt(h)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="px-5 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}