import { Person, AvailabilitySlot } from "./types";

export const people: Person[] = [
  { id: "huaat", name: "Allison", initials: "AL" },
  { id: "saengson", name: "Nicole", initials: "NI" },
  { id: "anverc", name: "Anver", initials: "AN" },
  { id: "evotran", name: "Ethan", initials: "ET" },
];

export const availabilitySlots: AvailabilitySlot[] = [
  { personId: "huaat", dayIndex: 1, startHour: 9, endHour: 12 },
  { personId: "huaat", dayIndex: 6, startHour: 10, endHour: 14 },

  { personId: "saengson", dayIndex: 1, startHour: 9, endHour: 12 },
  { personId: "saengson", dayIndex: 5, startHour: 13, endHour: 16 },

  { personId: "anverc", dayIndex: 1, startHour: 14, endHour: 17 },
  { personId: "anverc", dayIndex: 5, startHour: 13, endHour: 16 },

  { personId: "evotran", dayIndex: 2, startHour: 10, endHour: 13 },
  { personId: "evotran", dayIndex: 3, startHour: 8, endHour: 11 },
];
