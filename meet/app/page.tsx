"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";

export default function MyCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          people={[]}
          selectedPeople={[]}
          onSelectedPeopleChange={() => {}}
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          showAvailability={false}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">My Calendar</h1>
            <p className="text-sm text-gray-500">All events across your groups</p>
          </div>
          <Calendar
            selectedPeople={[]}
            showAvailability={false}
          />
        </div>
      </div>
    </div>
  );
}
