"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { people } from "../lib/userData";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CreateEventSelectDatesPage() {
    const router = useRouter();
    const [selectedPeople, setSelectedPeople] = useState<string[]>(
        people.map((p) => p.id)
    );
    const [sidebarDate, setSidebarDate] = useState(new Date(2026, 3, 1));
    const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 3, 1));
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const toDateStr = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const toggleDate = (day: number) => {
        const str = toDateStr(day);
        setSelectedDates((prev) =>
            prev.includes(str) ? prev.filter((d) => d !== str) : [...prev, str]
        );
    };

    const isSelected = (day: number) => selectedDates.includes(toDateStr(day));

    const formatDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const handleSelectTimes = () => {
        if (selectedDates.length === 0) return;
        localStorage.setItem(
            "createEvent_selectedDates",
            JSON.stringify([...selectedDates].sort())
        );
        router.push("/create-event/set-time");
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
                            <h2 className="text-lg font-semibold text-gray-900">Select Possible Dates</h2>
                        </div>

                        {/* Calendar — no scroll, fills available space */}
                        <div className="flex-1 flex flex-col overflow-hidden px-8 py-4 min-h-0">
                            <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 min-h-0">

                                {/* Month navigation */}
                                <div className="flex items-center justify-between mb-3 shrink-0">
                  <span className="text-base font-semibold text-gray-800">
                    {MONTH_NAMES[month]} {year}
                  </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer text-lg leading-none"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer text-lg leading-none"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 shrink-0">
                                    {DAY_NAMES.map((d) => (
                                        <div key={d} className="text-sm text-center font-medium text-gray-400 py-1">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid — rows share height equally, no scrolling */}
                                <div
                                    className="flex-1 grid grid-cols-7 min-h-0"
                                    style={{ gridAutoRows: "1fr" }}
                                >
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                        <div key={day} className="flex items-center justify-center p-1">
                                            <button
                                                onClick={() => toggleDate(day)}
                                                className={`w-full h-full max-w-[3rem] max-h-[3rem] text-sm font-medium transition-colors cursor-pointer rounded-full flex items-center justify-center ${
                                                    isSelected(day)
                                                        ? "bg-gray-800 text-white"
                                                        : "hover:bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* Selected Dates strip */}
                        <div className="px-8 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Selected Dates
                            </p>
                            <p className="text-sm text-gray-600 min-h-[18px] leading-relaxed">
                                {selectedDates.length > 0 ? (
                                    [...selectedDates].sort().map(formatDate).join(" · ")
                                ) : (
                                    <span className="text-gray-300">No dates selected</span>
                                )}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 flex items-center justify-between border-t border-gray-100 shrink-0">
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSelectTimes}
                                disabled={selectedDates.length === 0}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                            >
                                Select Times
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