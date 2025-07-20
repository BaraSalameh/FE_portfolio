import dayjs from "dayjs";
import { extractPathValue, normalizeFieldValue } from "@/lib/utils";

export const generateDurationData = <T extends Record<string, any>>(
    list: T[],
    nameKey?: string | string[],
    startDateKey: keyof T = 'startDate',
    endDateKey: keyof T = 'endDate',
    unit: dayjs.ManipulateType = 'month'
): { name: string; value: number }[] => {
    const durations = new Map<string, number>();

    list.forEach(item => {
        const start = item[startDateKey] ? dayjs(item[startDateKey]) : null;
        const end = item[endDateKey] ? dayjs(item[endDateKey]) : dayjs();
        const value = start ? end.diff(start, unit) : null;

        const names = normalizeFieldValue(extractPathValue(item, nameKey ?? '')) || ['Unknown'];

        names.forEach(name => {
            const total = durations.get(name) ?? 0;
            durations.set(name, total + (value !== null ? value : 1));
        });
    });

    return Array.from(durations.entries()).map(([name, value]) => ({ name, value }));
};