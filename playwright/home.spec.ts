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

test('missing portfolios render the not-found boundary during server loading', async ({ page }) => {
    await page.goto('/client/missing/dashboard');

    await expect(page.getByRole('heading', { name: 'Portfolio not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('authentication forms expose correct labels and browser metadata', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.getByRole('heading', { name: 'Sign in to your portfolio' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email');
    await expect(page.getByLabel('Email')).toHaveAttribute('autocomplete', 'email');
    await expect(page.getByLabel('Password')).toHaveAttribute('autocomplete', 'current-password');

    await page.goto('/auth/register');
    await expect(page.getByLabel('Password')).toHaveAttribute('autocomplete', 'new-password');
});

test('an unconfirmed token does not trap users on the email page', async ({ context, page }) => {
    const payload = Buffer.from(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600,
        IsConfirmed: 'False',
    })).toString('base64url');
    await context.addCookies([{
        name: 'AccessToken',
        value: `eyJhbGciOiJub25lIn0.${payload}.`,
        domain: 'localhost',
        path: '/',
    }]);

    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your portfolio' })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
});

test('login rejects short and incorrect passwords without redirecting to email', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('demo@example.com');
    await page.getByLabel('Password').fill('short');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Password must be at least 8 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);

    await page.getByLabel('Password').fill('WrongPassword1!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Wrong username/password')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
});

test('public dashboard is responsive and its contact dialog supports Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/client/demo/dashboard');

    await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
    for (const heading of ['Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Languages']) {
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    const portfolioActions = page.getByRole('group', { name: 'Portfolio actions' });
    await expect(portfolioActions.getByRole('link', { name: 'Go to home page' })).toBeVisible();
    await expect(portfolioActions.getByTestId('theme-toggle-button')).toBeVisible();
    const sendMessageButton = portfolioActions.getByRole('button', { name: 'Send Message' });
    await expect(sendMessageButton).toBeVisible();
    await sendMessageButton.click();
    const dialog = page.getByRole('dialog', { name: 'Send Message' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Full name')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
});

test('profile picture opens an accessible lightbox for guests and owners', async ({ context, page }) => {
    for (const role of ['client', 'owner'] as const) {
        if (role === 'owner') {
            await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
        }

        await page.goto(`/${role}/demo/dashboard`);
        const trigger = page.getByRole('button', { name: 'Enlarge profile picture' });
        await trigger.click();

        const dialog = page.getByRole('dialog', { name: 'Profile picture preview' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('img', { name: "Demo Portfolio's profile picture" })).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Close profile picture preview' })).toBeFocused();
        await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
    }
});

test('public contact cards expose email, phone, WhatsApp, contact, CV, and site actions', async ({ page }) => {
    await page.goto('/client/demo/dashboard');

    await page.getByRole('button', { name: /demo@example\.com/ }).click();
    const emailMenu = page.getByRole('menu', { name: 'Email actions' });
    await expect(emailMenu.getByRole('menuitem', { name: 'Send email' })).toHaveAttribute('href', 'mailto:demo@example.com');
    await emailMenu.getByRole('menuitem', { name: 'Copy' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Email address copied' })).toBeVisible();
    await expect(emailMenu).toBeHidden();

    await page.getByRole('button', { name: /\+905526436811/ }).click();
    const phoneMenu = page.getByRole('menu', { name: 'Phone actions' });
    await expect(phoneMenu.getByRole('menuitem', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/905551234567');
    await expect(phoneMenu.getByRole('menuitem', { name: 'Call' })).toHaveAttribute('href', 'tel:+905526436811');
    await phoneMenu.getByRole('menuitem', { name: 'Copy' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Phone number copied' })).toBeVisible();

    await page.getByRole('button', { name: /\+905526436811/ }).click();
    const downloadPromise = page.waitForEvent('download');
    await phoneMenu.getByRole('menuitem', { name: 'Add to contacts' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Demo-Portfolio.vcf');
    await expect(page.getByRole('status').filter({ hasText: 'Contact download started' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', /fl_attachment:CV/);
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/demo');
    await page.getByRole('region', { name: 'Sites & contact' }).getByRole('button', { name: 'Share portfolio' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Portfolio link copied' })).toBeVisible();
});

test('owner settings open as a dedicated responsive page with clear categories', async ({ context, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
    await page.goto('/owner/demo/dashboard');

    await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
    await page.getByRole('button', { name: 'Open account menu' }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/owner\/demo\/settings$/);
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const categoryDropdown = page.getByRole('combobox', { name: 'Settings category' });
    await expect(categoryDropdown).toHaveValue('');
    await expect(page.getByText('Preferences', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    const genderToggle = page.getByRole('switch', { name: /(?:Hide|Show) gender/ });
    await expect(genderToggle).toBeEnabled();
    await genderToggle.click();
    await expect(page.getByRole('switch', { name: /(?:Hide|Show) gender/ })).toBeVisible();
    await expect(page.getByText('Preference saved.').first()).toBeVisible();

    await categoryDropdown.fill('Chart');
    await page.getByRole('option', { name: 'Chart preferences' }).click();
    await expect(page.getByRole('heading', { name: 'Chart preferences', exact: true })).toBeVisible();

    await categoryDropdown.fill('Preferences');
    await page.getByRole('option', { name: 'Preferences', exact: true }).click();
    await expect(page.getByRole('switch', { name: /(?:Hide|Show) certificate widget/ })).toBeEnabled();
    await expect(page.getByRole('switch', { name: /(?:Hide|Show) certificate bar chart/ })).toBeEnabled();

    await categoryDropdown.fill('Appearance');
    await page.getByRole('option', { name: 'Appearance' }).click();
    await expect(page.locator('#appearance-heading')).toBeVisible();
    await expect(page.getByRole('button', { name: /theme/i })).toBeVisible();

    await categoryDropdown.focus();
    await page.keyboard.press('Backspace');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test('profile and settings toolbars stay visible and settings navigation clears the toolbar', async ({ context, page }) => {
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
    await page.setViewportSize({ width: 1440, height: 500 });

    await page.goto('/owner/demo/profile');
    const profileToolbar = page.getByTestId('owner-page-toolbar');
    await expect(page.getByLabel('Birth date')).toBeVisible();
    const birthDateBox = await page.getByLabel('Birth date').boundingBox();
    const profileUpdateBox = await page.getByRole('button', { name: 'Update', exact: true }).boundingBox();
    expect(birthDateBox).not.toBeNull();
    expect(profileUpdateBox).not.toBeNull();
    expect((profileUpdateBox?.y ?? 0) - ((birthDateBox?.y ?? 0) + (birthDateBox?.height ?? 0))).toBeGreaterThanOrEqual(16);
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(400);
    await expect(profileToolbar).toBeVisible();
    expect((await profileToolbar.boundingBox())?.y ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(1);

    await page.goto('/owner/demo/settings');
    const settingsToolbar = page.getByTestId('owner-page-toolbar');
    const settingsNavigation = page.getByRole('navigation', { name: 'Settings categories' });
    await expect(settingsNavigation).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(400);
    await expect(settingsToolbar).toBeVisible();
    await expect(settingsNavigation).toBeVisible();

    const toolbarBox = await settingsToolbar.boundingBox();
    const navigationBox = await settingsNavigation.boundingBox();
    expect(toolbarBox?.y ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(1);
    expect(navigationBox).not.toBeNull();
    expect(navigationBox?.y ?? 0).toBeGreaterThanOrEqual((toolbarBox?.y ?? 0) + (toolbarBox?.height ?? 0));
});

test('owner portfolio widgets expose useful empty states and accessible actions', async ({ context, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
    await page.goto('/owner/demo/dashboard');

    for (const heading of ['Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Languages']) {
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    }
    for (const emptyState of [
        'No education added',
        'No experience added',
        'No projects added',
        'No skills added',
        'No certificates added',
        'No languages added',
    ]) {
        await expect(page.getByRole('heading', { name: emptyState })).toBeVisible();
    }

    const actions = [
        { widget: 'Education', action: 'Add', dialog: 'Add education', control: 'Institution', role: 'combobox', submit: 'Create' },
        { widget: 'Experience', action: 'Add', dialog: 'Add experience', control: 'Company', role: 'textbox', submit: 'Create' },
        { widget: 'Projects', action: 'Add', dialog: 'Add project', control: 'Title', role: 'textbox', submit: 'Create' },
        { widget: 'Skills', action: 'Manage', dialog: 'Manage skills', control: 'Add skill', role: 'button', submit: 'Update' },
        { widget: 'Certificates', action: 'Add', dialog: 'Add certificate', control: 'Certificate', role: 'combobox', submit: 'Create' },
        { widget: 'Languages', action: 'Manage', dialog: 'Manage languages', control: 'Add language', role: 'button', submit: 'Update' },
    ] as const;
    for (const action of actions) {
        const region = page.getByRole('region', { name: action.widget });
        const trigger = region.getByRole('button', { name: action.action });
        await expect(trigger.locator('span')).toHaveCount(0);
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: action.dialog });
        await expect(dialog).toBeVisible();
        const primaryControl = dialog.getByRole(action.role, { name: action.control });
        await expect(primaryControl).toBeVisible();
        if (action.role === 'button') await primaryControl.click();
        await dialog.getByRole('button', { name: action.submit }).click();
        await expect(dialog.getByRole('alert').first()).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
    }

    await expect(page.getByRole('button', { name: 'Reorder items' })).toHaveCount(0);

    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test('widget update modal keeps its action visible without covering fields and marks required labels', async ({ context, page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await context.addCookies([
        { name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' },
        { name: 'WidgetFixture', value: 'populated', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/owner/demo/dashboard');

    const education = page.getByRole('region', { name: 'Education' });
    await education.getByRole('button', { name: 'Show entries (1)' }).click();
    await education.getByRole('button', { name: 'View item details' }).click();
    await page.getByRole('dialog', { name: 'Entry details' }).getByRole('button', { name: 'Edit' }).click();

    const dialog = page.getByRole('dialog', { name: 'Update Education' });
    const updateButton = dialog.getByRole('button', { name: 'Update' });
    const scrollRegion = dialog.getByTestId('controlled-form-scroll');
    const footer = dialog.getByTestId('controlled-form-footer');
    await expect(updateButton).toBeVisible();

    for (const label of ['Institution', 'Degree', 'Field of study', 'Start date', 'End date']) {
        const fieldLabel = dialog.locator('label', { hasText: label });
        await expect(fieldLabel.locator('span[aria-hidden="true"]')).toHaveText('*');
    }
    await expect(dialog.locator('label', { hasText: 'Description' }).locator('span[aria-hidden="true"]')).toHaveCount(0);
    await expect(dialog.getByRole('combobox', { name: 'Institution' })).toHaveAttribute('aria-required', 'true');
    await expect(dialog.getByLabel('Start date')).toHaveAttribute('required', '');

    const initialButtonBox = await updateButton.boundingBox();
    await scrollRegion.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    const scrolledButtonBox = await updateButton.boundingBox();
    expect(scrolledButtonBox?.y).toBe(initialButtonBox?.y);

    const lastFieldBox = await dialog.getByRole('combobox', { name: 'Skills' }).boundingBox();
    const footerBox = await footer.boundingBox();
    expect(lastFieldBox).not.toBeNull();
    expect(footerBox).not.toBeNull();
    expect((lastFieldBox?.y ?? 0) + (lastFieldBox?.height ?? 0)).toBeLessThanOrEqual(footerBox?.y ?? 0);
});

test('widget create modal keeps its action visible without covering fields', async ({ context, page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
    await page.goto('/owner/demo/dashboard');

    await page.getByRole('region', { name: 'Education' }).getByRole('button', { name: 'Add' }).click();
    const dialog = page.getByRole('dialog', { name: 'Add education' });
    const createButton = dialog.getByRole('button', { name: 'Create' });
    const scrollRegion = dialog.getByTestId('controlled-form-scroll');
    const footer = dialog.getByTestId('controlled-form-footer');
    await expect(createButton).toBeVisible();

    const initialButtonBox = await createButton.boundingBox();
    await scrollRegion.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    const scrolledButtonBox = await createButton.boundingBox();
    expect(scrolledButtonBox?.y).toBe(initialButtonBox?.y);

    const lastFieldBox = await dialog.getByRole('combobox', { name: 'Skills' }).boundingBox();
    const footerBox = await footer.boundingBox();
    expect(lastFieldBox).not.toBeNull();
    expect(footerBox).not.toBeNull();
    expect((lastFieldBox?.y ?? 0) + (lastFieldBox?.height ?? 0)).toBeLessThanOrEqual(footerBox?.y ?? 0);
});

test('settings route is restricted to portfolio owners', async ({ page }) => {
    const response = await page.goto('/client/demo/settings');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Settings not found' })).toBeVisible();
});

test('owner messages use a responsive list and detail page', async ({ context, page }) => {
    await context.addCookies([{ name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' }]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/owner/demo/messages');
    await expect(page.getByRole('heading', { name: 'Messages', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByRole('button', { name: /Alice Example/ }).click();
    await expect(page.getByRole('heading', { name: 'Project inquiry' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Selected message' }).getByText('I would like to discuss a frontend project with you.')).toBeVisible();
    await page.getByRole('button', { name: 'Back to message list' }).click();
    await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Project inquiry' })).toBeVisible();
});

test('messages route is restricted to portfolio owners', async ({ page }) => {
    await page.goto('/client/demo/messages');

    await expect(page.getByRole('heading', { name: 'Messages not found' })).toBeVisible();
});

test('portfolio charts use guided responsive and accessible views', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('console', (message) => {
        if (message.type() === 'error' && /hydrat|server rendered html/i.test(message.text())) hydrationErrors.push(message.text());
    });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/client/demo/dashboard');

    await expect(page.getByRole('region', { name: 'Overview' }).getByText('Education', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Education timeline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Career timeline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skill evidence matrix' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Language proficiency' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Languages' }).getByText('80%').first()).toBeVisible();
    await expect(page.getByRole('region', { name: 'Skills' }).getByLabel('No projects evidence')).toHaveText('-');
    await expect(page.getByRole('heading', { name: /radar|degrees duration/i })).toHaveCount(0);

    const overview = page.getByRole('region', { name: 'Overview' });
    await overview.getByRole('tab', { name: 'Composition' }).click();
    await expect(overview.getByRole('heading', { name: 'Portfolio composition' })).toBeVisible();
    await overview.getByText('View chart data').click();
    await expect(overview.getByRole('table')).toBeVisible();

    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
    expect(hydrationErrors).toEqual([]);
});

test('portfolio widgets prioritize visualizations and disclose entry cards independently', async ({ page }) => {
    await page.goto('/client/demo/dashboard');

    const education = page.getByRole('region', { name: 'Education' });
    const experience = page.getByRole('region', { name: 'Experience' });
    const educationToggle = education.getByRole('button', { name: 'Show entries (1)' });
    const experienceToggle = experience.getByRole('button', { name: 'Show entries (1)' });

    await expect(education.getByRole('heading', { name: 'Education timeline' })).toBeVisible();
    await expect(education.getByText('BSc at Design University')).toHaveCount(0);
    await expect(educationToggle).toHaveAttribute('aria-expanded', 'false');
    await educationToggle.focus();
    await page.keyboard.press('Enter');

    await expect(education.getByText('BSc at Design University')).toBeVisible();
    await expect(education.getByRole('button', { name: 'Hide entries (1)' })).toHaveAttribute('aria-expanded', 'true');
    await expect(experience.getByText('Frontend Developer at Example Studio')).toHaveCount(0);
    await expect(experienceToggle).toHaveAttribute('aria-expanded', 'false');

    await education.getByRole('button', { name: 'Hide entries (1)' }).click();
    await expect(education.getByText('BSc at Design University')).toHaveCount(0);
});

test('widgets show entry cards automatically when visualizations are disabled', async ({ context, page }) => {
    await context.addCookies([
        { name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' },
        { name: 'WidgetFixture', value: 'populated', domain: 'localhost', path: '/' },
        { name: 'HideVisualizations', value: 'true', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/owner/demo/dashboard');

    const education = page.getByRole('region', { name: 'Education' });
    await expect(education.getByText('BSc at Design University')).toBeVisible();
    await expect(education.getByRole('button', { name: /entries/ })).toHaveCount(0);
});

test('owner reordering expands collapsed entry cards and leaves them open', async ({ context, page }) => {
    await context.addCookies([
        { name: 'AccessToken', value: 'test-access-token', domain: 'localhost', path: '/' },
        { name: 'WidgetFixture', value: 'reorderable', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/owner/demo/dashboard');

    const education = page.getByRole('region', { name: 'Education' });
    await expect(education.getByText('BSc at Design University')).toHaveCount(0);
    await education.getByRole('button', { name: 'Reorder items' }).click();
    await expect(education.getByText('BSc at Design University')).toBeVisible();
    await education.getByRole('button', { name: 'Finish reordering' }).click();
    await expect(education.getByText('BSc at Design University')).toBeVisible();
    await expect(education.getByRole('button', { name: 'Hide entries (2)' })).toHaveAttribute('aria-expanded', 'true');
});

test('key routes pass baseline accessibility and responsive structure checks', async ({ page }) => {
    const routes = ['/', '/auth/login', '/auth/register', '/auth/email', '/search', '/client/demo/dashboard', '/owner/demo/settings', '/owner/demo/messages'];
    const viewports = [
        { width: 390, height: 844 },
        { width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        for (const route of routes) {
            await page.goto(route);
            if (route.includes('/dashboard')) {
                await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
            }
            if (route.includes('/settings')) {
                await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
            }
            if (route.includes('/messages')) {
                await expect(page.getByRole('heading', { name: 'Messages', exact: true })).toBeVisible();
            }

            const audit = await page.evaluate(() => {
                const accessibleName = (element: Element) => {
                    const labelledBy = element.getAttribute('aria-labelledby');
                    const labelledText = labelledBy
                        ?.split(/\s+/)
                        .map(id => document.getElementById(id)?.textContent?.trim())
                        .filter(Boolean)
                        .join(' ');
                    return element.getAttribute('aria-label')?.trim()
                        || labelledText
                        || element.textContent?.trim()
                        || element.getAttribute('title')?.trim()
                        || '';
                };
                const visible = (element: Element) => {
                    const style = getComputedStyle(element);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                };
                const ids = Array.from(document.querySelectorAll('[id]')).map(element => element.id);
                const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
                const unlabeledFields = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'))
                    .filter(visible)
                    .filter(field => {
                        const id = field.getAttribute('id');
                        return !field.getAttribute('aria-label')
                            && !field.getAttribute('aria-labelledby')
                            && !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
                    });
                const unnamedControls = Array.from(document.querySelectorAll('button, [role="button"]'))
                    .filter(visible)
                    .filter(control => !accessibleName(control));
                const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(image => !image.hasAttribute('alt'));

                return {
                    duplicateIds: [...new Set(duplicateIds)],
                    headingCount: document.querySelectorAll('h1').length,
                    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                    imagesWithoutAlt: imagesWithoutAlt.length,
                    unlabeledFields: unlabeledFields.length,
                    unnamedControls: unnamedControls.length,
                };
            });

            expect(audit, `${route} at ${viewport.width}px`).toEqual({
                duplicateIds: [],
                headingCount: 1,
                horizontalOverflow: false,
                imagesWithoutAlt: 0,
                unlabeledFields: 0,
                unnamedControls: 0,
            });
        }
    }
});
