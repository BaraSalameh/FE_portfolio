'use client';

import { ActionDialog } from '@/design-system';
import { WidgetCharts } from './widgets/WidgetCharts';
import { WidgetList } from './widgets/WidgetList';
import { WidgetModal } from './widgets/WidgetModal';
import type { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { cn } from '@/lib/ui/cn';
import { ArrowUpDown, GripVertical } from 'lucide-react';
import { useParams } from 'next/navigation';
import { memo, useState } from 'react';

export const DashboardWidget = memo(function DashboardWidget(props: WidgetCardProps) {
    const { role } = useParams<{ role: 'owner' | 'client' }>();
    const isOwner = role === 'owner';
    const create = isOwner ? props.create : undefined;
    const update = isOwner ? props.update : undefined;
    const del = isOwner ? props.del : undefined;
    const onSort = isOwner ? props.onSort : undefined;
    const { isLoading, header, items, list, pie, bar, radar, details, pagination, onModalAction, className } = props;
    const [sortable, setSortable] = useState(false);
    const [selectedItem, setSelectedItem] = useState<object>();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const isEmpty = !Array.isArray(items) || items.length === 0 || (!header && !list && !pie && !bar && !radar);

    if (isEmpty && !create) return null;

    const openDetails = update || del || details
        ? (item: object) => {
            setSelectedItem(item);
            setDetailsOpen(true);
        }
        : undefined;

    return (
        <>
            <section className={cn('relative mb-4 break-inside-avoid overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-sm', className)}>
                {isLoading && <div className="absolute inset-0 z-20 animate-pulse bg-surface/75 backdrop-blur-sm" aria-label="Loading widget" role="status" />}
                <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        {header?.icon && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><header.icon className="size-[1.05rem]" aria-hidden="true" /></span>}
                        <h2 className="truncate text-[0.95rem] font-bold tracking-[-0.025em]">{header?.title}</h2>
                    </div>
                    {(create || onSort) && (
                        <div className="flex items-center gap-1 text-ink-muted">
                            {onSort && (
                                <button
                                    type="button"
                                    onClick={() => setSortable((value) => !value)}
                                    className="grid size-10 place-items-center rounded-xl transition hover:bg-canvas-subtle hover:text-ink"
                                    aria-label={sortable ? 'Finish reordering' : 'Reorder items'}
                                    aria-pressed={sortable}
                                >
                                    {sortable ? <ArrowUpDown className="size-4" aria-hidden="true" /> : <GripVertical className="size-4" aria-hidden="true" />}
                                </button>
                            )}
                            {create && (
                                <ActionDialog isLoading={isLoading} title={create.title} subTitle={create.subTitle} icon={create.icon}>
                                    {create.form}
                                </ActionDialog>
                            )}
                        </div>
                    )}
                </header>
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
                            onItemClick={sortable ? undefined : openDetails}
                            sort={{ sortable, onSort }}
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
