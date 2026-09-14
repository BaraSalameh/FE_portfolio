const route = (path: string) => ({ path: () => path });

export const paths = {
    root: {
        ...route('/'),
        search: route('/search'),
        dashboard: (role: string, username: string) =>
            route(`/${encodeURIComponent(role)}/${encodeURIComponent(username)}/dashboard`),
        profile: (role: string, username: string) =>
            route(`/${encodeURIComponent(role)}/${encodeURIComponent(username)}/profile`),
        messages: (role: string, username: string) =>
            route(`/${encodeURIComponent(role)}/${encodeURIComponent(username)}/messages`),
        settings: (role: string, username: string) =>
            route(`/${encodeURIComponent(role)}/${encodeURIComponent(username)}/settings`),
        auth: {
            login: route('/auth/login'),
            logout: route('/auth/logout'),
            register: route('/auth/register'),
            email: {
                ...route('/auth/email'),
                confirm: route('/auth/email/confirm'),
            },
        },
    },
} as const;
