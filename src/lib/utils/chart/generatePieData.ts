import { extractPathValue, normalizeFieldValue } from "@/lib/utils";

export const generatePieData = <T extends Record<string, any>>(
    list: T[],
    key?: string | string[]
) => {
    const counts = new Map<string, number>();

    list.forEach(item => {
        const names = normalizeFieldValue(extractPathValue(item, key ?? ''));

        names.forEach(name => {
            counts.set(name, (counts.get(name) ?? 0) + 1);
        });
    });

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
};