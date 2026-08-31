"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { cn } from '@/lib/ui/cn';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { WidgetListProps } from '@/features/dashboard/types.presentation';
import { extractPathValue } from '@/lib/utils';
import { ControlledInfiniteScroll } from './ControlledInfiniteScroll';

export const WidgetList = ({
    items,
    list,
    onItemClick,
    sort,
    pagination,
    className
}: WidgetListProps) => {

    const [sortedState, setSortedState] = useState<{ source: object[]; rows: object[] }>({ source: items, rows: items });
    const rows = sortedState.source === items ? sortedState.rows : items;
    const sensors = useSensors(useSensor(PointerSensor));

    const getItemId = (item: object) => 'id' in item ? String(item.id) : undefined;
    const getIsRead = (item: object) => 'isRead' in item && Boolean(item.isRead);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = rows.findIndex((item) => getItemId(item) === String(active.id));
        const newIndex = rows.findIndex((item) => getItemId(item) === String(over.id));

        const newItems = arrayMove(rows, oldIndex, newIndex);
        setSortedState({ source: items, rows: newItems });

        const orderedIds = newItems.map(getItemId).filter((id): id is string => Boolean(id));

        sort?.onSort?.(orderedIds);
    };

    const renderList = () => rows.map((item, idx) => {
        const listItem = (
            <div
                key={getItemId(item) ?? idx}
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

                    const leftVal = cfg.isTime
                            ? dayjs(String(leftRaw)).format('MMM YYYY')
                            : cfg.isLink
                            ? <a href={String(leftRaw)} target='_blank' rel="noreferrer">{String(leftRaw)}</a>
                            : leftRaw as React.ReactNode;
                            
                    const rightVal = cfg.isTime
                        ?   rightRaw ? dayjs(String(rightRaw)).format('MMM YYYY') : 'Present'
                        :   cfg.rightKey ? rightRaw as React.ReactNode : '';

                    const Icon = cfg.icon;
                    return (
                        <p key={index} className="flex flex-wrap items-center gap-1.5 leading-6">
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
                                        :   'Empty'  
                                :   typeof leftVal === 'boolean'
                                        ?   `${cfg.leftKey}: ${leftVal}`
                                        :   cfg.icon && !leftRaw ? 'Empty' : leftVal
                                            
                            }
                            {cfg.between && rightVal && ` ${cfg.between} `}

                            {rightVal}
                        </p>
                    );
                })}
            </div>
        );

        return sort?.sortable
            ?   (
                    <SortableItem key={getItemId(item)} id={getItemId(item) ?? String(idx)}>{listItem}</SortableItem>
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
