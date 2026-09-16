import type { MatrixConfig } from '@/features/dashboard/types.presentation';

const columns = ['projects', 'experience', 'education', 'certificates'] as const;

export const EvidenceMatrix = ({ config }: { config: MatrixConfig }) => (
    <figure className="rounded-2xl border border-line bg-canvas-subtle/45 p-4">
        <figcaption><h3 className="text-sm font-bold text-ink">{config.title}</h3><p className="mt-1 text-xs leading-5 text-ink-muted">{config.description ?? 'Evidence connected to each skill across the portfolio.'}</p></figcaption>
        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead><tr className="border-b border-line"><th className="py-2 pr-4 text-left">Skill</th>{columns.map((column) => <th key={column} className="px-2 py-2 text-center capitalize">{column}</th>)}</tr></thead>
                <tbody>{config.rows.map((row) => <tr key={row.name} className="border-b border-line/60"><th className="py-2 pr-4 text-left font-medium">{row.name}</th>{columns.map((column) => { const value = row[column]; return <td key={column} className="px-2 py-2 text-center"><span className={value > 0 ? 'inline-flex min-w-8 justify-center rounded-full bg-accent-soft px-2 py-1 font-bold text-accent-strong' : 'text-ink-muted'} aria-label={value > 0 ? `${value} ${column}` : `No ${column} evidence`}>{value > 0 ? value : '-'}</span></td>; })}</tr>)}</tbody>
            </table>
        </div>
    </figure>
);
