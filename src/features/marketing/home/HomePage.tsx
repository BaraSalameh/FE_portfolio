import { ActionLink, PageContainer } from '@/design-system';
import { paths } from '@/lib/pathHelper';
import { ArrowRight, Check, LayoutDashboard, Link2, WandSparkles } from 'lucide-react';
import { HomeHeader } from './HomeHeader';
import { PortfolioPreview } from './PortfolioPreview';

const steps = [
    { icon: WandSparkles, number: '01', title: 'Shape your story', copy: 'Add the experience, projects, and skills that define your work.' },
    { icon: LayoutDashboard, number: '02', title: 'Make it yours', copy: 'Arrange your portfolio and choose the view that fits your profession.' },
    { icon: Link2, number: '03', title: 'Share one link', copy: 'Publish a focused profile that is easy to explore on any screen.' },
];

export function HomePage() {
    return (
        <div className="min-h-svh bg-canvas text-ink">
            <HomeHeader />
            <main>
                <PageContainer className="grid min-h-[calc(100svh-4rem)] items-center gap-14 py-14 sm:min-h-[calc(100svh-4.5rem)] sm:py-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(34rem,1.12fr)] lg:gap-16 lg:py-24">
                    <section className="max-w-[43rem]">
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted shadow-sm">
                            <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
                            A clearer way to show what you can do
                        </div>
                        <h1 className="text-[clamp(2.85rem,7vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.065em] text-balance">
                            Your work deserves more than a résumé.
                        </h1>
                        <p className="mt-7 max-w-[38rem] text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
                            Build a living portfolio that connects your experience, skills, and projects into one professional story—ready to share whenever opportunity appears.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ActionLink href={paths.root.auth.register.path()} size="lg">
                                Build my portfolio <ArrowRight className="size-4" aria-hidden="true" />
                            </ActionLink>
                            <ActionLink href={paths.root.search.path()} intent="secondary" size="lg">
                                Browse real portfolios
                            </ActionLink>
                        </div>
                        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted" aria-label="Product benefits">
                            {['No design experience needed', 'Responsive by default', 'Easy to update'].map((benefit) => (
                                <li key={benefit} className="flex items-center gap-1.5">
                                    <Check className="size-3.5 text-accent" aria-hidden="true" /> {benefit}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section aria-label="Portfolio product preview">
                        <PortfolioPreview />
                    </section>
                </PageContainer>

                <section className="border-y border-line bg-canvas-subtle/60" aria-labelledby="how-it-works-title">
                    <PageContainer className="py-16 sm:py-20">
                        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">How it works</p>
                                <h2 id="how-it-works-title" className="mt-3 max-w-sm text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
                                    From scattered details to one confident story.
                                </h2>
                            </div>
                            <ol className="grid gap-3 sm:grid-cols-3">
                                {steps.map(({ icon: Icon, number, title, copy }) => (
                                    <li key={number} className="rounded-[1.4rem] border border-line bg-surface p-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                                                <Icon className="size-[1.1rem]" aria-hidden="true" />
                                            </span>
                                            <span className="text-xs font-bold tracking-[0.12em] text-ink-muted/70">{number}</span>
                                        </div>
                                        <h3 className="mt-8 text-base font-bold tracking-[-0.025em]">{title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-ink-muted">{copy}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </PageContainer>
                </section>
            </main>
        </div>
    );
}
