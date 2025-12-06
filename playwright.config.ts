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
    webServer: {
        command: "npm run dev",
        port: 3000,
        reuseExistingServer: true,
    },
});
