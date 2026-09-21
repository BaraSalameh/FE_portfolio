'use client';

import type { EntryPresentation, ListItemConfig } from '@/features/dashboard/types.presentation';
import { extractPathValue } from '@/lib/utils';
import { cn } from '@/lib/ui/cn';
import dayjs from 'dayjs';
import {
    ArrowUpRight,
    Award,
    BadgeCheck,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Code2,
    ExternalLink,
    FolderKanban,
    Languages,
    MapPin,
    Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { proficiencyToPercent } from './entryPresentation';

type PresentationProps = {
    item: object;
    presentation: EntryPresentation;
    mode?: 'card' | 'details';
    list?: ListItemConfig[];
    onClick?: (item: object) => void;
};

const value = (item: object, path: string | string[]) => extractPathValue(item, path);
const text = (item: object, path: string | string[], fallback = '') => {
    const raw = value(item, path);
    return typeof raw === 'string' || typeof raw === 'number' ? String(raw) : fallback;
};
const strings = (item: object, path: string) => {
    const raw = value(item, path);
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
    return raw ? [String(raw)] : [];
};
const formatMonth = (date?: string) => date ? dayjs(date).format('MMM YYYY') : '';
const dateRange = (start?: string, end?: string, ongoing = false) => [formatMonth(start), ongoing || !end ? 'Present' : formatMonth(end)].filter(Boolean).join(' – ');
const supportedImage = (source: string) => {
    if (source.startsWith('/')) return true;
    try { return new URL(source).hostname === 'res.cloudinary.com'; }
    catch { return false; }
};

function MediaImage({ source, alt, fallback }: { source?: string; alt: string; fallback: ReactNode }) {
    const [failed, setFailed] = useState(false);
    if (!source || !supportedImage(source) || failed) return fallback;
    return <Image src={source} alt={alt} fill sizes="(max-width: 639px) 100vw, 30vw" className="object-cover" onError={() => setFailed(true)} />;
}

const interactiveClass = 'cursor-pointer hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface';
const baseCardClass = 'group relative overflow-hidden rounded-2xl border border-line bg-surface-raised text-left text-ink shadow-sm transition duration-200';

function SkillChips({ names, limit = 3 }: { names: string[]; limit?: number }) {
    if (names.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5" aria-label="Skills">
            {names.slice(0, limit).map((name) => <span key={name} className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.68rem] font-bold text-accent-strong">{name}</span>)}
            {names.length > limit ? <span className="rounded-full bg-canvas-subtle px-2.5 py-1 text-[0.68rem] font-bold text-ink-muted">+{names.length - limit}</span> : null}
        </div>
    );
}

function ProjectCard({ item }: { item: object }) {
    const title = text(item, 'title', 'Untitled project');
    const association = text(item, ['experience.companyName', 'education.institution.name']);
    const skills = strings(item, 'lstSkills.name');
    const featured = Boolean(value(item, 'isFeatured'));
    const imageUrl = text(item, 'imageUrl');
    const fallback = <div data-testid="project-image-fallback" className="grid size-full place-items-center bg-gradient-to-br from-accent-soft via-canvas-subtle to-surface-raised text-accent-strong"><FolderKanban className="size-9" aria-hidden="true" /></div>;
    return (
        <>
            <div className="relative aspect-[16/7] overflow-hidden border-b border-line bg-canvas-subtle">
                <MediaImage source={imageUrl} alt={`${title} preview`} fallback={fallback} />
                {featured ? <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface-raised/95 px-2.5 py-1 text-[0.68rem] font-bold text-accent-strong shadow-sm"><Sparkles className="size-3" aria-hidden="true" />Featured</span> : null}
            </div>
            <div className="space-y-3 p-4">
                <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><h3 className="font-bold tracking-[-0.02em]">{title}</h3>{association ? <p className="mt-1 truncate text-xs text-ink-muted">Connected to {association}</p> : null}</div><ArrowUpRight className="mt-0.5 size-4 shrink-0 text-ink-muted transition group-hover:text-accent-strong" aria-hidden="true" /></div>
                <SkillChips names={skills} />
            </div>
        </>
    );
}

function ExperienceCard({ item }: { item: object }) {
    const ongoing = !text(item, 'endDate');
    return (
        <div className="grid grid-cols-[auto_1fr] gap-3 p-4">
            <div className="flex flex-col items-center"><span className="grid size-9 place-items-center rounded-full bg-accent text-white shadow-sm"><BriefcaseBusiness className="size-4" aria-hidden="true" /></span><span className="mt-2 min-h-10 w-px flex-1 bg-gradient-to-b from-accent/55 to-transparent" /></div>
            <div className="min-w-0 pb-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold tracking-[-0.02em]">{text(item, 'jobTitle', 'Role')}</h3><p className="mt-0.5 text-sm font-semibold text-accent-strong">{text(item, 'companyName')}</p></div>{ongoing ? <span className="rounded-full bg-success/12 px-2 py-1 text-[0.68rem] font-bold text-success">Current</span> : null}</div><div className="mt-3 space-y-1.5 text-xs text-ink-muted"><p className="flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{dateRange(text(item, 'startDate'), text(item, 'endDate'), ongoing)}</p>{text(item, 'location') ? <p className="flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden="true" />{text(item, 'location')}</p> : null}</div></div>
        </div>
    );
}

function EducationCard({ item }: { item: object }) {
    const institution = text(item, 'institution.name', 'Institution');
    const logo = text(item, 'institution.logo');
    const studying = Boolean(value(item, 'isStudying'));
    const fallback = <span data-testid="institution-image-fallback" className="grid size-full place-items-center bg-accent-soft font-black text-accent-strong">{institution.charAt(0).toUpperCase()}</span>;
    return (
        <div className="p-4">
            <div className="flex items-start gap-3"><div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas-subtle"><MediaImage source={logo} alt={`${institution} logo`} fallback={fallback} /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.11em] text-accent-strong">{text(item, 'degree.abbreviation') || 'Education'}</p><h3 className="mt-1 font-bold leading-snug tracking-[-0.02em]">{text(item, 'degree.name', 'Qualification')}</h3><p className="mt-1 text-sm text-ink-muted">{institution}</p></div></div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3 text-xs text-ink-muted"><span className="inline-flex items-center gap-1.5"><BookOpen className="size-3.5" aria-hidden="true" />{text(item, 'fieldOfStudy.name', 'Field of study')}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{dateRange(text(item, 'startDate'), text(item, 'endDate'), studying)}</span></div>
        </div>
    );
}

function CertificateCard({ item }: { item: object }) {
    const expiration = text(item, 'expirationDate');
    const expired = expiration ? dayjs(expiration).isBefore(dayjs(), 'day') : false;
    return (
        <div className="relative p-4 pl-5"><span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-highlight via-accent to-accent-strong" /><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-highlight/18 text-accent-strong"><Award className="size-5" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-muted">Credential</p><h3 className="mt-1 font-bold leading-snug tracking-[-0.02em]">{text(item, 'certificate.name', 'Certificate')}</h3>{text(item, 'credintialID') ? <p className="mt-1 truncate font-mono text-xs text-ink-muted">ID {text(item, 'credintialID')}</p> : null}</div><BadgeCheck className="size-5 shrink-0 text-accent" aria-hidden="true" /></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-ink-muted"><span>{formatMonth(text(item, 'issueDate')) || 'Issue date unavailable'}</span><span className={cn('font-bold', expired ? 'text-danger' : 'text-success')}>{expired ? 'Expired' : expiration ? `Valid to ${formatMonth(expiration)}` : 'No expiration'}</span></div></div>
    );
}

function SkillCard({ item }: { item: object }) {
    const sources = [
        ['Projects', strings(item, 'lstProjects.id').length],
        ['Experience', strings(item, 'lstExperiences.id').length],
        ['Education', strings(item, 'lstEducations.id').length],
        ['Certificates', strings(item, 'lstCertificates.id').length],
    ] as const;
    const evidence = sources.reduce((sum, [, count]) => sum + count, 0);
    const icon = text(item, 'skill.iconUrl');
    const name = text(item, 'skill.name', 'Skill');
    const fallback = <Code2 className="size-5" aria-hidden="true" />;
    return <div className="flex items-center gap-3 p-3.5"><div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent-soft text-accent-strong">{icon && supportedImage(icon) ? <MediaImage source={icon} alt="" fallback={fallback} /> : fallback}</div><div className="min-w-0 flex-1"><h3 className="font-bold tracking-[-0.02em]">{name}</h3><p className="mt-1 text-xs text-ink-muted">{evidence > 0 ? `${evidence} connected evidence ${evidence === 1 ? 'item' : 'items'}` : 'Ready to connect to your work'}</p></div><span className="grid min-w-8 place-items-center rounded-full bg-canvas-subtle px-2 py-1 text-xs font-black text-accent-strong" aria-label={`${evidence} evidence items`}>{evidence}</span></div>;
}

function LanguageCard({ item }: { item: object }) {
    const level = text(item, 'languageProficiency.level', 'Unspecified');
    const percent = proficiencyToPercent(level);
    return <div className="p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong"><Languages className="size-5" aria-hidden="true" /></span><div className="min-w-0 flex-1"><h3 className="font-bold tracking-[-0.02em]">{text(item, 'language.name', 'Language')}</h3><p className="text-xs text-ink-muted">{level}</p></div><span className="text-sm font-black text-accent-strong">{percent}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas-subtle" role="progressbar" aria-label={`${text(item, 'language.name', 'Language')} proficiency`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-strong" style={{ width: `${percent}%` }} /></div></div>;
}

const cardByVariant = (item: object, variant: EntryPresentation['variant']) => {
    if (variant === 'project') return <ProjectCard item={item} />;
    if (variant === 'experience') return <ExperienceCard item={item} />;
    if (variant === 'education') return <EducationCard item={item} />;
    if (variant === 'certificate') return <CertificateCard item={item} />;
    if (variant === 'skill') return <SkillCard item={item} />;
    return <LanguageCard item={item} />;
};

const primaryTitle = (item: object, variant: EntryPresentation['variant']) => {
    const paths: Record<EntryPresentation['variant'], string> = { project: 'title', experience: 'jobTitle', education: 'degree.name', certificate: 'certificate.name', skill: 'skill.name', language: 'language.name' };
    return text(item, paths[variant], 'entry');
};

function DetailLink({ href, children }: { href: string; children: ReactNode }) {
    if (!href) return null;
    return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm font-bold text-accent-strong transition hover:border-accent/35 hover:bg-accent-soft"><ExternalLink className="size-4" aria-hidden="true" />{children}</a>;
}

function EntryDetails({ item, presentation }: Omit<PresentationProps, 'mode' | 'list' | 'onClick'>) {
    const description = text(item, 'description');
    const skills = strings(item, 'lstSkills.name');
    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">{cardByVariant(item, presentation.variant)}</div>
            {description ? <section className="rounded-2xl border border-line bg-surface p-4"><h3 className="text-xs font-bold uppercase tracking-[0.12em] text-accent-strong">About</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-muted">{description}</p></section> : null}
            {skills.length > 0 ? <section className="rounded-2xl border border-line bg-surface p-4"><h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-accent-strong">Skills and tools</h3><SkillChips names={skills} limit={skills.length} /></section> : null}
            {presentation.variant === 'project' ? <div className="flex flex-wrap gap-2"><DetailLink href={text(item, 'liveLink')}>View live project</DetailLink><DetailLink href={text(item, 'sourceCode')}>View source code</DetailLink></div> : null}
            {presentation.variant === 'certificate' ? <div className="flex flex-wrap gap-2"><DetailLink href={text(item, 'credintialUrl')}>View credential</DetailLink></div> : null}
        </div>
    );
}

export function WidgetEntryPresentation({ item, presentation, mode = 'card', onClick }: PresentationProps) {
    if (mode === 'details') return <EntryDetails item={item} presentation={presentation} />;
    const label = `View ${presentation.singularLabel.toLowerCase()} details: ${primaryTitle(item, presentation.variant)}`;
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        onClick(item);
    };
    return (
        <div className={cn(baseCardClass, onClick && interactiveClass)} onClick={() => onClick?.(item)} onKeyDown={handleKeyDown} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} aria-label={onClick ? label : undefined}>
            {cardByVariant(item, presentation.variant)}
        </div>
    );
}
