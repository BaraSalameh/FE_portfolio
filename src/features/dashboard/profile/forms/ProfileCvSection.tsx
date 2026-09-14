'use client';

import { FileText, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { getApiErrorPayload } from '@/lib/api/errors';
import { removeCv, uploadCv } from '../api';
import { profileCvUpdated } from '../slice';

export function ProfileCvSection() {
    const cvUrl = useAppSelector((state) => state.profile.user?.cvUrl);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const [pendingAction, setPendingAction] = useState<'upload' | 'remove' | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isBusy = pendingAction !== null;

    const handleFile = async (file?: File) => {
        if (!file || isBusy) return;
        setError(null);
        if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Choose a PDF file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('The CV must be 5 MB or smaller.');
            return;
        }
        setPendingAction('upload');
        try {
            const url = await uploadCv(file);
            dispatch(profileCvUpdated(url));
            setMessage('CV uploaded.');
        } catch (uploadError) {
            setError(getApiErrorPayload(uploadError));
        } finally {
            setPendingAction(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleRemove = async () => {
        if (isBusy) return;
        setPendingAction('remove');
        setError(null);
        try {
            await removeCv();
            dispatch(profileCvUpdated(null));
            setMessage('CV removed.');
        } catch (removeError) {
            setError(getApiErrorPayload(removeError));
        } finally {
            setPendingAction(null);
        }
    };

    return <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><FileText className="size-4" aria-hidden="true" /></span><div><h2 className="text-xl font-bold tracking-[-0.035em]">CV</h2><p className="mt-1 text-sm text-ink-muted">Upload one PDF, up to 5 MB.</p></div></div>
            <div className="flex flex-wrap gap-2">
                {cvUrl ? <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-ink-muted hover:text-ink"><FileText className="size-4" />Current CV</a> : null}
                <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => void handleFile(event.target.files?.[0])} />
                <button type="button" disabled={isBusy} onClick={() => inputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-60">{pendingAction === 'upload' ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}{cvUrl ? 'Replace CV' : 'Upload CV'}</button>
                {cvUrl ? <button type="button" disabled={isBusy} onClick={() => void handleRemove()} className="grid size-10 place-items-center rounded-xl border border-line text-danger disabled:opacity-60" aria-label={pendingAction === 'remove' ? 'Removing CV' : 'Remove CV'}>{pendingAction === 'remove' ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}</button> : null}
            </div>
        </div>
        {message ? <p role="status" className="mt-3 text-sm font-semibold text-success">{message}</p> : null}
        {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
    </section>;
}
