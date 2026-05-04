"use client";

import { useState } from "react";

type MiniCalendarProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

export default function MiniCalendar({
  currentDate,
  onDateChange,
}: MiniCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-200 rounded text-gray-600"
          >
            ‹
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-200 rounded text-gray-600"
          >
            ›
          </button>
        </div>
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => day && onDateChange(new Date(year, month, day))}
            className={`aspect-square text-xs rounded flex items-center justify-center
              ${
                day === null
                  ? ""
                  : day === currentDate.getDate() &&
                    month === currentDate.getMonth() &&
                    year === currentDate.getFullYear()
                  ? "bg-gray-400 text-white font-semibold"
                  : "hover:bg-gray-200 text-gray-700"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
