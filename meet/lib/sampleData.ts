import { Person, AvailabilitySlot } from "./types";

export const people: Person[] = [
  {
    id: "person1",
    name: "Person 1",
    color: "bg-pink-300",
    initials: "P1",
  },
  {
    id: "person2",
    name: "Person 2",
    color: "bg-pink-200",
    initials: "P2",
  },
  {
    id: "person3",
    name: "Person 3",
    color: "bg-blue-300",
    initials: "P3",
  },
];

// Sample availability data for April 2026
export const availabilitySlots: AvailabilitySlot[] = [
  // Person 1 (Pink 300)
  { personId: "person1", dayIndex: 1, startHour: 9, endHour: 11, title: "Weekly Sync" }, // Tuesday 9am-11am
  { personId: "person1", dayIndex: 3, startHour: 10, endHour: 12, title: "Design Review" }, // Thursday 10am-12pm

  // Person 2 (Pink 200)
  { personId: "person2", dayIndex: 2, startHour: 11, endHour: 13, title: "Planning Session" }, // Wednesday 11am-1pm
  { personId: "person2", dayIndex: 4, startHour: 14, endHour: 16, title: "Customer Call" }, // Friday 2pm-4pm

  // Person 3 (Blue 300)
  { personId: "person3", dayIndex: 0, startHour: 8, endHour: 10, title: "Team Standup" }, // Monday 8am-10am
  { personId: "person3", dayIndex: 3, startHour: 13, endHour: 15, title: "Code Review" }, // Thursday 1pm-3pm
];
