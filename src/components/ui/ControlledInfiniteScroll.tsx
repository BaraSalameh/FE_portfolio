'use client';

import { useAppDispatch } from "@/lib/store/hooks";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Paragraph } from "./Paragraph";
import { ControlledInfiniteScrollProps } from "./types.ui";
import { cn } from "../utils";
import { infiniteScroll } from "@/styles/infiniteScroll";

export const ControlledInfiniteScroll = ({
    items,
    maxLength,
    fetchAction,
    query,
    children,
    className,
    styles
}: ControlledInfiniteScrollProps) => {

    const dispatch = useAppDispatch();
    const hasMore = items.length < maxLength;

    const [pagination, setPagination] = useState<{ query?: string; page: number }>({ query, page: 0 });
    const page = pagination.query === query ? pagination.page : 0;

    const handleNext = () => {
        const nextPage = page + 1;
        setPagination({ query, page: nextPage });
        dispatch(fetchAction({ query, page: nextPage }));
    };

    return (
        <div id="scrollableDiv" className={cn(infiniteScroll({ ...styles }), className)}>
            <InfiniteScroll
                dataLength={items.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<Paragraph className="p-3 text-sm" >Loading...</Paragraph>}
                scrollableTarget="scrollableDiv"
            >
                {children}
            </InfiniteScroll>
        </div>
    )
}
