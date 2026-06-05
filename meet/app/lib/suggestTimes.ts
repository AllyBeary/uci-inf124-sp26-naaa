import { AvailabilitySlot } from "./types";

export interface SuggestedTime {
    startHour: number;
    endHour: number;
    count: number; // fewest people free at any hour within the range
}

function peopleFreeAt(slots: AvailabilitySlot[], dayIndex: number, hour: number): number {
    const ids = new Set<string>();
    for (const s of slots) {
        if (s.dayIndex === dayIndex && hour >= s.startHour && hour < s.endHour) {
            ids.add(s.personId);
        }
    }
    return ids.size;
}

/**
 * Suggest the best time-of-day ranges across the whole week.
 * peak[h] = most people free at hour h on any single day; consecutive hours are
 * merged into ranges and ranked by availability.
 */
export function suggestTimes(
    slots: AvailabilitySlot[],
    hours: number[],
    days = 7,
    maxResults = 3
): SuggestedTime[] {
    const peak: Record<number, number> = {};
    for (const h of hours) {
        let best = 0;
        for (let d = 0; d < days; d++) best = Math.max(best, peopleFreeAt(slots, d, h));
        peak[h] = best;
    }

    const buildRanges = (threshold: number): SuggestedTime[] => {
        const ranges: SuggestedTime[] = [];
        let run: number[] = [];
        const flush = () => {
            if (run.length) {
                ranges.push({
                    startHour: run[0],
                    endHour: run[run.length - 1] + 1,
                    count: Math.min(...run.map((h) => peak[h])),
                });
                run = [];
            }
        };
        for (const h of hours) {
            if (peak[h] >= threshold) run.push(h);
            else flush();
        }
        flush();
        return ranges;
    };

    let ranges = buildRanges(2);
    if (ranges.length === 0) ranges = buildRanges(1);

    return ranges
        .sort(
            (a, b) =>
                b.count - a.count ||
                (b.endHour - b.startHour) - (a.endHour - a.startHour) ||
                a.startHour - b.startHour
        )
        .slice(0, maxResults);
}