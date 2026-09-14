'use client';

import { ArrowDown, ArrowUp, Github, Globe2, Linkedin, Link as LinkIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FormDropdown } from '@/features/dashboard/forms/FormDropdown';
import type { Option } from '@/features/types.features';
import { getApiErrorPayload } from '@/lib/api/errors';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import type { SocialLinkResponse } from '../../types.dashboard';
import { deleteSocialLink, loadOwnerDashboard, saveSocialLink, sortSocialLinks } from './api';
import { socialLinksReplaced } from './slice';

const platformOptions: Option[] = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Personal website', label: 'Personal website' },
    { value: 'Custom', label: 'Custom' },
];

const platformIcon = (platform: string) => platform === 'LinkedIn' ? Linkedin : platform === 'GitHub' ? Github : platform === 'Personal website' ? Globe2 : LinkIcon;

export function SocialLinksEditor() {
    const links = useAppSelector((state) => state.socialLinks.items);
    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState<SocialLinkResponse | null>(null);
    const [platform, setPlatform] = useState('LinkedIn');
    const [customPlatform, setCustomPlatform] = useState('');
    const [url, setUrl] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => dispatch(socialLinksReplaced((await loadOwnerDashboard()).lstSocialLinks ?? []));
    const reset = () => { setEditing(null); setPlatform('LinkedIn'); setCustomPlatform(''); setUrl(''); };
    const startEdit = (link: SocialLinkResponse) => {
        const preset = platformOptions.some((option) => option.value === link.platform) ? link.platform : 'Custom';
        setEditing(link); setPlatform(preset); setCustomPlatform(preset === 'Custom' ? link.platform : ''); setUrl(link.url);
    };
    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const label = platform === 'Custom' ? customPlatform.trim() : platform;
        if (!label || !/^https:\/\//i.test(url)) { setError('Enter a label and a secure https:// URL.'); return; }
        setBusy(true); setError(null);
        try {
            await saveSocialLink({ id: editing?.id, platform: label, url, icon: '' });
            await refresh(); reset();
        } catch (caught) { setError(getApiErrorPayload(caught)); }
        finally { setBusy(false); }
    };
    const remove = async (id?: string) => {
        if (!id) return;
        setBusy(true); setError(null);
        try { await deleteSocialLink(id); await refresh(); if (editing?.id === id) reset(); }
        catch (caught) { setError(getApiErrorPayload(caught)); }
        finally { setBusy(false); }
    };
    const move = async (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= links.length) return;
        const ordered = [...links]; [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
        dispatch(socialLinksReplaced(ordered.map((link, order) => ({ ...link, order: order + 1 }))));
        try { await sortSocialLinks(ordered.flatMap((link) => link.id ? [link.id] : [])); }
        catch (caught) { setError(getApiErrorPayload(caught)); await refresh(); }
    };

    return <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><LinkIcon className="size-4" /></span><div><h2 className="text-xl font-bold tracking-[-0.035em]">Site links</h2><p className="mt-1 text-sm text-ink-muted">Add up to 10 links and arrange their public order.</p></div></div>
        <form onSubmit={submit} className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-3">
            <FormDropdown label="Platform" options={platformOptions} value={platformOptions.find((option) => option.value === platform)} isClearable={false} isSearchable={false} onChange={(option) => setPlatform((option as Option).value)} />
            {platform === 'Custom' ? <label className="text-sm font-semibold">Label<input value={customPlatform} maxLength={100} onChange={(event) => setCustomPlatform(event.target.value)} className="mt-1 w-full rounded-xl border border-line bg-surface-raised px-3.5 py-2.5" required /></label> : <div className="hidden md:block" />}
            <label className="text-sm font-semibold">URL<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="mt-1 w-full rounded-xl border border-line bg-surface-raised px-3.5 py-2.5" required /></label>
            <div className="flex items-end gap-2"><button disabled={busy || (!editing && links.length >= 10)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-60"><Plus className="size-4" />{editing ? 'Save link' : 'Add link'}</button>{editing ? <button type="button" onClick={reset} className="min-h-11 rounded-xl border border-line px-4 text-sm font-bold">Cancel</button> : null}</div>
        </form>
        {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
        <div className="mt-5 space-y-2">{links.map((link, index) => { const Icon = platformIcon(link.platform); return <div key={link.id ?? `${link.url}-${index}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface-raised p-3"><Icon className="size-4 shrink-0 text-accent" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{link.platform}</p><p className="truncate text-xs text-ink-muted">{link.url}</p></div><button type="button" disabled={index === 0 || busy} onClick={() => void move(index, -1)} aria-label={`Move ${link.platform} up`} className="grid size-9 place-items-center rounded-lg hover:bg-canvas-subtle disabled:opacity-30"><ArrowUp className="size-4" /></button><button type="button" disabled={index === links.length - 1 || busy} onClick={() => void move(index, 1)} aria-label={`Move ${link.platform} down`} className="grid size-9 place-items-center rounded-lg hover:bg-canvas-subtle disabled:opacity-30"><ArrowDown className="size-4" /></button><button type="button" onClick={() => startEdit(link)} aria-label={`Edit ${link.platform}`} className="grid size-9 place-items-center rounded-lg hover:bg-canvas-subtle"><Pencil className="size-4" /></button><button type="button" disabled={busy} onClick={() => void remove(link.id)} aria-label={`Delete ${link.platform}`} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-canvas-subtle"><Trash2 className="size-4" /></button></div>; })}</div>
    </section>;
}
