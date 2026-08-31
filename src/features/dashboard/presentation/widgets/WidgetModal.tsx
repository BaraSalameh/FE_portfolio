"use client";

import { ActionDialog } from '@/design-system';
import type { WidgetModalProps } from '@/features/dashboard/types.presentation';
import { cn } from '@/lib/ui/cn';
import { X } from 'lucide-react';
import { cloneElement, isValidElement, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WidgetList } from './WidgetList';

export const WidgetModal = ({ isLoading, isOpen, onClose, onAction, item, update, del, details, className }: WidgetModalProps) => {
    const itemId = item && 'id' in item ? String(item.id) : undefined;
    const titleId = useId();
    const dialogRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (isOpen && itemId) void onAction?.(itemId);
    }, [isOpen, itemId, onAction]);

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const handleKeyDown = (event: KeyboardEvent) => {
            const dialogs = document.querySelectorAll('[role="dialog"]');
            if (event.key === 'Escape' && dialogs.item(dialogs.length - 1) === dialogRef.current) onClose();
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        dialogRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            trigger?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={onClose}>
            <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onMouseDown={(event) => event.stopPropagation()} className={cn('max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-line bg-surface-elevated p-5 shadow-2xl', className)}>
                <header className="mb-5 flex items-center gap-3">
                    <h2 id={titleId} className="text-lg font-semibold text-ink">Item details</h2>
                    <div className="ml-auto flex items-center gap-2">
                        {update && <ActionDialog isLoading={isLoading} as="update" title={update.title} subTitle={update.subTitle}>
                            {isValidElement(update.form) ? cloneElement(update.form as React.ReactElement<{ onClose: () => void; id?: string }>, { onClose, id: itemId }) : update.form}
                        </ActionDialog>}
                        {del && <ActionDialog isLoading={isLoading} as="delete" title={del.title} subTitle={del.subTitle} onAction={del.onDelete} onClose={onClose} idToDelete={itemId}>{del.message}</ActionDialog>}
                        <button type="button" onClick={onClose} className="rounded-full p-2 text-ink-muted transition hover:bg-canvas-subtle hover:text-ink" aria-label="Close item details"><X className="size-5" aria-hidden="true" /></button>
                    </div>
                </header>
                {details && <WidgetList items={[item ?? {}]} list={details} />}
            </section>
        </div>,
        document.body,
    );
};
