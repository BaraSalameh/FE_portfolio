export const normalizeFieldValue = (value: any): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value) return [value];
    return [];
};