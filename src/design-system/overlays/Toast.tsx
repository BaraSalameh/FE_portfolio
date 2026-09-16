'use client';

import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type ToastProps = {
    message: string;
    variant?: 'success' | 'error';
    onDismiss: () => void;
    duration?: number;
};

export function Toast({ message, variant = 'success', onDismiss, duration }: ToastProps) {
    const [visible, setVisible] = useState(true);
    const onDismissRef = useRef(onDismiss);
    const isError = variant === 'error';
    const dismissAfter = duration ?? (isError ? 5000 : 3000);
    const Icon = isError ? CircleAlert : CircleCheck;

    useEffect(() => {
        onDismissRef.current = onDismiss;
    }, [onDismiss]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setVisible(false);
            onDismissRef.current();
        }, dismissAfter);
        return () => window.clearTimeout(timeout);
    }, [dismissAfter]);

    const dismiss = () => {
        setVisible(false);
        onDismissRef.current();
    };

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex justify-center sm:bottom-6">
            <div
                role={isError ? 'alert' : 'status'}
                aria-live={isError ? 'assertive' : 'polite'}
                aria-atomic="true"
                className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-surface-raised px-4 py-3 text-sm font-semibold text-ink shadow-2xl shadow-black/20 motion-safe:animate-[toast-in_180ms_ease-out] ${isError ? 'border-danger/30' : 'border-success/30'}`}
            >
                <Icon className={`size-5 shrink-0 ${isError ? 'text-danger' : 'text-success'}`} aria-hidden="true" />
                <span className="min-w-0 flex-1">{message}</span>
                <button
                    type="button"
                    onClick={dismiss}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-canvas-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    aria-label="Dismiss notification"
                >
                    <X className="size-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
