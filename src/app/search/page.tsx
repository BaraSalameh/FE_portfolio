import { Suspense } from 'react';
import { Search } from '@/components/ui/Search';
import { Metadata } from 'next';
import { Table } from '@/components/search';
import { SearchTableSkeleton } from '@/components/skeletons/search.skeletons';
import { Container, Main } from '@/components';
import { GoHomeLink } from '@/components/GoHomeLink';

export const metadata: Metadata = {
    title: 'Search'
}

const Page = async (
    props: {
        searchParams?: Promise<{
            query?: string;
            page?: string;
        }>;
    }
) => {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <Container>
            <Main className='mx-auto md:w-2/3' >
                <div className="flex w-full justify-between">
                    <GoHomeLink />
                    <Search placeholder="Search users..." />
                </div>
                <Suspense key={query + currentPage} fallback={<SearchTableSkeleton />}>
                    <Table query={query} page={currentPage} />
                </Suspense>
            </Main>
        </Container>
    );
}

export default Page;