import { test, expect, Page } from "@playwright/test";

const getHtml = (page: Page) => page.locator("html");

const isDarkTheme = async (page: Page) => {
    const html = getHtml(page);
    return await html.evaluate(el => el.classList.contains('dark'));
}

test("Page load", async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle'});
});

test("Theme toggle", async ({ page }) => {
    await page.goto("/");

    const themeToggleBtn = page.getByTestId('theme-toggle-button');
    await expect(themeToggleBtn).toBeVisible();

    const html = getHtml(page);
    const wasDark = await isDarkTheme(page);

    await themeToggleBtn.click();
    if (wasDark) {
        await expect(html).toHaveClass(/light/);
    } else {
        await expect(html).toHaveClass(/dark/);
    }

    const wasLight = !await isDarkTheme(page);
    await themeToggleBtn.click();

    if (wasLight) {
        await expect(html).toHaveClass(/dark/);
    } else {
        await expect(html).toHaveClass(/light/);
    }
});