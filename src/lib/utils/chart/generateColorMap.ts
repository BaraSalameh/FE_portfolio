export const generateColorMap = (
    data: { name: string }[],
    colors: string[] = ['#F97316', '#3B82F6', '#10B981', '#EAB308', '#6366F1']
): Record<string, string> => {
    return data.reduce((acc, item, index) => {
        acc[item.name] = colors[index % colors.length];
        return acc;
    }, {} as Record<string, string>);
};