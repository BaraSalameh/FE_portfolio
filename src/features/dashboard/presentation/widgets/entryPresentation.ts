export const proficiencyToPercent = (level: string) => {
    const normalized = level.trim().toLowerCase();
    const cefr = normalized.match(/\b([abc][12])\b/)?.[1];
    if (cefr) return { a1: 20, a2: 40, b1: 60, b2: 75, c1: 90, c2: 100 }[cefr] ?? 50;
    if (normalized.includes('native') || normalized.includes('bilingual')) return 100;
    if (normalized.includes('fluent') || normalized.includes('full professional')) return 90;
    if (normalized.includes('advanced') || normalized.includes('professional working')) return 80;
    if (normalized.includes('upper intermediate')) return 70;
    if (normalized.includes('intermediate') || normalized.includes('limited working')) return 60;
    if (normalized.includes('elementary') || normalized.includes('beginner')) return 40;
    if (normalized.includes('basic')) return 20;
    return 50;
};
