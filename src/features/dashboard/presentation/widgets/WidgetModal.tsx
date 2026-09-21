"use client";

import { ActionDialog } from '@/design-system';
import type { WidgetModalProps } from '@/features/dashboard/types.presentation';
import { cn } from '@/lib/ui/cn';
import { X } from 'lucide-react';
import { cloneElement, isValidElement, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WidgetList } from './WidgetList';
import { WidgetEntryPresentation } from './WidgetEntryPresentation';

export const WidgetModal = ({ isLoading, isOpen, onClose, onAction, item, update, del, details, entryPresentation, className }: WidgetModalProps) => {
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
            const isTop = dialogs.item(dialogs.length - 1) === dialogRef.current;
            if (!isTop) return;
            if (event.key === 'Escape') onClose();
            if (event.key === 'Tab' && dialogRef.current) {
                const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
                const first = focusable.at(0);
                const last = focusable.at(-1);
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }
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
            <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onMouseDown={(event) => event.stopPropagation()} className={cn('max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-line bg-surface-raised p-5 text-ink shadow-2xl shadow-black/25', className)}>
                <header className="mb-5 flex items-center gap-3">
                    <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">Portfolio entry</p><h2 id={titleId} className="mt-0.5 text-lg font-bold tracking-[-0.03em] text-ink">{entryPresentation ? `${entryPresentation.singularLabel} details` : 'Entry details'}</h2></div>
                    <div className="ml-auto flex shrink-0 items-center gap-2 text-ink-muted">
                        {update && <ActionDialog isLoading={isLoading} as="update" title={update.title ?? 'Edit'} subTitle={update.subTitle}>
                            {isValidElement(update.form) ? cloneElement(update.form as React.ReactElement<{ onClose: () => void; id?: string }>, { onClose, id: itemId }) : update.form}
                        </ActionDialog>}
                        {del && <ActionDialog isLoading={isLoading} as="delete" title={del.title ?? 'Delete'} subTitle={del.subTitle} onAction={del.onDelete} onClose={onClose} idToDelete={itemId}>{del.message}</ActionDialog>}
                        <button type="button" onClick={onClose} className="responsive-action shrink-0 gap-2 rounded-xl text-sm font-semibold transition hover:bg-canvas-subtle hover:text-ink" aria-label="Close item details" title="Close item details"><X className="size-4 shrink-0" aria-hidden="true" /><span className="responsive-action__label">Close</span></button>
                    </div>
                </header>
                {entryPresentation && item ? <WidgetEntryPresentation item={item} presentation={entryPresentation} mode="details" /> : details ? <WidgetList items={[item ?? {}]} list={details} /> : null}
            </section>
        </div>,
        document.body,
    );
};
