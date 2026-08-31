'use client';

import { useAppDispatch } from "@/lib/store/hooks";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PaginationConfig } from '@/features/dashboard/types.presentation';
import type { ReactNode } from 'react';
import { useId } from 'react';

type ControlledInfiniteScrollProps = PaginationConfig & { items: object[]; children: ReactNode };

export const ControlledInfiniteScroll = ({
    items,
    maxLength,
    fetchAction,
    query,
    children,
    className,
}: ControlledInfiniteScrollProps) => {

    const dispatch = useAppDispatch();
    const hasMore = items.length < maxLength;

    const [pagination, setPagination] = useState<{ query?: string; page: number }>({ query, page: 0 });
    const page = pagination.query === query ? pagination.page : 0;
    const scrollId = useId().replaceAll(':', '');

    const handleNext = () => {
        const nextPage = page + 1;
        setPagination({ query, page: nextPage });
        dispatch(fetchAction({ query, page: nextPage }));
    };

    return (
        <div id={scrollId} className={`max-h-96 overflow-y-auto overscroll-contain ${className ?? ''}`}>
            <InfiniteScroll
                dataLength={items.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<p className="p-3 text-center text-xs text-ink-muted">Loading…</p>}
                scrollableTarget={scrollId}
            >
                {children}
            </InfiniteScroll>
        </div>
    )
}
