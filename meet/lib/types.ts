export interface Person {
  id: string;
  name: string;
  color: string;
  initials: string;
}

export interface AvailabilitySlot {
  personId: string;
  dayIndex: number; // 0 = Monday, 6 = Sunday
  startHour: number;
  endHour: number;
  title?: string;
}

export interface CalendarEvent {
  id: string;
  personId: string;
  title: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  description?: string;
}
