export const generateColorMap = (
    data: { name: string }[],
    colors: string[] = [
        'var(--chart-1)',
        'var(--chart-2)',
        'var(--chart-3)',
        'var(--chart-4)',
        'var(--chart-5)',
        'var(--chart-6)'
    ]
): Record<string, string> => {
    return data.reduce((acc, item) => {
        let hash = 0;
        for (const character of item.name) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
        acc[item.name] = colors[Math.abs(hash) % colors.length];
        return acc;
    }, {} as Record<string, string>);
};
