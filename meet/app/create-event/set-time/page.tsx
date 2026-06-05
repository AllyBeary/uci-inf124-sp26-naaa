"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { people } from "../../lib/userData";

function generateTimeOptions() {
    const options: { label: string; value: number }[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const total = h * 60 + m;
            const period = h < 12 ? "AM" : "PM";
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            const label = `${hour12}:${String(m).padStart(2, "0")} ${period}`;
            options.push({ label, value: total });
        }
    }
    return options;
}

const TIME_OPTIONS = generateTimeOptions();

function minutesToLabel(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h < 12 ? "AM" : "PM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function snapToHalfHour(minutes: number) {
    return Math.round(minutes / 30) * 30;
}

export default function CreateEventSetTimePage() {
    const router = useRouter();
    const [selectedPeople, setSelectedPeople] = useState<string[]>(
        people.map((p) => p.id)
    );
    const [sidebarDate, setSidebarDate] = useState(new Date(2026, 3, 1));
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [startMinutes, setStartMinutes] = useState(9 * 60);
    const [endMinutes, setEndMinutes] = useState(14 * 60 + 30);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<"start" | "end" | "move" | null>(null);
    const dragStartX = useRef(0);
    const dragStartRange = useRef({ start: 0, end: 0 });

    useEffect(() => {
        const stored = localStorage.getItem("createEvent_selectedDates");
        if (stored) setSelectedDates(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging.current || !containerRef.current) return;
            const containerWidth = containerRef.current.getBoundingClientRect().width;
            const deltaX = e.clientX - dragStartX.current;
            const deltaMinutes = snapToHalfHour((deltaX / containerWidth) * 1440);
            const { start, end } = dragStartRange.current;
            const duration = end - start;

            if (dragging.current === "start") {
                const newStart = Math.max(0, Math.min(start + deltaMinutes, end - 30));
                setStartMinutes(snapToHalfHour(newStart));
            } else if (dragging.current === "end") {
                const newEnd = Math.max(start + 30, Math.min(end + deltaMinutes, 1440));
                setEndMinutes(snapToHalfHour(newEnd));
            } else if (dragging.current === "move") {
                const newStart = Math.max(0, Math.min(start + deltaMinutes, 1440 - duration));
                setStartMinutes(snapToHalfHour(newStart));
                setEndMinutes(snapToHalfHour(newStart + duration));
            }
        };

        const onMouseUp = () => { dragging.current = null; };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const startDrag = (e: React.MouseEvent, type: "start" | "end" | "move") => {
        e.preventDefault();
        dragging.current = type;
        dragStartX.current = e.clientX;
        dragStartRange.current = { start: startMinutes, end: endMinutes };
    };

    const startPct = (startMinutes / 1440) * 100;
    const widthPct = ((endMinutes - startMinutes) / 1440) * 100;

    //FIX: Should redirect to respective calendar page, Shared calendar pages VS personal calendar page
    const handleInviteFriends = () => {
        localStorage.setItem("createEvent_startTime", String(startMinutes));
        localStorage.setItem("createEvent_endTime", String(endMinutes));
        router.push("/");
    };

    const formatDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedPeople={selectedPeople}
                    onSelectedPeopleChange={setSelectedPeople}
                    currentDate={sidebarDate}
                    onCurrentDateChange={setSidebarDate}
                    showAvailability={false}
                />

                <main className="flex-1 flex flex-col overflow-hidden p-6 bg-gray-50">
                    <button
                        onClick={() => router.back()}
                        className="flex cursor-pointer items-center gap-1 mb-4 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm min-h-0">

                        {/* Card Header */}
                        <div className="px-8 py-5 border-b border-gray-100 shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Select Time Range</h2>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto flex flex-col items-center px-8 py-6">
                            <div className="w-full max-w-2xl flex flex-col gap-8">

                                {/* Time dropdowns */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                                            Start Time
                                        </label>
                                        <select
                                            value={startMinutes}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setStartMinutes(val);
                                                if (val >= endMinutes) setEndMinutes(val + 30);
                                            }}
                                            className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition cursor-pointer"
                                        >
                                            {TIME_OPTIONS.filter((o) => o.value < 23 * 60 + 30).map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                                            End Time
                                        </label>
                                        <select
                                            value={endMinutes}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setEndMinutes(val);
                                                if (val <= startMinutes) setStartMinutes(val - 30);
                                            }}
                                            className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition cursor-pointer"
                                        >
                                            {TIME_OPTIONS.filter((o) => o.value > startMinutes).map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Draggable timeline */}
                                <div>
                                    <div
                                        ref={containerRef}
                                        className="relative h-14 bg-gray-100 rounded-xl overflow-hidden select-none"
                                    >
                                        <div
                                            className="absolute top-0 bottom-0 bg-indigo-500 rounded-xl flex items-center cursor-grab active:cursor-grabbing"
                                            style={{ left: `${startPct}%`, width: `${Math.max(widthPct, 2)}%` }}
                                            onMouseDown={(e) => startDrag(e, "move")}
                                        >
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-ew-resize z-10 hover:bg-indigo-400 rounded-l-xl"
                                                onMouseDown={(e) => { e.stopPropagation(); startDrag(e, "start"); }}
                                            >
                                                <div className="w-0.5 h-4 bg-white opacity-70 rounded" />
                                            </div>

                                            {widthPct > 8 && (
                                                <span className="flex-1 text-xs font-medium text-white text-center whitespace-nowrap px-4 truncate pointer-events-none">
                          {minutesToLabel(startMinutes)} – {minutesToLabel(endMinutes)}
                        </span>
                                            )}

                                            <div
                                                className="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-ew-resize z-10 hover:bg-indigo-400 rounded-r-xl"
                                                onMouseDown={(e) => { e.stopPropagation(); startDrag(e, "end"); }}
                                            >
                                                <div className="w-0.5 h-4 bg-white opacity-70 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-2 px-0.5">
                                        {["12AM", "6AM", "12PM", "6PM", "12AM"].map((label, i) => (
                                            <span key={i} className="text-xs text-gray-400">{label}</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 text-center">
                                        Drag the bar to move · drag edges to resize
                                    </p>
                                </div>

                                {/* Selected dates reminder */}
                                {selectedDates.length > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            For dates
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {selectedDates.map(formatDate).join(" · ")}
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 flex items-center justify-between border-t border-gray-100 shrink-0">
                            <button
                                onClick={() => router.push("/create-event")}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Select Dates
                            </button>
                            <button
                                onClick={handleInviteFriends}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
                            >
                                Submit
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}