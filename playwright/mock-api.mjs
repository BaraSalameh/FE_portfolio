import { createServer } from 'node:http';

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

server.listen(5055, '127.0.0.1');

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
