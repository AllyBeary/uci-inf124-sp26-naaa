"use client";

import { useMemo } from "react";
import { people, availabilitySlots } from "@/lib/userData";
import { AvailabilitySlot, LocalCalendarEvent } from "@/lib/types";

type CalendarProps = {
    selectedPeople: string[];
    mySlots?: AvailabilitySlot[];
    events?: LocalCalendarEvent[];
    onEventClick?: (event: LocalCalendarEvent) => void;
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

export default function Calendar({
    selectedPeople,
    mySlots = [],
    events = [],
    onEventClick,
    showAvailability = true,
}: CalendarProps) {
    const personMap = useMemo(
        () => Object.fromEntries(people.map((p) => [p.id, p])),
        []
    );

    const hardcodedSlots: AvailabilitySlot[] = availabilitySlots.filter((slot) =>
        selectedPeople.includes(slot.personId)
    );

    const allSlots = [...hardcodedSlots, ...mySlots];

    const availabilityByDayHour = useMemo(() => {
        const map: Record<number, Record<number, AvailabilitySlot[]>> = {};
        for (const slot of allSlots) {
            for (let h = slot.startHour; h < slot.endHour; h++) {
                if (!map[slot.dayIndex]) map[slot.dayIndex] = {};
                if (!map[slot.dayIndex][h]) map[slot.dayIndex][h] = [];
                map[slot.dayIndex][h].push(slot);
            }
        }
        return map;
    }, [allSlots]);

    // People whose availability is consumed by an event covering a given cell.
    const bookedPeopleAt = (dayIndex: number, hour: number) => {
        const ids = new Set<string>();
        for (const e of events) {
            if (e.dayIndex === dayIndex && hour >= e.startHour && hour < e.endHour) {
                e.invitees.forEach((id) => ids.add(id));
            }
        }
        return ids;
    };

    const eventCovers = (dayIndex: number, hour: number) =>
        events.some((e) => e.dayIndex === dayIndex && hour >= e.startHour && hour < e.endHour);

    const getSlotsInCell = (dayIndex: number, hour: number) => {
        const booked = bookedPeopleAt(dayIndex, hour);
        return allSlots.filter(
            (slot) =>
                slot.dayIndex === dayIndex &&
                hour >= slot.startHour &&
                hour < slot.endHour &&
                !booked.has(slot.personId)
        );
    };

    const visibleAvailPeople = (dayIndex: number, hour: number) =>
        eventCovers(dayIndex, hour)
            ? new Set<string>()
            : new Set(getSlotsInCell(dayIndex, hour).map((s) => s.personId));

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

                            const cellEvents = events.filter(
                                (e) => e.dayIndex === dayIndex && hour >= e.startHour && hour < e.endHour
                            );

                            // Label a person on the first VISIBLE green cell of each run.
                            const visibleNow = cellEvents.length
                                ? new Set<string>()
                                : new Set(slots.map((s) => s.personId));
                            const visiblePrev = visibleAvailPeople(dayIndex, hour - 1);

                            const seen = new Set<string>();
                            const namesToShow = slots.filter((s) => {
                                if (
                                    !visibleNow.has(s.personId) ||
                                    visiblePrev.has(s.personId) ||
                                    seen.has(s.personId)
                                )
                                    return false;
                                seen.add(s.personId);
                                return true;
                            });

                            const prevSlots = availabilityByDayHour?.[dayIndex]?.[hour - 1] ?? [];
                            const nextSlots = availabilityByDayHour?.[dayIndex]?.[hour + 1] ?? [];

                            const prevHasSamePeople = hasContent && prevSlots.length === slots.length;
                            const nextHasSamePeople = hasContent && nextSlots.length === slots.length;

                            const roundingClass = showAvailability && hasContent
                                ? `${!prevHasSamePeople ? "rounded-t-md" : ""} ${!nextHasSamePeople ? "rounded-b-md" : ""}`
                                : "";

                            return (
                                <div
                                    key={`${dayIndex}-${hour}`}
                                    className={`flex-1 border-r border-gray-300 relative h-16 transition-colors ${roundingClass} ${
                                        showAvailability && hasContent
                                            ? overlapColor(slots.length)
                                            : "bg-white"
                                    }`}
                                >
                                    {showAvailability && namesToShow.map((slot) => (
                                        <div
                                            key={slot.personId}
                                            className="text-[10px] text-gray-800 px-1 pt-1 truncate font-semibold leading-tight"
                                        >
                                            {getName(slot)}
                                        </div>
                                    ))}

                                    {cellEvents.map((e) => {
                                        const isStart = e.startHour === hour;
                                        const isEnd = hour === e.endHour - 1;
                                        return (
                                            <div
                                                key={e.id}
                                                onClick={() => onEventClick?.(e)}
                                                className={`absolute inset-x-0.5 bg-indigo-500/85 z-10 overflow-hidden ${
                                                    onEventClick ? "cursor-pointer hover:bg-indigo-600/90" : ""
                                                } ${isStart ? "top-0.5 rounded-t-md" : "top-0"} ${
                                                    isEnd ? "bottom-0.5 rounded-b-md" : "bottom-0"
                                                }`}
                                            >
                                                {isStart && (
                                                    <span className="block text-[10px] text-white px-1 pt-0.5 font-semibold truncate">
                                                        {e.title}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}