export interface Person {
  id: string;
  name: string;
  initials: string;
}

export interface AvailabilitySlot {
  personId: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
}

export interface CalendarEvent {
  id: string;
  personId: string;
  title: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  description?: string;
  availablePeople?: string[]; // personIds
}