"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import AddAvailabilityModal from "@/components/AddAvailabilityModal";
import { people } from "@/lib/userData";
import { AvailabilitySlot } from "@/lib/types";

export default function CalendarPage() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(people.map(p => p.id));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mySlots, setMySlots] = useState<AvailabilitySlot[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddAvailability = (dayIndices: number[], startHour: number, endHour: number) => {
    const newSlots: AvailabilitySlot[] = dayIndices.map((dayIndex) => ({
      personId: "me",
      dayIndex,
      startHour,
      endHour,
    }));
    setMySlots((prev) => [...prev, ...newSlots]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
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
