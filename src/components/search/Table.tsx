import Image from 'next/image';
import { Paragraph, ResponsiveIcon } from '@/components';
import Pagination from '@/components/ui/Pagination';
import { TableParams } from '@/lib/definitions/search.definitions';
import { fetchFilteredUsers } from '@/lib/data/search.data';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { link } from '@/styles';
import { EmptyResult } from './EmptyResult';
import { calculateTotalPags } from '@/lib/utilities';

export const Table = async ({
    query,
    page,
}: TableParams) => {
    const users = await fetchFilteredUsers(query, page);
    if (!users) return <EmptyResult />

    return (
        <div className="w-full rounded-lg bg-light-component dark:bg-dark-component p-2">
            {users.items.map((user, idx) => (
                <div
                    key={idx}
                    className="mb-2 w-full rounded-md p-4 bg-light-sub-component dark:bg-dark-sub-component"
                >
                    <div
                        className="flex items-center justify-between"
                    >
                        <div className='flex items-center gap-2'>
                            <Image
                                src={user.profilePicture || '/Default-Male.svg'}
                                className="mr-2 rounded-full"
                                width={28}
                                height={28}
                                alt={`${user.firstname}'s profile picture`}
                            />
                            <div>
                                <Paragraph>{user.firstname} {user.lastname}</Paragraph>
                                <Paragraph intent='secondary' className='text-sm italic'>
                                    {user.title}
                                </Paragraph>
                            </div>
                        </div>
                        <Link href={`/client/${user.username}/dashboard`} className={link()}>
                            <ResponsiveIcon icon={ArrowTopRightOnSquareIcon} />
                        </Link>
                    </div>
                </div>
            ))}
            <div className="py-5 flex w-full justify-center">
                <Pagination totalPages={calculateTotalPags(users.rowCount)} />
            </div>
        </div>
    );
}