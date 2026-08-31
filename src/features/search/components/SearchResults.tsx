import { ActionLink } from '@/design-system';
import { fetchFilteredUsers } from '../api';
import type { TableParams } from '@/lib/definitions/search.definitions';
import { paths } from '@/lib/pathHelper';
import { calculateTotalPags } from '@/lib/utilities';
import { ArrowUpRight, SearchX } from 'lucide-react';
import Image from 'next/image';
import { SearchPagination } from './SearchPagination';

export async function SearchResults({ query, page }: TableParams) {
    const users = await fetchFilteredUsers(query, page);

    if (users.rowCount === 0) {
        return (
            <div className="rounded-[1.5rem] border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong"><SearchX className="size-5" aria-hidden="true" /></span>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.03em]">No portfolios found</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">Try a different name, role, or spelling. New portfolios are joining all the time.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm text-ink-muted"><strong className="font-bold text-ink">{users.rowCount}</strong> {users.rowCount === 1 ? 'portfolio' : 'portfolios'} found</p>
                {query && <p className="truncate text-xs text-ink-muted">Results for “{query}”</p>}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {users.items.map((user) => {
                    const fullName = `${user.firstname} ${user.lastname}`;
                    return (
                        <li key={user.username} className="group flex min-h-48 flex-col rounded-[1.4rem] border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl hover:shadow-black/5">
                            <div className="flex items-start justify-between gap-4">
                                <Image
                                    src={user.profilePicture || '/Default-Male.svg'}
                                    width={56}
                                    height={56}
                                    alt={`${fullName}'s profile picture`}
                                    className="size-14 rounded-2xl border border-line object-cover"
                                />
                                <span className="grid size-9 place-items-center rounded-full border border-line text-ink-muted transition group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6 flex-1">
                                <h2 className="text-lg font-bold tracking-[-0.03em]">{fullName}</h2>
                                <p className="mt-1 text-sm text-ink-muted">{user.title || 'Portfolio professional'}</p>
                            </div>
                            <ActionLink
                                href={paths.root.dashboard('client', user.username).path()}
                                intent="quiet"
                                size="sm"
                                className="mt-5 w-full border border-line group-hover:border-accent/25"
                                aria-label={`View ${fullName}'s portfolio`}
                            >
                                View portfolio
                            </ActionLink>
                        </li>
                    );
                })}
            </ul>
            <SearchPagination totalPages={calculateTotalPags(users.rowCount)} />
        </div>
    );
}
