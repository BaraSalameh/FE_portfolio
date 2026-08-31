import { defineConfig } from "@playwright/test";

const appPort = Number(process.env.PLAYWRIGHT_APP_PORT ?? 3000);
const apiPort = Number(process.env.PLAYWRIGHT_API_PORT ?? 5055);
const appCommand = process.env.PLAYWRIGHT_USE_BUILD === '1'
    ? `npm run start -- -p ${appPort}`
    : `npm run dev -- -p ${appPort}`;

export default defineConfig({
    testDir: "./playwright",
    retries: 1,
    use: {
        headless: true,
        baseURL: `http://localhost:${appPort}`,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    webServer: [
        {
            command: 'node playwright/mock-api.mjs',
            port: apiPort,
            reuseExistingServer: false,
        },
        {
            command: appCommand,
            url: `http://localhost:${appPort}/`,
            reuseExistingServer: false,
            env: {
                ...process.env,
                API_URL: `http://127.0.0.1:${apiPort}`,
            },
        },
    ],
});
