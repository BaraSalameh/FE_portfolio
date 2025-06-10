import { getSelectedOption } from "@/lib/utils/appFunctions";
import { Controller, FieldValues } from "react-hook-form";
import { ControlledInfiniteDropdownProps } from "./types";
import { FormInfiniteDropdown } from "./FormInfiniteDropdown";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useState } from "react";

export const ControlledInfiniteDropdown = <T extends FieldValues>({
    name,
    control,
    label,
    options,
    isMulti = false,
    fetchAction,
    maxLength
}: ControlledInfiniteDropdownProps<T>) => {
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const hasMore = options.length < maxLength;

    const fetchOptions = async (input = "", pageNumber = 0) => {
        await dispatch(fetchAction({ query: input, page: pageNumber }));
    };

    const fetchMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchOptions(search, nextPage);
    };

    const handleSearchChange = (input: string) => {
        setSearch(input);
        setPage(0);
        fetchOptions(input, 0);
        return input;
    };

    useEffect(() => {
        options.length === 0 && fetchOptions();
    }, []);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const selectedValue = getSelectedOption(options, field.value);

                return (
                    <FormInfiniteDropdown
                        inputValue={search}
                        onInputChange={(val) => {
                            setSearch(val);
                            setPage(0);
                            dispatch(fetchAction({ query: val, page: 0 }));
                        }}
                        options={options}
                        onChange={option => field.onChange(option)}
                        value={selectedValue}
                        fetchMore={fetchMore}
                        hasMore={hasMore}
                        placeholder="Search blabla..."
                        isClearable
                    />
                );
            }}
        />
    );
}
