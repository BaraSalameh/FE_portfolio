import { extractPathValue, normalizeFieldValue } from "@/lib/utils";

export const generatePieData = (
    list: object[],
    key?: string | string[]
) => {
    const counts = new Map<string, number>();

    list.forEach(item => {
        const normalizedNames = normalizeFieldValue(extractPathValue(item, key ?? ''));
        const names = normalizedNames.length ? normalizedNames : ['Unknown'];

        names.forEach(name => {
            counts.set(name, (counts.get(name) ?? 0) + 1);
        });
    });

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
};
