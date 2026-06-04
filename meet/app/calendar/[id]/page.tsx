"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import AddAvailabilityModal from "@/components/AddAvailabilityModal";
import CreateEventModal from "@/components/CreateEventModal";
import EventDetailsModal from "@/components/EventDetailsModal";
import { people as allPeople, availabilitySlots } from "@/lib/userData";
import { AvailabilitySlot, Person, LocalCalendarEvent } from "@/lib/types";
import { suggestTimes, SuggestedTime } from "@/lib/suggestTimes";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am..5pm

export default function CalendarPage() {
    const { id: groupId } = useParams<{ id: string }>();

    const [groupPeople, setGroupPeople] = useState<Person[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mySlots, setMySlots] = useState<AvailabilitySlot[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState<LocalCalendarEvent[]>([]);
    const [eventDraft, setEventDraft] = useState<SuggestedTime | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<LocalCalendarEvent | null>(null);

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

    useEffect(() => {
        if (!groupId) return;
        try {
            const stored = localStorage.getItem(`events:${groupId}`);
            setEvents(stored ? JSON.parse(stored) : []);
        } catch (err) {
            console.error("Failed to load events:", err);
            setEvents([]);
        }
    }, [groupId]);

    const saveEvents = (next: LocalCalendarEvent[]) => {
        setEvents(next);
        if (groupId) {
            try {
                localStorage.setItem(`events:${groupId}`, JSON.stringify(next));
            } catch (err) {
                console.error("Failed to save events:", err);
            }
        }
    };

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
        setMySlots((prev) => [...prev, ...newSlots]);

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

    const handleSaveEvent = ({
                                 title,
                                 startHour,
                                 endHour,
                             }: {
        title: string;
        startHour: number;
        endHour: number;
    }) => {
        const dayIndex = (currentDate.getDay() + 6) % 7; // JS Sun=0 -> our Mon=0
        saveEvents([
            ...events,
            { id: `${Date.now()}`, title, dayIndex, startHour, endHour, invitees: [] },
        ]);
    };

    const handleUpdateEvent = (updated: { startHour: number; endHour: number }) => {
        if (!selectedEvent) return;
        saveEvents(events.map((e) => (e.id === selectedEvent.id ? { ...e, ...updated } : e)));
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent) return;
        saveEvents(events.filter((e) => e.id !== selectedEvent.id));
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    people={groupPeople}
                    selectedPeople={selectedPeople}
                    onSelectedPeopleChange={setSelectedPeople}
                    currentDate={currentDate}
                    onCurrentDateChange={setCurrentDate}
                    onAddAvailability={() => setShowModal(true)}
                    suggestions={suggestions}
                    onAddSuggestion={(s) => setEventDraft(s)}
                />
                <Calendar
                    selectedPeople={selectedPeople}
                    mySlots={mySlots}
                    events={events}
                    onEventClick={setSelectedEvent}
                />
            </div>

            {showModal && (
                <AddAvailabilityModal onConfirm={handleAddAvailability} onClose={() => setShowModal(false)} />
            )}

            {eventDraft && (
                <CreateEventModal
                    date={currentDate}
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