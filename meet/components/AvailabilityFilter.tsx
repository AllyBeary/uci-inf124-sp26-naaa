"use client";

import { Person } from "@/lib/types";

type AvailabilityFilterProps = {
  people: Person[];
  selectedPeople: string[];
  onSelectedPeopleChange: (selected: string[]) => void;
};

export default function AvailabilityFilter({
  people,
  selectedPeople,
  onSelectedPeopleChange,
}: AvailabilityFilterProps) {
  const togglePerson = (personId: string) => {
    setSelectedPeople(
      selectedPeople.includes(personId)
        ? selectedPeople.filter((id) => id !== personId)
        : [...selectedPeople, personId]
    );
  };

  const setSelectedPeople = onSelectedPeopleChange;

  return (
    <div className="px-4 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {people.map((person) => (
          <button
            key={person.id}
            onClick={() => togglePerson(person.id)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded transition-colors ${
              selectedPeople.includes(person.id)
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedPeople.includes(person.id)}
              onChange={() => {}}
              className="w-4 h-4 rounded"
            />
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${person.color}`}></div>
              <span className="text-sm text-gray-700">{person.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
