"use client";

import { SuggestedTime } from "../app/lib/suggestTimes";

const fmt = (h: number) => {
    const period = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}${period}`;
};

type Props = {
    suggestions: SuggestedTime[];
    onAdd: (s: SuggestedTime) => void;
};

export default function SuggestedTimes({ suggestions, onAdd }: Props) {
    if (suggestions.length === 0) return null;

    return (
        <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested Times</h3>
            <ul className="space-y-2">
                {suggestions.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-700">
              {fmt(s.startHour)} - {fmt(s.endHour)}
            </span>
                        <button
                            onClick={() => onAdd(s)}
                            aria-label={`Create event ${fmt(s.startHour)} to ${fmt(s.endHour)}`}
                            className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 cursor-pointer"
                        >
                            +
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}