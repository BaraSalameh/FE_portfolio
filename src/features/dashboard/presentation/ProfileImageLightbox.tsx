'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, useState } from 'react';

type ProfileImageLightboxProps = {
    src: string;
    alt: string;
};

export function ProfileImageLightbox({ src, alt }: ProfileImageLightboxProps) {
    const [open, setOpen] = useState(false);
    const titleId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const trigger = triggerRef.current;
        const handleDialogKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
            if (event.key === 'Tab') {
                event.preventDefault();
                closeRef.current?.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleDialogKeyDown);
        closeRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleDialogKeyDown);
            trigger?.focus();
        };
    }, [open]);

    return <>
        <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="relative size-28 overflow-hidden rounded-[1.6rem] border-4 border-surface bg-canvas-subtle shadow-xl transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:size-32"
            aria-haspopup="dialog"
            aria-label="Enlarge profile picture"
        >
            <Image src={src} alt={alt} fill className="object-cover" priority sizes="128px" />
        </button>

        {open && typeof document !== 'undefined' ? createPortal(
            <div className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
                <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative" onMouseDown={(event) => event.stopPropagation()}>
                    <h2 id={titleId} className="sr-only">Profile picture preview</h2>
                    <div className="relative size-[min(88vw,80svh)] overflow-hidden rounded-[1.75rem] bg-black/20 shadow-2xl">
                        <Image src={src} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 88vw, 80vh" />
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label="Close profile picture preview"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>
            </div>,
            document.body,
        ) : null}
    </>;
}
