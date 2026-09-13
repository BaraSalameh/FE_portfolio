import { createServer } from 'node:http';

const port = Number(process.env.PLAYWRIGHT_API_PORT ?? 5055);
const genderPreference = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'show-gender',
};
const preference = (id, name) => ({ id, name });
const publicPreferences = [
    { preference: preference('44444444-4444-4444-8444-444444444441', 'show-email-address'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444442', 'show-phone-number'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444443', 'show-whatsapp'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444444', 'show-site-links'), value: 'show' },
    { preference: preference('44444444-4444-4444-8444-444444444445', 'show-cv'), value: 'show' },
];
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
