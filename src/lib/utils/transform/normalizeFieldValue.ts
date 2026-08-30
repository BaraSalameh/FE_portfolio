export const normalizeFieldValue = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (value !== undefined && value !== null && value !== '') return [String(value)];
    return [];
};
