import { Suspense } from 'react';
import { Metadata } from 'next';
import { ActionLink, BrandMark, PageContainer, ThemeSwitch } from '@/design-system';
import { SearchInput, SearchResults, SearchResultsSkeleton } from '@/features/search';
import { paths } from '@/lib/pathHelper';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
        <div className="min-h-svh bg-canvas text-ink">
            <header className="border-b border-line bg-canvas/90 backdrop-blur-xl">
                <PageContainer className="flex h-16 items-center justify-between sm:h-[4.5rem]">
                    <BrandMark />
                    <div className="flex items-center gap-2">
                        <ActionLink href={paths.root.path()} intent="quiet" size="sm" className="max-sm:hidden"><ArrowLeft className="size-4" aria-hidden="true" /> Home</ActionLink>
                        <ActionLink href={paths.root.auth.register.path()} size="sm" className="max-sm:hidden">Create yours</ActionLink>
                        <ThemeSwitch />
                    </div>
                </PageContainer>
            </header>
            <main>
                <section className="border-b border-line bg-canvas-subtle/55">
                    <PageContainer className="py-12 sm:py-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-accent"><Sparkles className="size-3.5" aria-hidden="true" /> Portfolio directory</p>
                            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-balance sm:text-5xl">Find people doing work worth discovering.</h1>
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">Explore public portfolios by name or professional role, and see the experience behind the person.</p>
                            <div className="mx-auto mt-8 max-w-2xl"><SearchInput /></div>
                        </div>
                    </PageContainer>
                </section>
                <PageContainer className="py-10 sm:py-12">
                    <Suspense key={`${query}-${currentPage}`} fallback={<SearchResultsSkeleton />}>
                        <SearchResults query={query} page={currentPage} />
                    </Suspense>
                </PageContainer>
            </main>
        </div>
    );
}

export default Page;
