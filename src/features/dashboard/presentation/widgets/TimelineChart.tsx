import dayjs from 'dayjs';
import { useState } from 'react';
import type { TimelineConfig } from '@/features/dashboard/types.presentation';

const DAY_IN_MS = 86_400_000;
const percent = (value: number) => `${value.toFixed(4)}%`;

export const TimelineChart = ({ config }: { config: TimelineConfig }) => {
    // Day precision keeps ongoing ranges stable across server rendering and hydration.
    const [today] = useState(() => Math.floor(Date.now() / DAY_IN_MS) * DAY_IN_MS);
    const valid = config.data.filter((item) => dayjs(item.start).isValid());
    if (!valid.length) return null;
    const starts = valid.map((item) => dayjs(item.start).valueOf());
    const ends = valid.map((item) => dayjs(item.end).isValid() ? dayjs(item.end).valueOf() : today);
    const min = Math.min(...starts);
    const max = Math.max(...ends, min + 1);
    const span = max - min || 1;

    return (
        <figure className="rounded-2xl border border-line bg-canvas-subtle/45 p-4">
            <figcaption><h3 className="text-sm font-bold text-ink">{config.title}</h3><p className="mt-1 text-xs leading-5 text-ink-muted">{config.description ?? 'Chronological range from start to end; ongoing entries extend through today.'}</p></figcaption>
            <ol className="mt-5 space-y-4">
                {valid.sort((a, b) => dayjs(b.start).valueOf() - dayjs(a.start).valueOf()).map((item) => {
                    const start = dayjs(item.start).valueOf();
                    const end = dayjs(item.end).isValid() ? dayjs(item.end).valueOf() : today;
                    const left = ((start - min) / span) * 100;
                    const width = Math.max(2, ((end - start) / span) * 100);
                    return <li key={item.id} className="grid gap-2 sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:items-center"><div><p className="truncate text-sm font-semibold text-ink">{item.name}</p>{item.detail && <p className="truncate text-xs text-ink-muted">{item.detail}</p>}</div><div><div className="relative h-3 rounded-full bg-line/60"><span className="absolute h-3 rounded-full bg-accent" style={{ left: percent(left), width: percent(Math.min(width, 100 - left)) }} /></div><p className="mt-1 text-[0.7rem] text-ink-muted">{dayjs(item.start).format('MMM YYYY')} – {item.ongoing || !item.end ? 'Present' : dayjs(item.end).format('MMM YYYY')}</p></div></li>;
                })}
            </ol>
        </figure>
    );
};
