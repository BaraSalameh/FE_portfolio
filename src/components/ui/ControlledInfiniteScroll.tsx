'use client';

import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Paragraph } from "./Paragraph";
import { ControlledInfiniteScrollProps } from "./types";

export const ControlledInfiniteScroll = ({
    items,
    maxLength,
    fetchAction,
    query,
    children
}: ControlledInfiniteScrollProps) => {

    const dispatch = useAppDispatch();
    const hasMore = items.length < maxLength;

    const [ page, setPage ] = useState<number>(0);

    const handleNext = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(fetchAction({ query, page: nextPage }));
    };

    useEffect(() => {
        setPage(0);
    }, [query]);
    
    return (
        <div
            className="
                absolute w-full mt-1 bg-zinc-900 border border-zinc-700
                rounded-2xl  max-h-60 overflow-y-auto scrollbar-hide
            "
            id="scrollableDiv"
        >
            <InfiniteScroll
                dataLength={items.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<Paragraph size="sm" className="p-3" >Loading...</Paragraph>}
                scrollableTarget="scrollableDiv"
            >
                {children}
            </InfiniteScroll>
        </div>
    )
}