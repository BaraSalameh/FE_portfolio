// components/InfiniteScrollSelect.tsx
import Select, {
    components,
    GroupBase,
    Props as ReactSelectProps,
} from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";
import { cn } from "@/components/utils";
import { infiniteScroll } from "@/styles/infiniteScroll";

// Generic option type — you can use T as you like
export interface DefaultOption {
    label: string;
    value: string | number;
}

interface InfiniteScrollSelectProps<
    TOption extends DefaultOption,
    IsMulti extends boolean = false,
    TGroup extends GroupBase<TOption> = GroupBase<TOption>
> extends ReactSelectProps<TOption, IsMulti, TGroup> {
    fetchMore: () => void;
    hasMore: boolean;
}

export const FormInfiniteDropdown = <
    TOption extends DefaultOption,
    IsMulti extends boolean = false,
    TGroup extends GroupBase<TOption> = GroupBase<TOption>
>(props: InfiniteScrollSelectProps<TOption, IsMulti, TGroup>) => {

    const { fetchMore, hasMore, ...rest } = props;

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            width: '100%',
            padding: '0.5rem 1rem', // Tailwind: px-4 py-2
            marginTop: '0.25rem', // Tailwind: mt-1
            borderWidth: '1px',
            borderRadius: '0.5rem', // Tailwind: rounded-lg
            borderColor: '#6b7280', // border-red-500 or border-gray-500
            backgroundColor: 'transparent', // 👈 make background transparent
            outline: 'none',
            boxShadow: state.isFocused
                ? `0 0 0 2px ${'#6b7280'}` // focus:ring-2 color mimic
                : undefined,
            '&:hover': {
                borderColor: '#6b7280',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: '#15803d', // or keep it white for dropdown options
            borderRadius: '0.5rem', // Tailwind: rounded-lg
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'inherit', // inherits from parent, works well with transparent bg
        }),
        input: (provided: any) => ({
            ...provided,
            color: 'inherit',
            cursor: 'text',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#9ca3af', // Tailwind text-gray-400
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#22c55e' // green-700 for selected item
                : state.isFocused
                ? '#22c55e' // green-500 on hover/focus
                : 'transparent',
            color: state.isSelected || state.isFocused ? 'white' : 'inherit',
            cursor: 'pointer',
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#22c55e', // Tailwind: green-500
            borderRadius: '0.375rem', // Tailwind: rounded-md
            padding: '2px 6px',
        }),

        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'white',
            // fontWeight: 500,
        }),

        multiValueRemove: (provided: any) => ({
            ...provided,
            color: 'white',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: '#15803d', // Tailwind: green-700
                color: 'white',
            },
        }),
        clearIndicator: (provided: any, state: any) => ({
            ...provided,
            color: 'white',
            cursor: 'pointer'
        }),
        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }),
    };

    return (
        <Select
            {...rest}
            onMenuScrollToBottom={() => {
                if (hasMore) {
                    fetchMore();
                }
            }}
            styles={customStyles}
            components={{
                ...rest.components,
            }}
        />
    );
}
