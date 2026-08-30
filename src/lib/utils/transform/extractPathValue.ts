export const extractPathValue = (
    item: unknown,
    path: string | string[]
): unknown => {
    const paths = Array.isArray(path) ? path : [path];

    for (const singlePath of paths) {
        const keys = singlePath.split('.');
        let current: unknown = item;

        for (let i = 0; i < keys.length; i++) {
            if (Array.isArray(current)) {
                const restPath = keys.slice(i).join('.');
                const arrayResult = current
                    .map(child => extractPathValue(child, restPath))
                    .filter(Boolean);
                if (arrayResult) return arrayResult;
                return undefined; // no need to continue this path
            }

            if (typeof current !== 'object' || current === null) {
                current = undefined;
                break;
            }
            current = (current as Record<string, unknown>)[keys[i]];
        }

        if (current !== undefined && current !== null && current !== '') {
            return current;
        }
    }

    return undefined;
};
