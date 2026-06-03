import { Person, AvailabilitySlot } from "./types";

export const people: Person[] = [
  { id: "person1", name: "Allison", initials: "AL" },
  { id: "person2", name: "Nicole", initials: "NI" },
  { id: "person3", name: "Anver", initials: "AN" },
  { id: "person4", name: "Ethan", initials: "ET" },
];

export const availabilitySlots: AvailabilitySlot[] = [
  { personId: "person1", dayIndex: 1, startHour: 9, endHour: 12 },
  { personId: "person1", dayIndex: 6, startHour: 10, endHour: 14 },

  { personId: "person2", dayIndex: 1, startHour: 9, endHour: 12 },
  { personId: "person2", dayIndex: 5, startHour: 13, endHour: 16 },

  { personId: "person3", dayIndex: 1, startHour: 14, endHour: 17 },
  { personId: "person3", dayIndex: 5, startHour: 13, endHour: 16 },

  { personId: "person4", dayIndex: 2, startHour: 10, endHour: 13 },
  { personId: "person4", dayIndex: 3, startHour: 8, endHour: 11 },
];
