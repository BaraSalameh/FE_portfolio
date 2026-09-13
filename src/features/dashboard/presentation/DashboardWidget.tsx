'use client';

import { ActionDialog } from '@/design-system';
import { WidgetList } from './widgets/WidgetList';
import { WidgetModal } from './widgets/WidgetModal';
import type { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { cn } from '@/lib/ui/cn';
import { Check, ListOrdered, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';

const WidgetCharts = dynamic(
    () => import('./widgets/WidgetCharts').then(module => module.WidgetCharts),
    { loading: () => <div className="h-64 animate-pulse rounded-2xl bg-canvas-subtle" role="status"><span className="sr-only">Loading charts</span></div> },
);

export const DashboardWidget = memo(function DashboardWidget(props: WidgetCardProps) {
    const { role } = useParams<{ role: 'owner' | 'client' }>();
    const isOwner = role === 'owner';
    const create = isOwner ? props.create : undefined;
    const update = isOwner ? props.update : undefined;
    const del = isOwner ? props.del : undefined;
    const onSort = isOwner ? props.onSort : undefined;
    const { isLoading, error, header, items, emptyState, list, pie, bar, radar, details, pagination, onModalAction, className } = props;
    const HeaderIcon = header?.icon;
    const [sortable, setSortable] = useState(false);
    const [selectedItem, setSelectedItem] = useState<object>();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const isEmpty = !Array.isArray(items) || items.length === 0;
    const canReorder = Boolean(onSort && Array.isArray(items) && items.length >= 2);
    const isReordering = canReorder && sortable;
    const hasPresentation = Boolean(list || pie || bar || radar);

    if (!header || !hasPresentation || (isEmpty && !create)) return null;

    const openDetails = update || del || details
        ? (item: object) => {
            setSelectedItem(item);
            setDetailsOpen(true);
        }
        : undefined;

    return (
        <>
            <section role="region" aria-labelledby={`${header.title?.toLowerCase().replaceAll(' ', '-')}-widget-title`} aria-busy={isLoading} className={cn('relative mb-4 break-inside-avoid overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-sm', className)}>
                {isLoading && <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden bg-accent-soft" role="status"><span className="block h-full w-1/3 animate-pulse rounded-full bg-accent" /><span className="sr-only">Loading {header.title}</span></div>}
                <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        {header?.icon && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><header.icon className="size-[1.05rem]" aria-hidden="true" /></span>}
                        <div className="min-w-0"><h2 id={`${header.title?.toLowerCase().replaceAll(' ', '-')}-widget-title`} className="truncate text-[0.95rem] font-bold tracking-[-0.025em]">{header.title}</h2>{header.description && <p className="mt-0.5 hidden truncate text-xs text-ink-muted sm:block">{header.description}</p>}</div>
                    </div>
                    {(create || canReorder) && (
                        <div className="flex shrink-0 items-center gap-2 text-ink-muted">
                            {canReorder && (
                                <button
                                    type="button"
                                    onClick={() => setSortable((value) => !value)}
                                    className="responsive-action shrink-0 gap-2 rounded-xl text-sm font-semibold transition hover:bg-canvas-subtle hover:text-ink"
                                    aria-label={isReordering ? 'Finish reordering' : 'Reorder items'}
                                    aria-pressed={isReordering}
                                >
                                    {isReordering ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <ListOrdered className="size-4 shrink-0" aria-hidden="true" />}
                                </button>
                            )}
                            {create && (
                                <ActionDialog isLoading={isLoading} title={create.title ?? 'Add'} subTitle={create.subTitle} icon={create.icon ?? Plus} iconOnly>
                                    {create.form}
                                </ActionDialog>
                            )}
                        </div>
                    )}
                </header>
                {error && <div role="alert" className="mx-3 mt-3 rounded-xl border border-danger/20 bg-danger/8 px-3.5 py-3 text-sm text-danger">{error}</div>}
                {isEmpty && (
                    <div className="px-5 py-9 text-center">
                        {HeaderIcon && <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent-strong"><HeaderIcon className="size-5" aria-hidden="true" /></span>}
                        <h3 className="mt-3 text-sm font-bold text-ink">{emptyState?.title ?? `No ${header.title?.toLowerCase()} yet`}</h3>
                        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-ink-muted">{emptyState?.description ?? `Add your first entry to start building this section.`}</p>
                    </div>
                )}
                {!isEmpty && (pie || bar || radar) && (
                    <div className="px-3 py-5 sm:px-5">
                        <WidgetCharts items={items} pie={pie} bar={bar} radar={radar} />
                    </div>
                )}
                {!isEmpty && list && (
                    <div className="p-3">
                        <WidgetList
                            items={items}
                            list={list}
                            onItemClick={isReordering ? undefined : openDetails}
                            sort={{ sortable: isReordering, onSort }}
                            pagination={pagination}
                            className="rounded-xl border border-transparent bg-canvas-subtle/65 px-3.5 py-3 text-sm transition hover:border-accent/20 hover:bg-accent-soft/45"
                        />
                    </div>
                )}
            </section>
            <WidgetModal
                key={selectedItem && 'id' in selectedItem ? String(selectedItem.id) : 'portfolio-widget-modal'}
                isLoading={isLoading}
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                item={selectedItem}
                update={update}
                del={del}
                details={details}
                onAction={onModalAction}
            />
        </>
    );
});
