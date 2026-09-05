'use client';

import { ThemeSwitch } from '@/design-system';
import { UserChartPreferenceForm } from '../chart-preferences/forms/UserChartPreferenceForm';
import { UserWidgetPreferenceForm } from '../widget-preferences/forms/UserWidgetPreferenceForm';
import { FormDropdown } from '@/features/dashboard/forms/FormDropdown';
import type { Option } from '@/features/types.features';
import { useLoadChartType, useLoadWidget } from '../chart-preferences/hooks';
import { useLoadWidgetPreference } from '../widget-preferences/hooks';
import { paths } from '@/lib/pathHelper';
import { useAppSelector } from '@/lib/store/hooks';
import { chart_preferences, checkWidgetPreferences, useUrlParams, widget_preferences } from '@/lib/utils';
import { ArrowLeft, BarChart3, BriefcaseBusiness, Calendar, Component, FolderKanban, GraduationCap, Languages, LayoutDashboard, LayoutPanelTop, LogOut, Mail, Mars, Palette, Phone, PieChart, Radar, Settings2, SlidersHorizontal, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type ReactNode } from 'react';

type Category = 'preferences' | 'charts' | 'general';
type PreferenceItem = { key: string; title: string; icon: LucideIcon; parent?: string };

const categories: Array<{ id: Category; label: string; description: string; icon: LucideIcon }> = [
    { id: 'preferences', label: 'Preferences', description: 'Choose what visitors see.', icon: SlidersHorizontal },
    { id: 'charts', label: 'Chart preferences', description: 'Control how chart data is grouped.', icon: BarChart3 },
    { id: 'general', label: 'General', description: 'Appearance and account actions.', icon: Settings2 },
];
const categoryOptions: Option[] = categories.map(({ id, label }) => ({ value: id, label }));

const preferenceSections: Array<{ title: string; description: string; icon: LucideIcon; items: PreferenceItem[] }> = [
    {
        title: 'Profile',
        description: 'Control which personal details appear on your public portfolio.',
        icon: UserRound,
        items: [
            { key: widget_preferences.key.show_gender, title: 'Gender', icon: Mars },
            { key: widget_preferences.key.show_birthdate, title: 'Birthdate', icon: Calendar },
            { key: widget_preferences.key.show_email_address, title: 'Email address', icon: Mail },
            { key: widget_preferences.key.show_phone_number, title: 'Phone number', icon: Phone },
        ],
    },
    {
        title: 'Overview',
        description: 'Manage the portfolio overview and its visual summaries.',
        icon: LayoutDashboard,
        items: [
            { key: widget_preferences.key.show_overview_widget, title: 'Overview widget', icon: Component },
            { key: widget_preferences.key.show_overview_bar_chart, title: 'Bar chart', icon: BarChart3, parent: widget_preferences.key.show_overview_widget },
            { key: widget_preferences.key.show_overview_pie_chart, title: 'Pie chart', icon: PieChart, parent: widget_preferences.key.show_overview_widget },
            { key: widget_preferences.key.show_overview_radar_chart, title: 'Radar chart', icon: Radar, parent: widget_preferences.key.show_overview_widget },
        ],
    },
    ...([['Education', 'education'], ['Experience', 'experience'], ['Language', 'language']] as const).map(([title, key]) => ({
        title,
        description: `Choose which charts appear in the ${title.toLowerCase()} section.`,
        icon: key === 'education' ? GraduationCap : key === 'experience' ? BriefcaseBusiness : Languages,
        items: [
            { key: widget_preferences.key[`show_${key}_bar_chart`], title: 'Bar chart', icon: BarChart3 },
            { key: widget_preferences.key[`show_${key}_pie_chart`], title: 'Pie chart', icon: PieChart },
            { key: widget_preferences.key[`show_${key}_radar_chart`], title: 'Radar chart', icon: Radar },
        ],
    })),
    ...([['Project', 'project'], ['Skill', 'skill']] as const).map(([title, key]) => ({
        title,
        description: `Manage the ${title.toLowerCase()} widget and its charts.`,
        icon: key === 'project' ? FolderKanban : Sparkles,
        items: [
            { key: widget_preferences.key[`show_${key}_widget`], title: `${title} widget`, icon: Component },
            { key: widget_preferences.key[`show_${key}_bar_chart`], title: 'Bar chart', icon: BarChart3, parent: widget_preferences.key[`show_${key}_widget`] },
            { key: widget_preferences.key[`show_${key}_pie_chart`], title: 'Pie chart', icon: PieChart, parent: widget_preferences.key[`show_${key}_widget`] },
            { key: widget_preferences.key[`show_${key}_radar_chart`], title: 'Radar chart', icon: Radar, parent: widget_preferences.key[`show_${key}_widget`] },
        ],
    })),
];

const valueSourceOptions = [{ label: 'Duration', value: 'duration' }, { label: 'Count', value: 'count' }];
const chartSections = [
    {
        title: 'Education', widget: chart_preferences.key.widget.education,
        charts: [
            { type: 'bar' as const, label: 'Bar chart', icon: BarChart3, visibilityKey: widget_preferences.key.show_education_bar_chart },
            { type: 'pie' as const, label: 'Pie chart', icon: PieChart, visibilityKey: widget_preferences.key.show_education_pie_chart },
            { type: 'radar' as const, label: 'Radar chart', icon: Radar, visibilityKey: widget_preferences.key.show_education_radar_chart },
        ],
    },
    {
        title: 'Experience', widget: chart_preferences.key.widget.experience,
        charts: [
            { type: 'bar' as const, label: 'Bar chart', icon: BarChart3, visibilityKey: widget_preferences.key.show_experience_bar_chart },
            { type: 'pie' as const, label: 'Pie chart', icon: PieChart, visibilityKey: widget_preferences.key.show_experience_pie_chart },
            { type: 'radar' as const, label: 'Radar chart', icon: Radar, visibilityKey: widget_preferences.key.show_experience_radar_chart },
        ],
    },
    {
        title: 'Project', widget: chart_preferences.key.widget.project, parent: widget_preferences.key.show_project_widget,
        charts: [
            { type: 'bar' as const, label: 'Bar chart', icon: BarChart3, visibilityKey: widget_preferences.key.show_project_bar_chart },
            { type: 'pie' as const, label: 'Pie chart', icon: PieChart, visibilityKey: widget_preferences.key.show_project_pie_chart },
            { type: 'radar' as const, label: 'Radar chart', icon: Radar, visibilityKey: widget_preferences.key.show_project_radar_chart },
        ],
    },
];

function SettingsCard({ icon: Icon, title, description, children }: { icon: LucideIcon; title: string; description: string; children: ReactNode }) {
    return <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-black/5">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><Icon className="size-4" aria-hidden="true" /></span><div><h3 className="font-bold tracking-[-0.02em]">{title}</h3><p className="mt-1 text-sm leading-6 text-ink-muted">{description}</p></div></div>
        <div className="mt-5 border-t border-line pt-5">{children}</div>
    </article>;
}

function SectionHeading({ title, description }: { title: string; description: string }) {
    return <div><h2 className="text-xl font-bold tracking-[-0.035em]">{title}</h2><p className="mt-1 text-sm leading-6 text-ink-muted">{description}</p></div>;
}

export const SettingsPage = () => {
    const router = useRouter();
    const { role, username } = useUrlParams();
    const { lstUserPreferences } = useAppSelector((state) => state.userWidgetPreference);
    const [activeCategory, setActiveCategory] = useState<Category>('preferences');
    const [isLoggingOut, startLogout] = useTransition();
    const currentCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];
    const selectedCategory = categoryOptions.find((option) => option.value === activeCategory);

    useLoadWidgetPreference();
    useLoadWidget();
    useLoadChartType();

    const handleLogout = () => startLogout(async () => {
        try {
            await fetch('/api/Account/Logout', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        } finally {
            await fetch(paths.root.auth.logout.path(), { method: 'POST' }).catch(() => undefined);
            router.replace(paths.root.auth.login.path());
            router.refresh();
        }
    });

    return <main className="min-h-svh bg-canvas px-4 py-5 text-ink sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl">
        <Link href={username ? paths.root.dashboard('owner', username).path() : '/'} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-ink-muted transition hover:bg-surface hover:text-ink"><ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard</Link>
        <header className="mt-4 rounded-[1.75rem] border border-line bg-surface p-6 shadow-lg shadow-black/5 sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20"><Settings2 className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Portfolio editor</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">Fine-tune your public portfolio, chart presentation, appearance, and account.</p></div></div></header>

        <div className="mt-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-6">
            <div className="block lg:hidden">
                <FormDropdown
                    label="Settings category"
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={(option) => setActiveCategory(((option as Option | null)?.value as Category | undefined) ?? 'preferences')}
                    placeholder="Search settings categories..."
                />
            </div>
            <nav aria-label="Settings categories" className="sticky top-6 hidden rounded-2xl border border-line bg-surface p-2 shadow-sm lg:block">{categories.map(({ id, label, description, icon: Icon }) => { const active = activeCategory === id; return <button key={id} type="button" onClick={() => setActiveCategory(id)} aria-current={active ? 'page' : undefined} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-accent-soft text-accent-strong' : 'text-ink-muted hover:bg-canvas-subtle hover:text-ink'}`}><Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span><span className="block text-sm font-bold">{label}</span><span className="mt-0.5 block text-xs leading-5">{description}</span></span></button>; })}</nav>

            <section className="mt-6 min-w-0 lg:mt-0" aria-labelledby={`${activeCategory}-heading`}>
                <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Settings category</p><h2 id={`${activeCategory}-heading`} className="mt-1 text-2xl font-bold tracking-[-0.04em]">{currentCategory.label}</h2><p className="mt-1 text-sm text-ink-muted">{currentCategory.description}</p></div>
                {activeCategory === 'preferences' && <div className="space-y-5">{preferenceSections.map((section) => { const visibleItems = section.items.filter((item) => !item.parent || checkWidgetPreferences(lstUserPreferences, item.parent)); return <SettingsCard key={section.title} icon={section.icon} title={section.title} description={section.description}><div className="divide-y divide-line">{visibleItems.map((item) => { const Icon = item.icon; return <div key={item.key} className="flex min-h-16 items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-canvas-subtle text-ink-muted"><Icon className="size-4" aria-hidden="true" /></span><h3 className="truncate text-sm font-bold tracking-[-0.01em] sm:text-base">{item.title}</h3></div><UserWidgetPreferenceForm preferenceKey={item.key} compact /></div>; })}</div></SettingsCard>; })}</div>}
                {activeCategory === 'charts' && <div className="space-y-9">{chartSections.filter((section) => !section.parent || checkWidgetPreferences(lstUserPreferences, section.parent)).map((section) => { const charts = section.charts.filter((chart) => checkWidgetPreferences(lstUserPreferences, chart.visibilityKey)); const sectionKey = section.title.toLowerCase() as 'education' | 'experience' | 'project'; return <section key={section.title} className="space-y-4"><SectionHeading title={section.title} description={`Configure the visible charts in your ${section.title.toLowerCase()} section.`} />{charts.length > 0 ? <div className="grid gap-4 xl:grid-cols-2">{charts.map((chart) => <SettingsCard key={chart.type} icon={chart.icon} title={chart.label} description={`Choose how the ${section.title.toLowerCase()} ${chart.label.toLowerCase()} summarizes your data.`}><UserChartPreferenceForm preferenceKeys={{ widget: section.widget, chartType: chart_preferences.key.chart[chart.type] }} preferenceValues={{ groupBy: chart_preferences.values[sectionKey][chart.type], valueSource: valueSourceOptions }} /></SettingsCard>)}</div> : <div className="rounded-2xl border border-dashed border-line bg-canvas-subtle p-6 text-sm text-ink-muted">Enable a chart in Preferences to customize it here.</div>}</section>; })}</div>}
                {activeCategory === 'general' && <div className="space-y-9"><section className="space-y-4"><SectionHeading title="Appearance" description="Choose the color scheme used across your portfolio editor." /><SettingsCard icon={Palette} title="Theme" description="Switch between light and dark mode. This change is applied immediately."><div className="flex items-center justify-between gap-4 rounded-xl bg-canvas-subtle p-3"><span className="text-sm font-semibold">Change theme</span><ThemeSwitch /></div></SettingsCard></section>{role === 'owner' && username && <section className="space-y-4"><SectionHeading title="Account" description="Manage your current signed-in session." /><SettingsCard icon={LayoutPanelTop} title="Sign out" description="End this session and return to the sign-in page."><button type="button" onClick={handleLogout} disabled={isLoggingOut} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/8 px-4 text-sm font-bold text-danger transition hover:bg-danger/12 disabled:opacity-60 sm:w-auto"><LogOut className="size-4" aria-hidden="true" />{isLoggingOut ? 'Logging out…' : 'Logout'}</button></SettingsCard></section>}</div>}
            </section>
        </div>
    </div></main>;
};
