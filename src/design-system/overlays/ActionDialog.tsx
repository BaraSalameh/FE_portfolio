'use client';

import { cn } from '@/lib/ui/cn';
import type { LucideIcon } from 'lucide-react';
import { Edit3, Plus, Trash2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cloneElement, isValidElement, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import type { FieldError } from 'react-hook-form';

type DialogMode = 'create' | 'update' | 'delete' | 'none';

export type ActionDialogProps = {
    isLoading?: boolean;
    idToDelete?: string;
    onAction?: (id: string) => void | Promise<void>;
    onClose?: () => void;
    error?: FieldError;
    as?: DialogMode;
    title?: string;
    subTitle?: string;
    children?: ReactNode;
    icon?: LucideIcon;
    className?: string;
    triggerClassName?: string;
};

export function ActionDialog({ isLoading, idToDelete, onAction, onClose, as = 'create', title, subTitle = title, error, children, icon: Icon, className, triggerClassName }: ActionDialogProps) {
    const [open, setOpen] = useState(false);
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const dialogTitle = subTitle ?? title ?? `${as} item`;
    const TriggerIcon = Icon ?? (as === 'update' ? Edit3 : as === 'delete' ? Trash2 : Plus);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const handleKeyDown = (event: KeyboardEvent) => {
            const dialogs = document.querySelectorAll('[role="dialog"]');
            const isTop = dialogs.item(dialogs.length - 1) === dialogRef.current;
            if (!isTop) return;
            if (event.key === 'Escape') setOpen(false);
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
        return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKeyDown); trigger?.focus(); };
    }, [open]);

    const child = isValidElement<{ onClose?: () => void }>(children)
        ? cloneElement(children, { onClose: children.props.onClose ?? (() => setOpen(false)) })
        : children;

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={cn('inline-flex min-h-10 items-center gap-2 rounded-xl px-2.5 text-left text-sm font-semibold transition hover:bg-canvas-subtle hover:text-ink', triggerClassName)} aria-haspopup="dialog" aria-label={title ?? dialogTitle}>
                <TriggerIcon className="size-4 shrink-0" aria-hidden="true" />
                {title ? <span>{title}</span> : null}
            </button>
            {error && <p role="alert" className="mt-1 text-xs text-danger">{error.message}</p>}
            {open && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
                    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()} className={cn('max-h-[min(90svh,52rem)] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border border-line bg-surface text-ink shadow-2xl shadow-black/25', className)}>
                        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur-xl">
                            <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">Portfolio editor</p><h2 id={titleId} className="mt-0.5 text-lg font-bold tracking-[-0.03em]">{dialogTitle}</h2></div>
                            <button type="button" onClick={() => setOpen(false)} autoFocus className="grid size-10 place-items-center rounded-xl text-ink-muted transition hover:bg-canvas-subtle hover:text-ink" aria-label="Close dialog"><X className="size-4" aria-hidden="true" /></button>
                        </header>
                        <div className="p-5 sm:p-6">
                            {as !== 'delete' ? child : (
                                <div className="space-y-5">
                                    <div className="rounded-xl border border-danger/20 bg-danger/8 p-4 text-sm leading-6 text-ink-muted">{children}</div>
                                    <button type="button" disabled={isLoading} onClick={async () => { if (!onAction || !idToDelete) return; await onAction(idToDelete); onClose?.(); setOpen(false); }} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"><Trash2 className="size-4" aria-hidden="true" /> {isLoading ? 'Deleting…' : 'Delete'}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>, document.body)}
        </>
    );
}
