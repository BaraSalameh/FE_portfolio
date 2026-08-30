import { test, expect, Page } from "@playwright/test";

const getHtml = (page: Page) => page.locator("html");

const isDarkTheme = async (page: Page) => {
    const html = getHtml(page);
    return await html.evaluate(el => el.classList.contains('dark'));
}

test("Page load", async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'networkidle'});
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/portfolio/i);
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

test('unsupported dashboard roles render the not-found boundary', async ({ page }) => {
    await page.goto('/unsupported/someone/dashboard');

    await expect(page.getByRole('heading', { name: 'Portfolio not found' })).toBeVisible();
});

test('portfolio API failures replace the loading skeleton with a retry state', async ({ page }) => {
    await page.goto('/client/missing/dashboard');

    await expect(page.getByText('Not found', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
