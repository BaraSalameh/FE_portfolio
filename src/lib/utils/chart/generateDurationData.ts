import dayjs from "dayjs";
import { extractPathValue, normalizeFieldValue } from "@/lib/utils";

export const generateDurationData = (
    list: object[],
    nameKey?: string | string[],
    startDateKey = 'startDate',
    endDateKey = 'endDate',
    unit: dayjs.ManipulateType = 'month'
): { name: string; value: number }[] => {
    const durations = new Map<string, number>();

    list.forEach(item => {
        const startDate = extractPathValue(item, startDateKey);
        const endDate = extractPathValue(item, endDateKey);
        const start = startDate ? dayjs(String(startDate)) : null;
        const end = endDate ? dayjs(String(endDate)) : dayjs();
        const value = start ? end.diff(start, unit) : null;

        const names = normalizeFieldValue(extractPathValue(item, nameKey ?? '')) || ['Unknown'];

        names.forEach(name => {
            const total = durations.get(name) ?? 0;
            durations.set(name, total + (value !== null ? value : 1));
        });
    });

    return Array.from(durations.entries()).map(([name, value]) => ({ name, value }));
};
