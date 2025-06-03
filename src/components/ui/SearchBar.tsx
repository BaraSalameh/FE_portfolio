'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { userListQuery } from '@/lib/apis/client/userListQuery';
import debounce from 'lodash.debounce';
import { Paragraph, ResponsiveIcon } from '.';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroll-component';

export const SearchBar = () => {
    const { userList, rowCount, error } = useAppSelector(state => state.search);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const hasMore = userList.length < rowCount;

    useEffect(() => {
        if (query.trim().length > 0) {
            setPage(0);
            dispatch(userListQuery({ query, page: 0 }));
        }
    }, [query, dispatch]);

    const handleNext = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(userListQuery({ query, page: nextPage }));
    };

    const debouncedHandleChange = useCallback(
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
        }, 500) , []
    );

    const handleSelect = (username: string) => {
        router.push(`/client/${username}/dashboard`);
    };

    const renderUserList = () => {
        if (error) {
            return <Paragraph intent="danger" size="sm" className="p-3">{error}</Paragraph>;
        }

        if (userList.length === 0) {
            return <Paragraph size="sm" className="p-3">No Result</Paragraph>;
        }

        return userList?.map((user: any) => {
            const profilePicture = user?.profilePicture ?? (
                user?.gender === 0 ? '/Default-Female.svg' : '/Default-Male.svg'
            );

            return (
                <div
                    key={user.username}
                    onClick={() => handleSelect(user.username)}
                    className="flex gap-3 p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                    <div className="relative min-w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 border-white overflow-hidden">
                        <Image
                            src={profilePicture}
                            alt="Profile picture"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <Paragraph size="sm">{user.firstname} {user.lastname}</Paragraph>
                        <Paragraph size="xs">{user.title}</Paragraph>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="relative max-w-md mx-auto">
            <form
                className="flex items-center border border-green-900 rounded-full px-4 py-2 gap-2"
                onSubmit={e => e.preventDefault()}
            >
                <ResponsiveIcon icon={SearchIcon}/>
                <input
                    type="text"
                    onChange={debouncedHandleChange}
                    placeholder="Search for a user"
                    className="outline-none text-sm"
                />
            </form>

            {query && (
                <div
                    className="
                        absolute w-full mt-1 bg-zinc-900 border border-zinc-700
                        rounded-2xl  max-h-60 overflow-y-auto scrollbar-hide
                    "
                    id="scrollableDiv"
                >
                    <InfiniteScroll
                        dataLength={userList.length}
                        next={handleNext}
                        hasMore={hasMore}
                        loader={<Paragraph size="sm" className="p-3" >Loading...</Paragraph>}
                        scrollableTarget="scrollableDiv"
                    >
                        {renderUserList()}
                    </InfiniteScroll>
                </div>
            )}
        </div>
    );
};
