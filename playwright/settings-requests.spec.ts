import { expect, test } from '@playwright/test';

test('settings lookup data is requested only once on initial load', async ({ context, page }) => {
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);

    const lookupRequests: string[] = [];
    page.on('request', (request) => {
        const url = new URL(request.url());
        if (
            url.pathname === '/api/Owner/LKP_PreferenceList'
            || url.pathname === '/api/Owner/LKP_WidgetList'
            || url.pathname === '/api/Owner/LKP_ChartTypeList'
        ) {
            lookupRequests.push(`${url.pathname}${url.search}`);
        }
    });

    await page.goto('/owner/demo/settings');
    await page.getByRole('button', { name: /Chart preferences/ }).click();
    await expect(page.getByRole('combobox', { name: 'Default chart' }).first()).toBeVisible();

    expect(lookupRequests.filter((url) => url === '/api/Owner/LKP_WidgetList')).toHaveLength(1);
    expect(lookupRequests.filter((url) => url === '/api/Owner/LKP_ChartTypeList')).toHaveLength(1);
    expect(lookupRequests.filter((url) => url.startsWith('/api/Owner/LKP_PreferenceList'))).toEqual([
        '/api/Owner/LKP_PreferenceList?PageNumber=0&PageSize=100',
    ]);
});

test('saving preferences updates local state without retrieving either preference list', async ({ context, page }) => {
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);

    const listRequests: string[] = [];
    page.on('request', (request) => {
        const pathname = new URL(request.url()).pathname;
        if (
            request.method() === 'GET'
            && (pathname === '/api/Owner/UserPreferenceList' || pathname === '/api/Owner/UserChartPreferenceList')
        ) {
            listRequests.push(pathname);
        }
    });

    await page.goto('/owner/demo/settings');

    const genderToggle = page.getByRole('switch', { name: /(?:Hide|Show) gender/ });
    const initialGenderState = await genderToggle.getAttribute('aria-checked');
    await genderToggle.click();
    await expect(genderToggle).toHaveAttribute('aria-checked', initialGenderState === 'true' ? 'false' : 'true');
    await expect(page.getByText('Preference saved.').first()).toBeVisible();
    await genderToggle.click();
    await expect(genderToggle).toHaveAttribute('aria-checked', initialGenderState ?? 'false');

    await page.getByRole('button', { name: /Chart preferences/ }).click();
    const overviewSection = page.getByRole('heading', { name: 'Overview', exact: true }).locator('xpath=ancestor::section[1]');
    const defaultChart = overviewSection.getByRole('combobox', { name: 'Default chart' });
    await defaultChart.fill('Composition');
    await page.getByRole('option', { name: 'Composition', exact: true }).click();
    await overviewSection.getByRole('button', { name: 'Update', exact: true }).click();
    await expect(overviewSection.getByText('Preference saved.')).toBeVisible();
    await expect(overviewSection.getByText('Composition', { exact: true })).toBeVisible();

    const educationSection = page.getByRole('heading', { name: 'Education', exact: true }).locator('xpath=ancestor::section[1]');
    const comparisonCard = educationSection.getByRole('heading', { name: 'Comparison data' }).locator('xpath=ancestor::article[1]');
    await expect(comparisonCard.locator('div.rounded-xl.bg-canvas-subtle.px-3\\.5.py-3')).toHaveCount(0);
    const groupBy = comparisonCard.getByRole('combobox', { name: 'Group by' });
    await groupBy.fill('Institution');
    await page.getByRole('option', { name: 'Institution', exact: true }).click();
    const valueSource = comparisonCard.getByRole('combobox', { name: 'Value source' });
    await valueSource.fill('Entry count');
    await page.getByRole('option', { name: 'Entry count', exact: true }).click();
    await comparisonCard.getByRole('button', { name: 'Update', exact: true }).click();
    await expect(comparisonCard.getByText('Chart preference saved.')).toBeVisible();
    await expect(comparisonCard.getByText('Institution', { exact: true })).toBeVisible();
    await expect(comparisonCard.getByText('Entry count', { exact: true })).toBeVisible();

    expect(listRequests).toEqual([]);
});
