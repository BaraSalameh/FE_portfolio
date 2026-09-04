import { createServer } from 'node:http';

const port = Number(process.env.PLAYWRIGHT_API_PORT ?? 5055);
const genderPreference = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'show-gender',
};
const parseJsonBody = (body) => {
    try { return body ? JSON.parse(body) : {}; }
    catch { return {}; }
};
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

const dashboardFixture = () => ({
    user: {
        username: 'demo',
        email: 'demo@example.com',
        firstname: 'Demo',
        lastname: 'Portfolio',
        title: 'Frontend developer',
        bio: 'A test portfolio used to verify the complete public experience.',
        phone: null,
        profilePicture: null,
        coverPhoto: null,
        gender: null,
        birthDate: null,
    },
    lstUserPreferences: userPreferences,
    lstUserChartPreferences: [],
    lstCertificates: [],
    lstEducations: [],
    lstExperiences: [],
    lstUserLanguages: [],
    lstProjects: [],
    lstUserSkills: [],
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
            response.end(JSON.stringify(dashboardFixture()));
            return;
        }

        if (request.url === '/api/Owner/UserFullInfo') {
            response.end(JSON.stringify(dashboardFixture()));
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

        if (request.url === '/api/Owner/LKP_PreferenceList') {
            response.end(JSON.stringify({ items: [genderPreference], rowCount: 1 }));
            return;
        }

        if (request.url === '/api/Owner/UserPreferenceList') {
            response.end(JSON.stringify({ items: userPreferences, rowCount: userPreferences.length }));
            return;
        }

        if (request.url === '/api/Owner/EditUserPreference' && request.method === 'POST') {
            const payload = JSON.parse(body);
            userPreferences = [{
                LKP_PreferenceID: payload.LKP_PreferenceID,
                value: payload.value,
                preference: genderPreference,
            }];
            response.end(JSON.stringify({}));
            return;
        }

        if (request.url === '/api/Account/Login' && request.method === 'POST') {
            response.statusCode = 404;
            response.end(JSON.stringify(['Wrong username/password']));
            return;
        }

        if (request.url === '/api/Account/ValidateToken' && request.method === 'POST') {
            response.setHeader('set-cookie', [
                'AccessToken=new-access; Path=/; HttpOnly; SameSite=None; Secure',
                'RefreshToken=new-refresh; Path=/api/Account; HttpOnly; SameSite=None; Secure',
            ]);
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
