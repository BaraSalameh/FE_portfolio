'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { userListQuery } from '@/features/home/search/apis/userListQuery';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Paragraph, ResponsiveIcon } from '@/components';
import { ControlledInfiniteScroll } from '@/components/ui/ControlledInfiniteScroll';
import { useDebouncedSearchUser } from '../hooks';
import { clearSearch } from '../slice';

export const SearchBarForm = () => {
    const { userList, rowCount, error, loading } = useAppSelector(state => state.search);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [query, setQuery] = useState('');

    const debouncedSearch = useDebouncedSearchUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSelect = (username: string) => {
        router.push(`/client/${username}/dashboard`);
    };

    useEffect(() => {
        return () => {
            dispatch(clearSearch());
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleClear = () => {
        debouncedSearch.cancel();
        setQuery('');
        dispatch(clearSearch());
    }

    const renderUserList = () => {
        if (error) {
            return <Paragraph intent="danger" size="sm" className="p-3">{error}</Paragraph>;
        }

        if (loading && userList.length === 0) {
            return <Paragraph size="sm" className="p-3">Searching...</Paragraph>;
        }

        if (!loading && userList.length === 0) {
            return <Paragraph size="sm" className="p-3">No result</Paragraph>;
        }

        return userList?.map((user: any) => {
            const profilePicture = user?.profilePicture ?? (
                user?.gender === 0 ? '/Default-Female.svg' : '/Default-Male.svg'
            );

            return (
                <div
                    key={user.username}
                    onClick={() => handleSelect(user.username)}
                    className="flex gap-3 p-3 hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer"
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
                    value={query}
                    onChange={handleChange}
                    aria-label='Search users'
                    placeholder="Search for a user"
                    className="outline-none text-sm w-full"
                />
                {query && <ResponsiveIcon icon={X} onClick={handleClear}/>}
            </form>

            {query && (
                <ControlledInfiniteScroll
                    items={userList}
                    maxLength={rowCount}
                    query={query}
                    fetchAction={userListQuery}
                    styles={{background: true, border: true}}
                    className='mt-2'
                >
                    {renderUserList()}
                </ControlledInfiniteScroll>
            )}
        </div>
    );
};
