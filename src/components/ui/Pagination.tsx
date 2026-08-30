'use client';

import { generatePagination } from '@/lib/utilities';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '../forms';
import { ResponsiveIcon } from './ResponsiveIcon';

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const allPages = generatePagination(currentPage, totalPages);

    const createPageURL = (pageNumber: string | number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
            return `${pathname}?${params.toString()}`;
        }

    return (
        <>
        <div className="inline-flex">
            
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <div className="flex gap-1">
                {allPages.map((page, index) => {
                    let position: 'first' | 'last' | 'single' | 'middle' | undefined;

                    if (index === 0) position = 'first';
                    if (index === allPages.length - 1) position = 'last';
                    if (allPages.length === 1) position = 'single';
                    if (page === '...') position = 'middle';

                    return (
                        <PaginationNumber
                            key={`${page}-${index}`}
                            href={createPageURL(page)}
                            page={page}
                            position={position}
                            isActive={currentPage === page}
                        />
                    );
                })}
            </div>
            <PaginationArrow
                direction="right"
                href={createPageURL(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
            />
        </div>
        </>
    );
}

function PaginationNumber({
    page,
    href,
    isActive,
    position,
}: {
    page: number | string;
    href: string;
    position?: 'first' | 'last' | 'middle' | 'single';
    isActive: boolean;
}) {
    return (
        <Button
            url={href}
            className={clsx({
                'pointer-events-none opacity-50': isActive || position === 'middle',
            })}
            size='md'
        >
            {page}
        </Button>
    );
}

function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
}) {

    const icon = direction === 'left' ? ArrowLeftIcon : ArrowRightIcon;

    return (
        <Button
            url={href}
            className={clsx(
                {
                    'pointer-events-none opacity-50': isDisabled,
                    'mr-2 md:mr-4': direction === 'left',
                    'ml-2 md:ml-4': direction === 'right',
                }
            )}
            size='sm'
        >
            <ResponsiveIcon icon={icon} />
        </Button>
    );
}
