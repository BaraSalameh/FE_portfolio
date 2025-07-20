export const extractPathValue = (
    item: any,
    path: string | string[]
): any => {
    const paths = Array.isArray(path) ? path : [path];

    for (const singlePath of paths) {
        const keys = singlePath.split('.');
        let current = item;

        for (let i = 0; i < keys.length; i++) {
            if (Array.isArray(current)) {
                const restPath = keys.slice(i).join('.');
                const arrayResult = current
                    .map(child => extractPathValue(child, restPath))
                    .filter(Boolean);
                if (arrayResult) return arrayResult;
                return undefined; // no need to continue this path
            }

            current = current?.[keys[i]];
        }

        if (current !== undefined && current !== null && current !== '') {
            return current;
        }
    }

    return undefined;
};