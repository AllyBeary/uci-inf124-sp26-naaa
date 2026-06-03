"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import AddAvailabilityModal from "@/components/AddAvailabilityModal";
import { people as allPeople } from "@/lib/userData";
import { AvailabilitySlot, Person } from "@/lib/types";

export default function CalendarPage() {
  const { id: groupId } = useParams<{ id: string }>();

  const [groupPeople, setGroupPeople] = useState<Person[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mySlots, setMySlots] = useState<AvailabilitySlot[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch group members from the API; fall back to all hardcoded people for static groups
  useEffect(() => {
    if (!groupId) return;
    fetch(`/api/calendar-groups/${groupId}`)
      .then(r => r.json())
      .then(({ group }) => {
        const members: Person[] = group?.members?.length
          ? (group.members as string[]).map((id: string) => {
              const known = allPeople.find(p => p.id === id);
              return known ?? { id, name: id, initials: id.slice(0, 2).toUpperCase() };
            })
          : allPeople;
        setGroupPeople(members);
        setSelectedPeople(members.map(p => p.id));
      })
      .catch(() => {
        setGroupPeople(allPeople);
        setSelectedPeople(allPeople.map(p => p.id));
      });
  }, [groupId]);

  // Fetch all group availability from the API
  useEffect(() => {
    if (!groupId) return;
    fetch(`/api/availability?groupId=${groupId}`)
      .then(r => r.json())
      .then(({ slots }) => {
        if (!Array.isArray(slots)) return;
        setMySlots(slots.map((s: { dayIndex: number; startHour: number; endHour: number }) => ({
          personId: "me",
          dayIndex: s.dayIndex,
          startHour: s.startHour,
          endHour: s.endHour,
        })));
      })
      .catch(console.error);
  }, [groupId]);

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
        />
        <Calendar
          selectedPeople={selectedPeople}
          mySlots={mySlots}
        />
      </div>

      {showModal && (
        <AddAvailabilityModal
          onConfirm={handleAddAvailability}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
