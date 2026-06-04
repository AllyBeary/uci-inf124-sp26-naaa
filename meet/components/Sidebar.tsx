"use client";

import MiniCalendar from "./MiniCalendar";
import AvailabilityFilter from "./AvailabilityFilter";
import SuggestedTimes from "./SuggestedTimes";
import { people as allPeople } from "@/lib/userData";
import { Person } from "@/lib/types";
import { SuggestedTime } from "@/lib/suggestTimes";

type SidebarProps = {
    selectedPeople: string[];
    onSelectedPeopleChange: (selected: string[]) => void;
    currentDate: Date;
    onCurrentDateChange: (date: Date) => void;
    showAvailability?: boolean;
    onAddAvailability?: () => void;
    people?: Person[];
    suggestions?: SuggestedTime[];
    onAddSuggestion?: (s: SuggestedTime) => void;
};

export default function Sidebar({
                                    selectedPeople,
                                    onSelectedPeopleChange,
                                    currentDate,
                                    onCurrentDateChange,
                                    showAvailability = true,
                                    onAddAvailability,
                                    people = allPeople,
                                    suggestions,
                                    onAddSuggestion,
                                }: SidebarProps) {
    return (
        <div className="w-44 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
            {/* Create Button */}
            {onAddAvailability && (
                <div className="p-4 border-b border-gray-200">
                    <div className="border border-gray-300 rounded-2xl p-1 bg-white bg-opacity-50">
                        <button
                            onClick={onAddAvailability}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded w-full cursor-pointer"
                        >
                            <span className="text-lg">+</span>
                            <span>Add Availability</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mini Calendar */}
            <div className="border-b border-gray-200">
                <MiniCalendar currentDate={currentDate} onDateChange={onCurrentDateChange} />
            </div>

            {/* Availability Filter */}
            {showAvailability && (
                <AvailabilityFilter
                    people={people}
                    selectedPeople={selectedPeople}
                    onSelectedPeopleChange={onSelectedPeopleChange}
                />
            )}

            {/* Suggested Times */}
            {showAvailability && suggestions && onAddSuggestion && (
                <SuggestedTimes suggestions={suggestions} onAdd={onAddSuggestion} />
            )}
        </div>
    );
}