"use client";
/* Item icons are runtime API values and cannot be enumerated in Next image config. */
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { widgetList } from '@/styles';
import { cn } from '@/components/utils';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { WidgetListProps } from './types.widgets';
import { extractPathValue } from '@/lib/utils';
import { ResponsiveIcon, Paragraph } from '../ui';
import { ControlledInfiniteScroll } from '../ui/ControlledInfiniteScroll';

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
            <li
                key={getItemId(item) ?? idx}
                className={`${cn(widgetList({
                    opacity: getIsRead(item),
                    clickable: sort?.sortable ? false : onItemClick ? true : false
                }), className)}`}
                onClick={() => onItemClick?.(item)}
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

                    return (
                        <Paragraph key={index}>
                            {cfg.icon && <ResponsiveIcon icon={cfg.icon} />}

                            {Array.isArray(leftVal)
                                ?   leftVal.length > 0
                                        ?   leftVal.map((val, idx) => (
                                                <React.Fragment key={idx}>
                                                    {Array.isArray(iconUrl) && iconUrl[idx] && <img src={String(iconUrl[idx])} alt="" className="h-4 w-4 rounded-full" />}
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
                        </Paragraph>
                    );
                })}
            </li>
        );

        return sort?.sortable
            ?   (
                    <SortableItem key={getItemId(item)} id={getItemId(item) ?? String(idx)}>{listItem}</SortableItem>
                )
            :   (
                    <div key={idx}>{listItem}</div>
                );
    });

    return sort?.sortable ? (
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
        <React.Fragment>{renderList()}</React.Fragment>
    );
};
