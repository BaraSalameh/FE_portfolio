'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Inbox, Mail, MailOpen, MessageCircle, RefreshCw, User } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { ActionDialog } from '@/design-system';
import { ControlledInfiniteScroll } from '@/features/dashboard/presentation/widgets/ControlledInfiniteScroll';
import type { ContactMessageFormData } from '../schema';
import { useMessageDelete, useSignMessage } from '../hooks';
import { contactMessageListQuery } from '../thunks';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { paths } from '@/lib/pathHelper';
import { cn } from '@/lib/ui/cn';
import { OwnerHeaderActions } from '@/features/dashboard/profile/account';

const getMessageId = (message: ContactMessageFormData) => message.id ?? '';

function MessageListItem({ message, selected, onSelect }: { message: ContactMessageFormData; selected: boolean; onSelect: (message: ContactMessageFormData) => void }) {
    const unread = !message.isRead;

    return <button type="button" onClick={() => onSelect(message)} aria-current={selected ? 'true' : undefined} className={cn('group w-full rounded-xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', selected ? 'border-accent/35 bg-accent-soft/65' : 'border-transparent bg-canvas-subtle/65 hover:border-accent/20 hover:bg-accent-soft/40')}>
        <span className="flex items-start gap-3">
            <span className={cn('mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl', unread ? 'bg-accent text-white' : 'bg-surface-raised text-ink-muted')}>{unread ? <Mail className="size-4" aria-hidden="true" /> : <MailOpen className="size-4" aria-hidden="true" />}</span>
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2"><span className={cn('truncate text-sm', unread ? 'font-bold text-ink' : 'font-semibold text-ink-muted')}>{message.name || 'Unknown sender'}</span>{unread ? <span className="ml-auto size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" /> : null}</span>
                <span className="mt-1 block truncate text-xs font-medium text-ink-muted">{message.subject}</span>
                <span className="mt-1 block truncate text-xs text-ink-muted/80">{message.message}</span>
            </span>
        </span>
    </button>;
}

function MessageDetails({ message, loading, onDelete, onBack }: { message: ContactMessageFormData; loading: boolean; onDelete: (id: string) => Promise<void>; onBack: () => void }) {
    const id = getMessageId(message);

    return <article className="flex min-h-[32rem] flex-col rounded-2xl border border-line bg-surface shadow-sm">
        <header className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
            <button type="button" onClick={onBack} className="grid size-10 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-canvas-subtle hover:text-ink lg:hidden" aria-label="Back to message list"><ArrowLeft className="size-4" aria-hidden="true" /></button>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><MessageCircle className="size-4" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Message</p><h2 className="mt-1 break-words text-xl font-bold tracking-[-0.035em]">{message.subject}</h2></div>
            {id ? <ActionDialog as="delete" title="Delete" subTitle="Delete message" idToDelete={id} isLoading={loading} onAction={onDelete}>This message will be permanently removed from your inbox. This action cannot be undone.</ActionDialog> : null}
        </header>
        <div className="flex-1 p-5 sm:p-6">
            <dl className="grid gap-4 rounded-xl border border-line/70 bg-canvas-subtle/55 p-4 sm:grid-cols-2">
                <div><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted"><User className="size-3.5" aria-hidden="true" />From</dt><dd className="mt-1.5 break-words text-sm font-semibold text-ink">{message.name || 'Unknown sender'}</dd></div>
                <div><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted"><Mail className="size-3.5" aria-hidden="true" />Email</dt><dd className="mt-1.5 break-all text-sm"><a href={`mailto:${message.email}`} className="font-semibold text-accent-strong hover:underline">{message.email}</a></dd></div>
            </dl>
            <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">Message</p><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink sm:text-[0.95rem]">{message.message}</p></div>
        </div>
    </article>;
}

export const ContactMessagePage = () => {
    const dispatch = useAppDispatch();
    const { username } = useParams<{ username: string }>();
    const { lstMessages, unreadContactMessageCount, rowCount, loading, error } = useAppSelector(state => state.contactMessage);
    const user = useAppSelector(state => state.profile.user);
    const [selectedId, setSelectedId] = useState<string>();
    const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const requestedInitialPage = useRef(false);
    const openedMessageIds = useRef(new Set<string>());
    const markAsRead = useSignMessage();
    const deleteSelected = useMessageDelete();
    const selectedMessage = lstMessages.find(message => getMessageId(message) === selectedId)
        ?? lstMessages.find(message => !message.isRead)
        ?? lstMessages[0];

    useEffect(() => {
        if (requestedInitialPage.current) return;
        requestedInitialPage.current = true;
        void dispatch(contactMessageListQuery({ page: 0 }));
    }, [dispatch]);

    useEffect(() => {
        const id = selectedMessage ? getMessageId(selectedMessage) : '';
        if ((!isDesktop && !mobileDetailsOpen) || !id || selectedMessage?.isRead || openedMessageIds.current.has(id)) return;
        openedMessageIds.current.add(id);
        void markAsRead(id).then((marked) => {
            if (!marked) openedMessageIds.current.delete(id);
        });
    }, [isDesktop, markAsRead, mobileDetailsOpen, selectedMessage]);

    const handleSelect = (message: ContactMessageFormData) => { setSelectedId(getMessageId(message)); setMobileDetailsOpen(true); };
    const handleDelete = async (id: string) => {
        const currentIndex = lstMessages.findIndex(message => getMessageId(message) === id);
        const nextMessage = lstMessages[currentIndex + 1] ?? lstMessages[currentIndex - 1];
        const deleted = await deleteSelected(id);
        if (!deleted) return;
        setSelectedId(nextMessage ? getMessageId(nextMessage) : undefined);
        if (!nextMessage) setMobileDetailsOpen(false);
    };

    return <main className="min-h-svh bg-canvas px-4 py-5 text-ink sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4"><Link href={paths.root.dashboard('owner', username).path()} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-ink-muted transition hover:bg-surface hover:text-ink"><ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard</Link>{user ? <OwnerHeaderActions user={user} unreadMessageCount={unreadContactMessageCount} /> : null}</div>
        <header className="mt-4 rounded-[1.75rem] border border-line bg-surface p-6 shadow-lg shadow-black/5 sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20"><Inbox className="size-5" aria-hidden="true" /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Portfolio editor</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Messages</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">Read and manage messages sent through your public portfolio.</p></div>{unreadContactMessageCount > 0 ? <span className="ml-auto shrink-0 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent-strong">{unreadContactMessageCount} unread</span> : null}</div></header>
        <div className="mt-6 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-6">
            <section aria-labelledby="inbox-heading" className={cn('rounded-2xl border border-line bg-surface shadow-sm', mobileDetailsOpen && selectedMessage ? 'hidden lg:block' : 'block')}>
                <header className="border-b border-line px-5 py-4"><h2 id="inbox-heading" className="font-bold tracking-[-0.025em]">Inbox</h2><p className="mt-1 text-xs text-ink-muted">{rowCount} {rowCount === 1 ? 'message' : 'messages'}</p></header>
                {error ? <div role="alert" className="m-4 rounded-xl border border-danger/20 bg-danger/8 p-4 text-sm text-danger"><p>{error}</p><button type="button" onClick={() => void dispatch(contactMessageListQuery({ page: 0 }))} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 font-bold transition hover:bg-danger/10"><RefreshCw className="size-4" aria-hidden="true" />Try again</button></div> : null}
                {!error && loading && lstMessages.length === 0 ? <div className="space-y-2 p-3" aria-label="Loading messages" role="status">{[0, 1, 2].map(item => <div key={item} className="h-24 animate-pulse rounded-xl bg-canvas-subtle" />)}</div> : null}
                {!error && !loading && lstMessages.length === 0 ? <div className="grid min-h-72 place-items-center p-6 text-center"><div><Inbox className="mx-auto size-8 text-ink-muted" aria-hidden="true" /><p className="mt-3 font-bold">Your inbox is empty</p><p className="mt-1 text-sm text-ink-muted">New portfolio messages will appear here.</p></div></div> : null}
                {lstMessages.length > 0 ? <ControlledInfiniteScroll items={lstMessages} maxLength={rowCount} fetchAction={contactMessageListQuery} className="max-h-[calc(100svh-18rem)] min-h-80 p-3"><div className="space-y-2" role="list">{lstMessages.map((message, index) => <div role="listitem" key={getMessageId(message) || index}><MessageListItem message={message} selected={getMessageId(message) === getMessageId(selectedMessage)} onSelect={handleSelect} /></div>)}</div></ControlledInfiniteScroll> : null}
            </section>
            <section aria-label="Selected message" className={cn('min-w-0', mobileDetailsOpen && selectedMessage ? 'block' : 'hidden lg:block')}>{selectedMessage ? <MessageDetails message={selectedMessage} loading={loading} onDelete={handleDelete} onBack={() => setMobileDetailsOpen(false)} /> : <div className="grid min-h-[32rem] place-items-center rounded-2xl border border-dashed border-line bg-surface p-8 text-center"><div><MessageCircle className="mx-auto size-8 text-ink-muted" aria-hidden="true" /><h2 className="mt-3 font-bold">No message selected</h2><p className="mt-1 text-sm text-ink-muted">Choose a message from the inbox to read it.</p></div></div>}</section>
        </div>
    </div></main>;
};
