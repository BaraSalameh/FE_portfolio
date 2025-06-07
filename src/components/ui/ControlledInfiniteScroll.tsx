'use client';

import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Paragraph } from "./Paragraph";
import { ControlledInfiniteScrollProps } from "./types";
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
        <div id="scrollableDiv" className={cn(infiniteScroll({ ...styles }), className)}>
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