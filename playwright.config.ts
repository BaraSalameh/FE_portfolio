import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./playwright",
    retries: 1,
    use: {
        headless: true,
        baseURL: "http://localhost:3000",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    webServer: [
        {
            command: 'node playwright/mock-api.mjs',
            port: 5055,
            reuseExistingServer: false,
        },
        {
            command: 'npm run dev',
            url: 'http://localhost:3000/',
            reuseExistingServer: false,
            env: {
                ...process.env,
                API_URL: 'http://127.0.0.1:5055',
            },
        },
    ],
});
