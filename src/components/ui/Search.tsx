'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ResponsiveIcon } from "./ResponsiveIcon";
import { SearchIcon } from "lucide-react";
import debounce from "lodash.debounce";

export const Search = ({ placeholder }: { placeholder?: string}) => {
    
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = debounce((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('page');
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`)
    }, 300);

    return (
        <div className="flex items-center gap-2 outline-1 rounded-md px-4 py-2">
            <ResponsiveIcon icon={SearchIcon}/>
            <input
                type="text"
                onChange={e => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
                aria-label='Search'
                placeholder={placeholder || "Search..."}
                className=" text-sm outline-0 w-full"
            />
        </div>
    );
}