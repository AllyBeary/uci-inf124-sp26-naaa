"use client";

import { useMemo } from "react";
import { people, availabilitySlots } from "../app/lib/userData";
import { AvailabilitySlot, LocalCalendarEvent } from "../app/lib/types";

type CalendarProps = {
    selectedPeople: string[];
    mySlots?: AvailabilitySlot[];
    events?: LocalCalendarEvent[];
    onEventClick?: (event: LocalCalendarEvent) => void;
    onCellClick?: (dayIndex: number, startHour: number) => void;
    showAvailability?: boolean;
    currentDate?: Date;
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const overlapColor = (count: number) => {
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    if (count === 3) return "bg-green-600";
    return "bg-green-800";
};

// Return the Monday of the week containing `date`
function getWeekMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun … 6=Sat
    const offset = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + offset);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default function Calendar({
    selectedPeople,
    mySlots = [],
    events = [],
    onEventClick,
    onCellClick,
    showAvailability = true,
    currentDate,
}: CalendarProps) {
    const personMap = useMemo(
        () => Object.fromEntries(people.map((p) => [p.id, p])),
        []
    );

    // Compute actual dates for each column based on the selected week
    const weekDates = useMemo(() => {
        const monday = getWeekMonday(currentDate ?? new Date());
        return DAYS.map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    }, [currentDate]);

    // Index (0=Mon…6=Sun) of the currently selected date
    const selectedDayIndex = useMemo(() => {
        if (!currentDate) return -1;
        return (currentDate.getDay() + 6) % 7;
    }, [currentDate]);

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

    const getShortName = (slot: AvailabilitySlot) => getName(slot).split(" ")[0];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white w-full">
            {/* Header */}
            <div className="flex sticky top-0 z-20 bg-white shadow-sm">
                <div className="w-10 sm:w-14 md:w-20 shrink-0 border-r border-gray-300 bg-gray-100" />
                {weekDates.map((date, i) => {
                    const isSelected = selectedDayIndex === i;
                    const label = `${date.getMonth() + 1}/${date.getDate()}`;
                    return (
                        <div
                            key={DAYS[i]}
                            className={`flex-1 min-w-0 border-r border-gray-300 px-0.5 sm:px-2 md:px-4 py-1.5 md:py-2 text-center transition-colors ${
                                isSelected ? "bg-blue-50 border-b-2 border-b-blue-400" : "bg-gray-100"
                            }`}
                        >
                            <div className={`text-[10px] sm:text-xs md:text-sm font-semibold ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                                <span className="md:hidden">{DAYS_SHORT[i]}</span>
                                <span className="hidden md:inline">{DAYS[i]}</span>
                            </div>
                            <div className={`text-[9px] sm:text-[10px] md:text-xs mt-0.5 ${isSelected ? "text-blue-500 font-medium" : "text-gray-400"}`}>
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto">
                {HOURS.map((hour) => (
                    <div key={hour} className="flex border-b border-gray-300">
                        {/* Time label */}
                        <div className="w-10 sm:w-14 md:w-20 shrink-0 border-r border-gray-300 px-1 sm:px-2 md:px-3 py-2 md:py-4 text-[9px] sm:text-xs md:text-sm text-gray-800 bg-gray-50 flex items-start justify-end pr-1 sm:pr-2">
                            <span>
                                {hour > 12 ? hour - 12 : hour}
                                <span className="hidden sm:inline">{hour >= 12 ? "pm" : "am"}</span>
                                <span className="sm:hidden">{hour >= 12 ? "p" : "a"}</span>
                            </span>
                        </div>

                        {/* Cells */}
                        {DAYS.map((_, dayIndex) => {
                            const isSelected = selectedDayIndex === dayIndex;
                            const slots = getSlotsInCell(dayIndex, hour);
                            const hasContent = slots.length > 0;

                            const cellEvents = events.filter(
                                (e) => e.dayIndex === dayIndex && hour >= e.startHour && hour < e.endHour
                            );

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

                            const isClickable = !!onCellClick && cellEvents.length === 0;
                            return (
                                <div
                                    key={`${dayIndex}-${hour}`}
                                    role={isClickable ? "button" : undefined}
                                    tabIndex={isClickable ? 0 : undefined}
                                    aria-label={isClickable ? `Add event on ${DAYS[dayIndex]} at ${hour > 12 ? hour - 12 : hour}${hour >= 12 ? "pm" : "am"}` : undefined}
                                    onClick={() => { if (cellEvents.length === 0) onCellClick?.(dayIndex, hour); }}
                                    onKeyDown={(e) => { if (isClickable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onCellClick!(dayIndex, hour); } }}
                                    className={`flex-1 min-w-0 border-r border-gray-300 relative h-10 sm:h-12 md:h-16 transition-colors ${roundingClass} ${isClickable ? "cursor-pointer" : ""} ${
                                        showAvailability && hasContent
                                            ? overlapColor(slots.length)
                                            : isSelected
                                            ? "bg-blue-50/40"
                                            : "bg-white"
                                    }`}
                                >
                                    {showAvailability && namesToShow.map((slot) => (
                                        <div
                                            key={slot.personId}
                                            className="text-[7px] sm:text-[10px] md:text-xs text-gray-800 px-0.5 sm:px-1 pt-0.5 sm:pt-1 truncate font-semibold leading-tight"
                                        >
                                            <span className="sm:hidden">{getShortName(slot)}</span>
                                            <span className="hidden sm:inline">{getName(slot)}</span>
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
                                                    <span className="block text-[7px] sm:text-[10px] md:text-xs text-white px-0.5 sm:px-1 pt-0.5 font-semibold truncate">
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
