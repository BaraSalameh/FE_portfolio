const RETURN_PATH_BASE = 'https://return-path.invalid';

export const safeAppPath = (
    requested: string | null | undefined,
    options: { allowLogin?: boolean } = {},
) => {
    if (!requested || !requested.startsWith('/') || requested.startsWith('//')) return null;

    try {
        const target = new URL(requested, RETURN_PATH_BASE);
        if (target.origin !== RETURN_PATH_BASE) return null;
        const pathname = decodeURIComponent(target.pathname).replace(/\/+$/, '').toLowerCase();
        if (pathname.includes('\\') || pathname.startsWith('//')) return null;
        if (pathname === '/api' || pathname.startsWith('/api/') || pathname === '/auth/logout') return null;
        if (!options.allowLogin && pathname === '/auth/login') return null;
        return `${target.pathname}${target.search}${target.hash}`;
    } catch {
        return null;
    }
};

export const loginPath = (returnTo?: string | null) => returnTo
    ? `/auth/login?returnTo=${encodeURIComponent(returnTo)}`
    : '/auth/login';

export const pathWithSearchParams = (
    pathname: string,
    values: Record<string, string | string[] | undefined>,
) => {
    const search = new URLSearchParams();
    for (const [name, value] of Object.entries(values)) {
        if (Array.isArray(value)) value.forEach(item => search.append(name, item));
        else if (value !== undefined) search.set(name, value);
    }
    const query = search.toString();
    return query ? `${pathname}?${query}` : pathname;
};
