'use client';

import { ThemeSwitch } from '@/design-system';
import { OwnerHeaderActions } from '@/features/dashboard/profile/account';
import { UserChartPreferenceForm } from '../chart-preferences/forms/UserChartPreferenceForm';
import { UserWidgetPreferenceForm } from '../widget-preferences/forms/UserWidgetPreferenceForm';
import { FormDropdown } from '@/features/dashboard/forms/FormDropdown';
import type { Option } from '@/features/types.features';
import { useLoadChartType, useLoadWidget } from '../chart-preferences/hooks';
import { useLoadWidgetPreference } from '../widget-preferences/hooks';
import { useAppSelector } from '@/lib/store/hooks';
import { chart_preferences, checkWidgetPreferences, useUrlParams, widget_preferences } from '@/lib/utils';
import { ArrowLeft, Award, BarChart3, BriefcaseBusiness, Calendar, CalendarRange, Component, Download, FolderKanban, GraduationCap, Grid3X3, Languages, LayoutDashboard, Link as LinkIcon, Mail, Mars, MessageCircle, Palette, Phone, PieChart, Radar, Settings2, SlidersHorizontal, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
import { paths } from '@/lib/pathHelper';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { widgetChartPolicies, type ChartWidgetKey } from '@/features/dashboard/chartPolicies';
import type { ChartViewKey } from '@/features/dashboard/types.presentation';

type Category = 'preferences' | 'charts' | 'appearance';
type PreferenceItem = { key: string; title: string; icon: LucideIcon; parent?: string; defaultValue?: 'show' | 'hide' };

const categories: Array<{ id: Category; label: string; description: string; icon: LucideIcon }> = [
    { id: 'preferences', label: 'Preferences', description: 'Choose what visitors see.', icon: SlidersHorizontal },
    { id: 'charts', label: 'Chart preferences', description: 'Control how chart data is grouped.', icon: BarChart3 },
    { id: 'appearance', label: 'Appearance', description: 'Choose how the editor looks.', icon: Palette },
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
            { key: widget_preferences.key.show_whatsapp, title: 'WhatsApp', icon: MessageCircle, defaultValue: 'hide' },
            { key: widget_preferences.key.show_site_links, title: 'Site links', icon: LinkIcon, defaultValue: 'hide' },
            { key: widget_preferences.key.show_cv, title: 'CV download', icon: Download, defaultValue: 'hide' },
        ],
    },
    {
        title: 'Overview',
        description: 'Manage the portfolio overview and its visual summaries.',
        icon: LayoutDashboard,
        items: [
            { key: widget_preferences.key.show_overview_widget, title: 'Overview widget', icon: Component },
            { key: widget_preferences.key.show_overview_bar_chart, title: 'Section comparison', icon: BarChart3, parent: widget_preferences.key.show_overview_widget },
            { key: widget_preferences.key.show_overview_pie_chart, title: 'Composition donut', icon: PieChart, parent: widget_preferences.key.show_overview_widget },
        ],
    },
    {
        title: 'Education', description: 'Choose between a timeline and duration comparison.', icon: GraduationCap,
        items: [
            { key: widget_preferences.key.show_education_bar_chart, title: 'Education timeline', icon: CalendarRange },
            { key: widget_preferences.key.show_education_pie_chart, title: 'Duration comparison', icon: BarChart3 },
        ],
    },
    {
        title: 'Experience', description: 'Choose between a career timeline and duration comparison.', icon: BriefcaseBusiness,
        items: [
            { key: widget_preferences.key.show_experience_bar_chart, title: 'Career timeline', icon: CalendarRange },
            { key: widget_preferences.key.show_experience_pie_chart, title: 'Duration comparison', icon: BarChart3 },
        ],
    },
    {
        title: 'Language', description: 'Choose valid views of normalized language proficiency.', icon: Languages,
        items: [
            { key: widget_preferences.key.show_language_bar_chart, title: 'Proficiency bars', icon: BarChart3 },
            { key: widget_preferences.key.show_language_radar_chart, title: 'Radar proficiency', icon: Radar },
        ],
    },
    ...([['Project', 'project'], ['Skill', 'skill'], ['Certificate', 'certificate']] as const).map(([title, key]) => ({
        title,
        description: `Manage the ${title.toLowerCase()} widget and its valid visualizations.`,
        icon: key === 'project' ? FolderKanban : key === 'skill' ? Sparkles : Award,
        items: [
            { key: widget_preferences.key[`show_${key}_widget`], title: `${title} widget`, icon: Component },
            { key: widget_preferences.key[`show_${key}_bar_chart`], title: key === 'project' ? 'Technology comparison' : key === 'skill' ? 'Evidence matrix' : 'Certificate timeline', icon: key === 'skill' ? Grid3X3 : key === 'certificate' ? CalendarRange : BarChart3, parent: widget_preferences.key[`show_${key}_widget`] },
            { key: widget_preferences.key[`show_${key}_pie_chart`], title: key === 'project' ? 'Composition donut' : key === 'skill' ? 'Evidence comparison' : 'Credential comparison', icon: key === 'project' ? PieChart : BarChart3, parent: widget_preferences.key[`show_${key}_widget`] },
        ],
    })),
];

const chartSectionParents: Partial<Record<ChartWidgetKey, string>> = {
    overview: widget_preferences.key.show_overview_widget,
    project: widget_preferences.key.show_project_widget,
    skill: widget_preferences.key.show_skill_widget,
    certificate: widget_preferences.key.show_certificate_widget,
};

const chartSectionIcons: Record<ChartWidgetKey, LucideIcon> = {
    overview: LayoutDashboard,
    education: GraduationCap,
    experience: BriefcaseBusiness,
    project: FolderKanban,
    skill: Sparkles,
    language: Languages,
    certificate: Award,
};

const chartViewIcons: Record<ChartViewKey, LucideIcon> = {
    timeline: CalendarRange,
    comparison: BarChart3,
    composition: PieChart,
    matrix: Grid3X3,
    profile: Radar,
};

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
    const { username } = useUrlParams();
    const { user } = useAppSelector((state) => state.profile);
    const { unreadContactMessageCount } = useAppSelector((state) => state.contactMessage);
    const { lstUserPreferences, preference } = useAppSelector((state) => state.userWidgetPreference);
    const { widget, chartType } = useAppSelector((state) => state.userChartPreference);
    const { lstPreferences } = preference;
    const { lstWidgets } = widget;
    const { lstChartTypes } = chartType;
    const [activeCategory, setActiveCategory] = useState<Category>('preferences');
    const currentCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];
    const selectedCategory = categoryOptions.find((option) => option.value === activeCategory);

    useLoadWidgetPreference();
    useLoadWidget();
    useLoadChartType();

    return <main className="min-h-svh bg-canvas px-4 py-5 text-ink sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl">
        <div data-testid="owner-page-toolbar" className="sticky top-0 z-40 -mx-4 flex min-h-[4.25rem] items-center justify-between gap-4 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8"><Link href={username ? paths.root.dashboard('owner', username).path() : '/'} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-ink-muted transition hover:bg-surface hover:text-ink"><ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard</Link>{user ? <OwnerHeaderActions user={user} unreadMessageCount={unreadContactMessageCount} /> : null}</div>
        <header className="mt-4 rounded-[1.75rem] border border-line bg-surface p-6 shadow-lg shadow-black/5 sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20"><Settings2 className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Portfolio editor</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">Fine-tune your public portfolio, chart presentation, and appearance.</p></div></div></header>

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
            <nav aria-label="Settings categories" className="sticky top-24 hidden rounded-2xl border border-line bg-surface p-2 shadow-sm lg:block">{categories.map(({ id, label, description, icon: Icon }) => { const active = activeCategory === id; return <button key={id} type="button" onClick={() => setActiveCategory(id)} aria-current={active ? 'page' : undefined} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-accent-soft text-accent-strong' : 'text-ink-muted hover:bg-canvas-subtle hover:text-ink'}`}><Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span><span className="block text-sm font-bold">{label}</span><span className="mt-0.5 block text-xs leading-5">{description}</span></span></button>; })}</nav>

            <section className="mt-6 min-w-0 lg:mt-0" aria-labelledby={`${activeCategory}-heading`}>
                <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Settings category</p><h2 id={`${activeCategory}-heading`} className="mt-1 text-2xl font-bold tracking-[-0.04em]">{currentCategory.label}</h2><p className="mt-1 text-sm text-ink-muted">{currentCategory.description}</p></div>
                {activeCategory === 'preferences' && <div className="space-y-5">{preferenceSections.map((section) => { const visibleItems = section.items.filter((item) => !item.parent || checkWidgetPreferences(lstUserPreferences, item.parent)); return <SettingsCard key={section.title} icon={section.icon} title={section.title} description={section.description}><div className="divide-y divide-line">{visibleItems.map((item) => { const Icon = item.icon; return <div key={item.key} className="flex min-h-16 items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-canvas-subtle text-ink-muted"><Icon className="size-4" aria-hidden="true" /></span><h3 className="truncate text-sm font-bold tracking-[-0.01em] sm:text-base">{item.title}</h3></div><UserWidgetPreferenceForm preferenceKey={item.key} compact defaultValue={item.defaultValue} /></div>; })}</div></SettingsCard>; })}</div>}
                {activeCategory === 'charts' && (
                    <div className="space-y-9">
                        {(Object.entries(widgetChartPolicies) as Array<[ChartWidgetKey, (typeof widgetChartPolicies)[ChartWidgetKey]]>)
                            .filter(([key]) => !chartSectionParents[key] || checkWidgetPreferences(lstUserPreferences, chartSectionParents[key]!))
                            .map(([key, policy]) => {
                                const enabledViews = policy.views.filter((view) => checkWidgetPreferences(lstUserPreferences, view.visibilityKey));
                                const enabledViewKeys = new Set(enabledViews.map((view) => view.key));
                                const defaultPreferenceAvailable = lstPreferences.some((item) => item.name === policy.preferenceKey);
                                const availableEditors = policy.editors.filter((editor) => enabledViewKeys.has(editor.view));
                                const widgetLookupAvailable = lstWidgets.some((item) => item.name === policy.widgetName);

                                return (
                                    <section key={key} className="space-y-4">
                                        <SectionHeading title={policy.title} description={`Configure the visible charts in your ${policy.title.toLowerCase()} section.`} />
                                        {enabledViews.length ? (
                                            <div className="grid gap-4 xl:grid-cols-2">
                                                <SettingsCard icon={chartSectionIcons[key]} title="Default chart" description="Choose the chart visitors see first.">
                                                    {enabledViews.length === 1 ? (
                                                        <p className="rounded-xl bg-canvas-subtle px-3.5 py-3 text-sm text-ink-muted">
                                                            <span className="font-semibold text-ink">Only enabled view:</span> {enabledViews[0].label}
                                                        </p>
                                                    ) : defaultPreferenceAvailable ? (
                                                        <UserWidgetPreferenceForm
                                                            preferenceKey={policy.preferenceKey}
                                                            preferenceValues={enabledViews.map(({ key: value, label }) => ({ value, label }))}
                                                            label="Default chart"
                                                        />
                                                    ) : (
                                                        <p className="rounded-xl border border-dashed border-line bg-canvas-subtle px-3.5 py-3 text-sm text-ink-muted">
                                                            Default selection will be available after the server preference lookup is updated.
                                                        </p>
                                                    )}
                                                </SettingsCard>

                                                {policy.fixedSummary ? (
                                                    <SettingsCard icon={chartViewIcons[policy.systemDefault]} title="Data setup" description="This widget has one analytically valid grouping and value.">
                                                        <p className="rounded-xl bg-canvas-subtle px-3.5 py-3 text-sm text-ink-muted">{policy.fixedSummary}</p>
                                                    </SettingsCard>
                                                ) : null}

                                                {availableEditors.map((editor) => {
                                                    const chartTypeName = chart_preferences.key.chart[editor.chartType];
                                                    const editorAvailable = widgetLookupAvailable && lstChartTypes.some((item) => item.name === chartTypeName);
                                                    return (
                                                        <SettingsCard key={`${key}-${editor.view}`} icon={chartViewIcons[editor.view]} title={editor.title} description={editor.description}>
                                                            {editorAvailable ? (
                                                                <UserChartPreferenceForm
                                                                    preferenceKeys={{ widget: policy.widgetName, chartType: chartTypeName }}
                                                                    preferenceValues={{ groupBy: editor.groupBy, valueSource: editor.valueSource }}
                                                                />
                                                            ) : (
                                                                <p className="rounded-xl border border-dashed border-line bg-canvas-subtle px-3.5 py-3 text-sm text-ink-muted">
                                                                    This chart configuration will be available after its server lookup records are updated.
                                                                </p>
                                                            )}
                                                        </SettingsCard>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-line bg-canvas-subtle p-6 text-sm text-ink-muted">Enable a chart in Preferences to customize it here.</div>
                                        )}
                                    </section>
                                );
                            })}
                    </div>
                )}
                {activeCategory === 'appearance' && <section className="space-y-4"><SectionHeading title="Appearance" description="Choose the color scheme used across your portfolio editor." /><SettingsCard icon={Palette} title="Theme" description="Switch between light and dark mode. This change is applied immediately."><div className="flex items-center justify-between gap-4 rounded-xl bg-canvas-subtle p-3"><span className="text-sm font-semibold">Change theme</span><ThemeSwitch /></div></SettingsCard></section>}
            </section>
        </div>
    </div></main>;
};
