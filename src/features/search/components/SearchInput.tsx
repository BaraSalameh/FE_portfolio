'use client';

import { Search, X } from 'lucide-react';
import debounce from 'lodash.debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const initialValue = searchParams.get('query') ?? '';
    const [value, setValue] = useState(initialValue);

    const updateQuery = useMemo(() => debounce((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term.trim()) {
            params.set('query', term.trim());
            params.set('page', '1');
        } else {
            params.delete('query');
            params.delete('page');
        }
        replace(params.size ? `${pathname}?${params.toString()}` : pathname);
    }, 300), [pathname, replace, searchParams]);

    useEffect(() => () => updateQuery.cancel(), [updateQuery]);

    const changeValue = (nextValue: string) => {
        setValue(nextValue);
        updateQuery(nextValue);
    };

    return (
        <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-line bg-surface-raised px-4 shadow-sm transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
            <Search className="size-[1.1rem] shrink-0 text-ink-muted" aria-hidden="true" />
            <span className="sr-only">Search portfolios</span>
            <input
                type="search"
                value={value}
                onChange={(event) => changeValue(event.target.value)}
                placeholder="Search by name or role"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60 [&::-webkit-search-cancel-button]:hidden"
                aria-label="Search portfolios"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => changeValue('')}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-canvas-subtle hover:text-ink"
                    aria-label="Clear search"
                >
                    <X className="size-4" aria-hidden="true" />
                </button>
            )}
        </label>
    );
}
