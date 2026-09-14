"use client";

import React from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemProps } from '@/features/dashboard/types.presentation';

export const SortableItem = ({ id, children, label = 'item' }: SortableItemProps) => {
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
        <div ref={setNodeRef} style={style} role="listitem" className="relative pl-10">
            <button
                type="button"
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="absolute left-0 top-1/2 grid size-9 -translate-y-1/2 touch-none place-items-center rounded-lg text-ink-muted transition hover:bg-accent-soft hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Move ${label}`}
            >
                <GripVertical className="size-4" aria-hidden="true" />
            </button>
            {children}
        </div>
    );
};
