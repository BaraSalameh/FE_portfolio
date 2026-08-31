"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemProps } from '@/features/dashboard/types.presentation';

export const SortableItem = ({ id, children }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} role="listitem">
            <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                style={{ cursor: 'grab' }}
            >
                {children}
            </div>
        </div>
    );
};
