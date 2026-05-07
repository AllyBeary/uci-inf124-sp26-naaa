import { Person, AvailabilitySlot, CalendarEvent } from "./types";

export const people: Person[] = [
  { id: "person1", name: "Allison", color: "bg-pink-300", initials: "P1" },
  { id: "person2", name: "Nicole", color: "bg-pink-200", initials: "P2" },
  { id: "person3", name: "Audrey", color: "bg-blue-300", initials: "P3" },
];

export const availabilitySlots: AvailabilitySlot[] = [
  { personId: "person1", dayIndex: 1, startHour: 9, endHour: 11 },
  { personId: "person1", dayIndex: 2, startHour: 8, endHour: 10 },

  { personId: "person2", dayIndex: 1, startHour: 9, endHour: 11 },
  { personId: "person2", dayIndex: 3, startHour: 10, endHour: 12 },

  { personId: "person3", dayIndex: 1, startHour: 9, endHour: 10 },
  { personId: "person3", dayIndex: 3, startHour: 10, endHour: 11 },
];

export const googleEvents: CalendarEvent[] = [
  {
    id: "g1",
    personId: "person1",
    title: "Hangout @ Newport Beach",
    dayIndex: 1,
    startHour: 9,
    endHour: 11,
    description: "Dress up for sunset photos",
    availablePeople: ["person1", "person2", "person3"],
  },
  {
    id: "g2",
    personId: "person2",
    title: "Dinner",
    dayIndex: 3,
    startHour: 10,
    endHour: 12,
    description: "",
    availablePeople: ["person2", "person3"],
  },
];