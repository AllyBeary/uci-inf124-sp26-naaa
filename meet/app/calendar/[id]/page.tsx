"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import AddAvailabilityModal from "@/components/AddAvailabilityModal";
import CreateEventModal from "@/components/CreateEventModal";
import EventDetailsModal from "@/components/EventDetailsModal";
import { people as allPeople, availabilitySlots } from "../../lib/userData";
import { AvailabilitySlot, Person, LocalCalendarEvent } from "../../lib/types";
import { suggestTimes } from "../../lib/suggestTimes";
import type { SuggestedTime } from "../../lib/suggestTimes";
import { HiMenu, HiX } from "react-icons/hi";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am..5pm
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface EventDraft {
    dayIndex: number;
    startHour: number;
    endHour: number;
}

export default function CalendarPage() {
    const { id: groupId } = useParams<{ id: string }>();

    const [groupPeople, setGroupPeople] = useState<Person[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mySlots, setMySlots] = useState<AvailabilitySlot[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState<LocalCalendarEvent[]>([]);
    const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<LocalCalendarEvent | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch group members; fall back to all hardcoded people for static groups
    useEffect(() => {
        if (!groupId) return;
        fetch(`/api/calendar-groups/${groupId}`)
            .then((r) => r.json())
            .then(({ group }) => {
                const members: Person[] = group?.members?.length
                    ? (group.members as string[]).map((id: string) => {
                        const known = allPeople.find((p) => p.id === id);
                        return known ?? { id, name: id, initials: id.slice(0, 2).toUpperCase() };
                    })
                    : allPeople;
                setGroupPeople(members);
                setSelectedPeople(members.map((p) => p.id));
            })
            .catch(() => {
                setGroupPeople(allPeople);
                setSelectedPeople(allPeople.map((p) => p.id));
            });
    }, [groupId]);

    // Fetch all group availability from the API
    useEffect(() => {
        if (!groupId) return;
        fetch(`/api/availability?groupId=${groupId}`)
            .then((r) => r.json())
            .then(({ slots }) => {
                if (!Array.isArray(slots)) return;
                setMySlots(
                    slots.map((s: { dayIndex: number; startHour: number; endHour: number }) => ({
                        personId: "me",
                        dayIndex: s.dayIndex,
                        startHour: s.startHour,
                        endHour: s.endHour,
                    }))
                );
            })
            .catch(console.error);
    }, [groupId]);

    // Fetch events for this group from the database
    useEffect(() => {
        if (!groupId) return;
        fetch(`/api/events?groupId=${groupId}`)
            .then((r) => r.json())
            .then(({ events: fetched }) => {
                if (Array.isArray(fetched)) setEvents(fetched);
            })
            .catch((err) => {
                console.error("Failed to load events:", err);
                setEvents([]);
            });
    }, [groupId]);

    const slotsForSuggest = useMemo(
        () => [
            ...availabilitySlots.filter((s) => selectedPeople.includes(s.personId)),
            ...mySlots,
        ],
        [selectedPeople, mySlots]
    );

    const suggestions = useMemo(() => suggestTimes(slotsForSuggest, HOURS), [slotsForSuggest]);

    const handleAddAvailability = async (dayIndices: number[], startHour: number, endHour: number) => {
        const newSlots: AvailabilitySlot[] = dayIndices.map((dayIndex) => ({
            personId: "me",
            dayIndex,
            startHour,
            endHour,
        }));
        setMySlots((prev: AvailabilitySlot[]) => [...prev, ...newSlots]);

        if (groupId) {
            try {
                await fetch("/api/availability", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        groupId,
                        slots: dayIndices.map((dayIndex) => ({ dayIndex, startHour, endHour })),
                    }),
                });
            } catch (error) {
                console.error("Failed to save availability:", error);
            }
        }
    };

    const handleSaveEvent = async ({
        title,
        startHour,
        endHour,
    }: {
        title: string;
        startHour: number;
        endHour: number;
    }) => {
        // dayIndex comes from the draft (cell click or suggestion), not from currentDate
        const dayIndex = eventDraft?.dayIndex ?? (currentDate.getDay() + 6) % 7;
        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId, title, dayIndex, startHour, endHour }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("Event creation failed:", data);
                alert(`Could not save event: ${data?.detail ?? data?.error ?? "Unknown error"}`);
                return;
            }
            if (data.event) setEvents((prev: LocalCalendarEvent[]) => [...prev, data.event]);
        } catch (err) {
            console.error("Failed to save event:", err);
            alert("Network error — could not save event.");
        }
    };

    const handleUpdateEvent = async (updated: { startHour: number; endHour: number }) => {
        if (!selectedEvent) return;
        try {
            await fetch(`/api/events/${selectedEvent.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...updated, dayIndex: selectedEvent.dayIndex }),
            });
            setEvents((prev: LocalCalendarEvent[]) =>
                prev.map((e: LocalCalendarEvent) => (e.id === selectedEvent.id ? { ...e, ...updated } : e))
            );
        } catch (err) {
            console.error("Failed to update event:", err);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        try {
            await fetch(`/api/events/${selectedEvent.id}`, { method: "DELETE" });
            setEvents((prev: LocalCalendarEvent[]) => prev.filter((e: LocalCalendarEvent) => e.id !== selectedEvent.id));
            setSelectedEvent(null);
        } catch (err) {
            console.error("Failed to delete event:", err);
        }
    };

    const sidebar = (
        <Sidebar
            people={groupPeople}
            selectedPeople={selectedPeople}
            onSelectedPeopleChange={setSelectedPeople}
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            onAddAvailability={() => setShowModal(true)}
            suggestions={suggestions}
            onAddSuggestion={(s: SuggestedTime) => setEventDraft({
                dayIndex: (currentDate.getDay() + 6) % 7,
                startHour: s.startHour,
                endHour: s.endHour,
            })}
        />
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar — hidden on mobile, always visible on sm+ */}
                <div className="hidden sm:flex">
                    {sidebar}
                </div>

                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30 bg-black/30 sm:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="fixed left-0 top-16 bottom-0 z-40 sm:hidden">
                            {sidebar}
                        </div>
                    </>
                )}

                <Calendar
                    selectedPeople={selectedPeople}
                    mySlots={mySlots}
                    events={events}
                    onEventClick={setSelectedEvent}
                    onCellClick={(dayIndex, startHour) =>
                        setEventDraft({ dayIndex, startHour, endHour: Math.min(startHour + 1, 17) })
                    }
                    currentDate={currentDate}
                />

                {/* Mobile toggle button */}
                <button
                    className="sm:hidden fixed bottom-4 left-4 z-30 bg-white border border-gray-300 rounded-full p-3 shadow-lg text-gray-700"
                    onClick={() => setSidebarOpen((v: boolean) => !v)}
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                </button>
            </div>

            {showModal && (
                <AddAvailabilityModal onConfirm={handleAddAvailability} onClose={() => setShowModal(false)} />
            )}

            {eventDraft && (
                <CreateEventModal
                    dayName={DAYS[eventDraft.dayIndex]}
                    initialStart={eventDraft.startHour}
                    initialEnd={eventDraft.endHour}
                    onSave={handleSaveEvent}
                    onClose={() => setEventDraft(null)}
                />
            )}

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onSave={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
}
