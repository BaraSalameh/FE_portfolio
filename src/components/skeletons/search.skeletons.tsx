function SearchTableRowSkeleton() {
    return (
        <div className="mb-2 w-full rounded-md p-4 bg-light-sub-component dark:bg-dark-sub-component animate-pulse">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className="mr-2 rounded-full bg-gray-300 w-7 h-7" />
                    <div>
                        <div className="h-4 bg-light-primary dark:bg-dark-primary rounded w-32 mb-1" />
                        <div className="h-3 bg-light-Secondary dark:bg-dark-secondary rounded w-24" />
                    </div>
                </div>
                <div className="bg-gray-300 w-6 h-6 rounded" />
            </div>
        </div>
    );
}
    
export function SearchTableSkeleton() {
    return (
        <div className="w-full rounded-lg bg-light-component dark:bg-dark-component p-2">
            <SearchTableRowSkeleton />
            <SearchTableRowSkeleton />
            <SearchTableRowSkeleton />
            <SearchTableRowSkeleton />
            <SearchTableRowSkeleton />
            <div className="py-5 flex w-full justify-center">
                <div className="bg-gray-300 w-24 h-8 rounded animate-pulse" />
            </div>
        </div>
    );
}