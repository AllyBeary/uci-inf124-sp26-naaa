"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import AddAvailabilityModal from "@/components/AddAvailabilityModal";
import { people } from "@/lib/userData";
import { AvailabilitySlot } from "@/lib/types";

export default function CalendarPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const groupPeople = (() => {
    const members = searchParams.get("members");
    if (members) {
      const ids = members.split(",");
      return people.filter((p) => ids.includes(p.id));
    }
    return people;
  })();

  const [selectedPeople, setSelectedPeople] = useState<string[]>(groupPeople.map((p) => p.id));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mySlots, setMySlots] = useState<AvailabilitySlot[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    fetch(`/api/availability?groupId=${groupId}`)
      .then(r => r.json())
      .then(({ slots }) => {
        if (!Array.isArray(slots)) return;
        setMySlots(slots.map((s: { _id: string; dayIndex: number; startHour: number; endHour: number }) => ({
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
