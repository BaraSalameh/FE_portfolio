"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { cn } from '@/lib/ui/cn';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { WidgetListProps } from '@/features/dashboard/types.presentation';
import { extractPathValue } from '@/lib/utils';
import { ControlledInfiniteScroll } from './ControlledInfiniteScroll';
import { WidgetEntryPresentation } from './WidgetEntryPresentation';

const hasDisplayValue = (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(hasDisplayValue);
    return true;
};

export const WidgetList = ({
    items,
    list,
    onItemClick,
    sort,
    pagination,
    className,
    entryPresentation,
}: WidgetListProps) => {

    const [sortedState, setSortedState] = useState<{ source: object[]; rows: object[] }>({ source: items, rows: items });
    const rows = sortedState.source === items ? sortedState.rows : items;
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const getItemId = (item: object) => {
        const id = extractPathValue(item, 'id')
            ?? extractPathValue(item, 'skill.id')
            ?? extractPathValue(item, 'language.id');
        return id ? String(id) : undefined;
    };
    const getIsRead = (item: object) => 'isRead' in item && Boolean(item.isRead);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = rows.findIndex((item) => getItemId(item) === String(active.id));
        const newIndex = rows.findIndex((item) => getItemId(item) === String(over.id));

        if (oldIndex < 0 || newIndex < 0) return;
        const previousItems = rows;
        const newItems = arrayMove(rows, oldIndex, newIndex);
        setSortedState({ source: items, rows: newItems });

        const orderedIds = newItems.map(getItemId).filter((id): id is string => Boolean(id));

        try {
            await sort?.onSort?.(orderedIds);
        } catch {
            setSortedState({ source: items, rows: previousItems });
        }
    };

    const renderList = () => rows.map((item, idx) => {
        const listItem = entryPresentation ? (
            <div className={cn(getIsRead(item) && 'opacity-55')}>
                <WidgetEntryPresentation item={item} presentation={entryPresentation} onClick={onItemClick} />
            </div>
        ) : (
            <div
                className={cn(
                    'space-y-2 rounded-xl border border-line/70 bg-canvas-subtle/55 px-3.5 py-3 text-sm text-ink-muted transition',
                    getIsRead(item) && 'opacity-55',
                    !sort?.sortable && onItemClick && 'cursor-pointer hover:border-accent/30 hover:bg-accent-soft/40',
                    className,
                )}
                onClick={() => onItemClick?.(item)}
                onKeyDown={(event) => {
                    if (onItemClick && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        onItemClick(item);
                    }
                }}
                role={onItemClick ? 'button' : undefined}
                tabIndex={onItemClick ? 0 : undefined}
                aria-label={onItemClick ? 'View item details' : undefined}
            >
                {list.map((cfg, index) => {
                    const leftRaw = cfg.leftKey ? extractPathValue(item, cfg.leftKey) : undefined;
                    const rightRaw = cfg.rightKey ? extractPathValue(item, cfg.rightKey) : undefined;
                    const iconUrl = cfg.itemIcon ? extractPathValue(item, cfg.itemIcon) : undefined;
                    const hasLeftValue = hasDisplayValue(leftRaw);
                    const hasRightValue = hasDisplayValue(rightRaw);

                    if (!hasLeftValue && !hasRightValue) return null;

                    const leftVal = cfg.isTime && leftRaw
                            ? dayjs(String(leftRaw)).format('MMM YYYY')
                            : cfg.isLink
                            ? leftRaw ? <a href={String(leftRaw)} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="break-all font-medium text-accent-strong underline decoration-accent/35 underline-offset-4 hover:decoration-accent" aria-label={`${cfg.label ?? 'Open link'} (opens in a new tab)`}>{String(leftRaw)}</a> : null
                            : leftRaw as React.ReactNode;
                            
                    const rightVal = cfg.isTime
                        ?   rightRaw ? dayjs(String(rightRaw)).format('MMM YYYY') : 'Present'
                        :   cfg.rightKey ? rightRaw as React.ReactNode : '';

                    const Icon = cfg.icon;
                    return (
                        <p key={index} className={cn('flex flex-wrap items-center gap-1.5 leading-6', cfg.size === 'lg' && 'text-[0.95rem] font-bold text-ink', cfg.size === 'sm' && 'text-xs leading-5')}>
                            {Icon && <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />}

                            {Array.isArray(leftVal)
                                ?   leftVal.length > 0
                                        ?   leftVal.map((val, idx) => (
                                                <React.Fragment key={idx}>
                                                    {Array.isArray(iconUrl) && iconUrl[idx] && <Image src={String(iconUrl[idx])} alt="" width={16} height={16} className="size-4 rounded-full" />}
                                                    {String(val)}
                                                    {idx !== leftVal.length - 1 && ' | '}
                                                </React.Fragment>
                                            ))
                                        :   null
                                :   typeof leftVal === 'boolean'
                                        ?   `${cfg.leftKey}: ${leftVal}`
                                        :   leftVal
                                            
                            }
                            {cfg.between && hasLeftValue && rightVal && ` ${cfg.between} `}

                            {rightVal}
                        </p>
                    );
                })}
            </div>
        );

        return sort?.sortable
            ?   (
                    <SortableItem key={getItemId(item)} id={getItemId(item) ?? String(idx)} label={`item ${idx + 1}`}>{listItem}</SortableItem>
                )
            :   (
                    <div role="listitem" key={getItemId(item) ?? idx}>{listItem}</div>
                );
    });

    const content = sort?.sortable ? (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={rows.map((item, index) => getItemId(item) ?? String(index))}
                strategy={verticalListSortingStrategy}
            >
                {renderList()}
            </SortableContext>
        </DndContext>
    ) : pagination ? (
        <ControlledInfiniteScroll
            items={items}
            {...pagination}
        >
            {renderList()}
        </ControlledInfiniteScroll>
    )
    : (
        <>{renderList()}</>
    );

    return <div role="list" className="w-full space-y-2">{content}</div>;
};
