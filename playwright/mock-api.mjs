import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PLAYWRIGHT_API_PORT ?? 5055);
const genderPreference = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'show-gender',
};
const preference = (id, name) => ({ id, name });
const profilePreferenceDefinitions = Array.from({ length: 10 }, (_, index) => preference(
    `66666666-6666-4666-8666-${String(index + 1).padStart(12, '0')}`,
    `profile-preference-${index + 1}`,
));
const chartPreferenceDefinitions = [
    preference('77777777-7777-4777-8777-777777777701', 'show-education-bar-chart'),
    preference('77777777-7777-4777-8777-777777777702', 'show-project-bar-chart'),
    preference('77777777-7777-4777-8777-777777777703', 'show-skill-bar-chart'),
    preference('77777777-7777-4777-8777-777777777704', 'show-language-bar-chart'),
    preference('77777777-7777-4777-8777-777777777705', 'show-certificate-widget'),
    preference('77777777-7777-4777-8777-777777777706', 'show-certificate-bar-chart'),
    preference('77777777-7777-4777-8777-777777777707', 'show-certificate-pie-chart'),
];
const preferenceDefinitions = [genderPreference, ...profilePreferenceDefinitions, ...chartPreferenceDefinitions];
const publicPreferences = [
    { preference: preference('44444444-4444-4444-8444-444444444441', 'show-email-address'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444442', 'show-phone-number'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444443', 'show-whatsapp'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444444', 'show-site-links'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444445', 'show-cv'), value: 'show' },
];
const hiddenVisualizationPreferences = [
    'show-education-bar-chart',
    'show-education-pie-chart',
    'show-experience-bar-chart',
    'show-experience-pie-chart',
    'show-project-bar-chart',
    'show-project-pie-chart',
    'show-skill-bar-chart',
    'show-skill-pie-chart',
    'show-certificate-bar-chart',
    'show-certificate-pie-chart',
    'show-language-bar-chart',
    'show-language-radar-chart',
].map((name, index) => ({
    preference: preference(`88888888-8888-4888-8888-${String(index + 1).padStart(12, '0')}`, name),
    value: 'hide',
}));
const parseJsonBody = (body) => {
    try { return body ? JSON.parse(body) : {}; }
    catch { return {}; }
};
const accessToken = (expiresInSeconds = 3600) => {
    const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
        role: 'Owner',
        unique_name: 'demo',
        IsConfirmed: 'True',
        jti: randomUUID(),
    })).toString('base64url');
    return `${header}.${payload}.`;
};
const sessions = new Map();
const issuedCookies = (access, refresh) => [
    `AccessToken=${access}; Path=/; HttpOnly; SameSite=None; Secure`,
    'RefreshToken=; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=None; Secure',
    'RefreshToken=; Path=/api/Account; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=None; Secure',
    `RefreshToken=${refresh}; Path=/; HttpOnly; SameSite=None; Secure`,
];
const clearedCookies = () => [
    'AccessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure',
    'RefreshToken=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure',
];
let userPreferences = [];
let contactMessages = [
    {
        id: '22222222-2222-4222-8222-222222222222',
        isRead: false,
        emailTo: 'demo@example.com',
        name: 'Alice Example',
        email: 'alice@example.com',
        subject: 'Project inquiry',
        message: 'I would like to discuss a frontend project with you.',
    },
    {
        id: '33333333-3333-4333-8333-333333333333',
        isRead: true,
        emailTo: 'demo@example.com',
        name: 'Bob Example',
        email: 'bob@example.com',
        subject: 'Hello',
        message: 'Your portfolio looks great. Thanks for sharing it.',
    },
];

const populatedWidgets = {
    lstEducations: [{
        id: '60000000-0000-4000-8000-000000000001',
        institution: { id: '61000000-0000-4000-8000-000000000001', name: 'Design University', logo: '' },
        degree: { id: '62000000-0000-4000-8000-000000000001', name: 'Bachelor of Science', abbreviation: 'BSc' },
        fieldOfStudy: { id: '63000000-0000-4000-8000-000000000001', name: 'Computer Science' },
        startDate: '2018-09-01',
        endDate: '2022-06-01',
        description: 'Focused on accessible web applications.',
        lstProjects: [],
        lstSkills: [],
    }],
    lstExperiences: [{
        id: '60000000-0000-4000-8000-000000000002',
        jobTitle: 'Frontend Developer',
        companyName: 'Example Studio',
        startDate: '2022-07-01',
        endDate: null,
        location: 'Remote',
        description: 'Built responsive product experiences.',
        lstSkills: [],
    }],
    lstProjects: [{
        id: '60000000-0000-4000-8000-000000000003',
        title: 'Portfolio Platform',
        liveLink: 'https://example.com/portfolio',
        sourceCode: 'https://github.com/demo/portfolio',
        imageUrl: null,
        description: 'A fast, accessible portfolio builder.',
        isFeatured: true,
        education: null,
        experience: null,
        lstSkills: [],
    }],
    lstCertificates: [{
        id: '60000000-0000-4000-8000-000000000004',
        certificate: { id: '64000000-0000-4000-8000-000000000001', name: 'Web Accessibility' },
        issueDate: '2024-01-01',
        expirationDate: null,
        credintialID: 'A11Y-2024',
        credintialUrl: 'https://example.com/credential',
        lstSkills: [],
        lstCertificateMedias: [],
    }],
    lstUserLanguages: [{
        language: { id: '65000000-0000-4000-8000-000000000001', name: 'English' },
        languageProficiency: { id: '66000000-0000-4000-8000-000000000001', level: 'Advanced' },
    }],
    lstUserSkills: [{
        skill: { id: '67000000-0000-4000-8000-000000000001', name: 'TypeScript', iconUrl: '' },
        lstEducations: [],
        lstExperiences: [],
        lstProjects: [],
        lstCertificates: [],
    }],
};
const reorderableWidgets = {
    ...populatedWidgets,
    lstEducations: [
        ...populatedWidgets.lstEducations,
        {
            ...populatedWidgets.lstEducations[0],
            id: '60000000-0000-4000-8000-000000000005',
            degree: { ...populatedWidgets.lstEducations[0].degree, name: 'Master of Science', abbreviation: 'MSc' },
            startDate: '2022-09-01',
            endDate: '2024-06-01',
        },
    ],
};

const dashboardFixture = (preferences = userPreferences, widgets = {}) => ({
    user: {
        username: 'demo',
        email: 'demo@example.com',
        firstname: 'Demo',
        lastname: 'Portfolio',
        title: 'Frontend developer',
        bio: 'A test portfolio used to verify the complete public experience.',
        address: 'Istanbul - Turkey',
        whatsAppNumber: '+905551234567',
        cvUrl: 'https://res.cloudinary.com/demo/image/upload/fl_attachment:CV/v1/folio/cvs/demo/cv.pdf',
        phone: '+905526436811',
        profilePicture: null,
        coverPhoto: null,
        gender: null,
        birthDate: null,
    },
    lstUserPreferences: preferences,
    lstUserChartPreferences: [],
    lstCertificates: widgets.lstCertificates ?? [],
    lstEducations: widgets.lstEducations ?? [],
    lstExperiences: widgets.lstExperiences ?? [],
    lstUserLanguages: widgets.lstUserLanguages ?? [],
    lstProjects: widgets.lstProjects ?? [],
    lstUserSkills: widgets.lstUserSkills ?? [],
    lstSocialLinks: [{ id: '55555555-5555-4555-8555-555555555555', platform: 'GitHub', url: 'https://github.com/demo', order: 1 }],
    unreadContactMessageCount: contactMessages.filter(message => !message.isRead).length,
});

const server = createServer((request, response) => {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        response.setHeader('content-type', 'application/json');
        response.setHeader('x-correlation-id', request.headers['x-correlation-id'] ?? 'mock-correlation');

        if (request.url?.startsWith('/api/Client/UserList')) {
            response.end(JSON.stringify({
                items: [],
                rowCount: 0,
                query: new URL(request.url, 'http://mock').search,
            }));
            return;
        }

        if (request.url === '/api/Client/UserByUsername?Username=demo') {
            response.end(JSON.stringify(dashboardFixture(publicPreferences, populatedWidgets)));
            return;
        }

        if (request.url === '/api/Owner/UserFullInfo') {
            if (!request.headers.cookie?.includes('AccessToken=') || request.headers.cookie?.includes('RejectAccess=true')) {
                response.statusCode = 401;
                response.end(JSON.stringify({ title: 'Unauthorized', status: 401 }));
                return;
            }
            const widgetFixture = request.headers.cookie?.match(/(?:^|;\s*)WidgetFixture=([^;]+)/)?.[1];
            const hideVisualizations = request.headers.cookie?.includes('HideVisualizations=true');
            response.end(JSON.stringify(dashboardFixture(
                hideVisualizations ? hiddenVisualizationPreferences : userPreferences,
                widgetFixture === 'reorderable'
                    ? reorderableWidgets
                    : widgetFixture === 'populated' ? populatedWidgets : {},
            )));
            return;
        }

        if (request.url?.startsWith('/api/Owner/ContactMessageList')) {
            response.end(JSON.stringify({
                items: contactMessages,
                rowCount: contactMessages.length,
                unreadContactMessageCount: contactMessages.filter(message => !message.isRead).length,
            }));
            return;
        }

        if (request.url === '/api/Owner/SignMessage' && request.method === 'POST') {
            const payload = parseJsonBody(body);
            if (payload.id) contactMessages = contactMessages.map(message => message.id === payload.id ? { ...message, isRead: true } : message);
            response.end(JSON.stringify({}));
            return;
        }

        if (request.url === '/api/Owner/DeleteMessage' && request.method === 'POST') {
            const payload = parseJsonBody(body);
            if (payload.id) contactMessages = contactMessages.filter(message => message.id !== payload.id);
            response.end(JSON.stringify({}));
            return;
        }

        if (request.url?.startsWith('/api/Owner/LKP_PreferenceList')) {
            const url = new URL(request.url, `http://${request.headers.host}`);
            const pageNumber = Number(url.searchParams.get('PageNumber') ?? 0);
            const pageSize = Number(url.searchParams.get('PageSize') ?? 10);
            const start = pageNumber * pageSize;
            response.end(JSON.stringify({
                items: preferenceDefinitions.slice(start, start + pageSize),
                rowCount: preferenceDefinitions.length,
            }));
            return;
        }

        if (request.url === '/api/Owner/UserPreferenceList') {
            response.end(JSON.stringify({ items: userPreferences, rowCount: userPreferences.length }));
            return;
        }

        if (request.url === '/api/Owner/EditUserPreference' && request.method === 'POST') {
            if (!request.headers.cookie?.includes('AccessToken=') || request.headers.cookie?.includes('RejectMutation=true')) {
                response.statusCode = 401;
                response.end(JSON.stringify({ title: 'Unauthorized', status: 401 }));
                return;
            }
            const payload = JSON.parse(body);
            const definition = preferenceDefinitions.find(item => item.id === payload.LKP_PreferenceID);
            userPreferences = [
                ...userPreferences.filter(item => item.LKP_PreferenceID !== payload.LKP_PreferenceID),
                {
                    LKP_PreferenceID: payload.LKP_PreferenceID,
                    value: payload.value,
                    preference: definition ?? genderPreference,
                },
            ];
            response.end(JSON.stringify({}));
            return;
        }

        if (request.url === '/api/Account/Login' && request.method === 'POST') {
            const payload = parseJsonBody(body);
            if (payload.email === 'success@example.com') {
                const refresh = `session-${randomUUID()}`;
                sessions.set(refresh, { revoked: false });
                response.setHeader('set-cookie', issuedCookies(accessToken(), refresh));
                response.end(JSON.stringify({ username: 'demo', role: 'Owner' }));
                return;
            }
            response.statusCode = 404;
            response.end(JSON.stringify(['Wrong username/password']));
            return;
        }

        if (request.url === '/api/Account/ValidateToken' && request.method === 'POST') {
            if (!request.headers.origin) {
                response.statusCode = 403;
                response.end(JSON.stringify({ title: 'Cross-site request rejected.', status: 403 }));
                return;
            }
            if (!request.headers.cookie?.includes('RefreshToken=')) {
                response.statusCode = 401;
                response.end(JSON.stringify({ title: 'Refresh token is missing.', status: 401 }));
                return;
            }
            const receivedRefresh = request.headers.cookie
                ?.match(/(?:^|;\s*)RefreshToken=([^;]+)/)?.[1];
            if (receivedRefresh === 'invalid-refresh') {
                response.statusCode = 401;
                response.end(JSON.stringify({ title: 'Refresh token is invalid.', status: 401 }));
                return;
            }
            if (receivedRefresh === 'temporary-error') {
                response.statusCode = 503;
                response.end(JSON.stringify({ title: 'Temporarily unavailable.', status: 503 }));
                return;
            }
            let nextRefresh = 'new-refresh';
            if (receivedRefresh?.startsWith('session-')) {
                const session = sessions.get(receivedRefresh);
                if (!session || session.revoked) {
                    response.statusCode = 401;
                    response.setHeader('set-cookie', clearedCookies());
                    response.end(JSON.stringify({ title: 'Refresh token reuse.', status: 401 }));
                    return;
                }
                session.revoked = true;
                nextRefresh = `session-${randomUUID()}`;
                sessions.set(nextRefresh, { revoked: false });
            }
            response.setHeader('set-cookie', issuedCookies(accessToken(), nextRefresh));
            response.end(JSON.stringify({
                body,
                cookie: request.headers.cookie ?? '',
                origin: request.headers.origin ?? '',
            }));
            return;
        }

        response.statusCode = 404;
        response.end(JSON.stringify({ title: 'Not found', status: 404 }));
    });
});

server.listen(port, '127.0.0.1');

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
