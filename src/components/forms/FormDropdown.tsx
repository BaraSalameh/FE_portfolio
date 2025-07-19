'use client';

import Select from 'react-select';
import { FormDropdownProps } from './types.forms';
import { Paragraph } from '../ui/Paragraph';
import { useAppDispatch } from '@/lib/store/hooks';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { CustomMultiValue, CustomOption, CustomSingleValue } from './CustomOption';

export const FormDropdown = ({
    label,
    options,
    value,
    onChange,
    onBlur,
    error,
    isSearchable = true,
    isClearable = true,
    isLoading = false,
    isMulti = false,
    placeholder = 'Select...',
    fetchAction
}: FormDropdownProps) => {
    const customStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'transparent',
        }),
        menu: (provided: any) => {
            const {backgroundColor, ...rest} = provided;
            return {
                ...rest,
                zIndex: 10
            }
        },
        option: (provided: any, state: any) => {
            const {backgroundColor, cursor, ...rest} = provided;
            return {
                ...rest,
                backgroundColor: state.isSelected
                ? '#22c55e' // green-500
                : ''
            }
        },
        input: (provided: any) => {
            const {color, ...rest} = provided;
            return {
                ...rest
            }
        },
        singleValue: (provided: any) => {
            const {color, ...rest} = provided;
            return {
                ...rest
            }
        },
        multiValue: (provided: any) => {
            const {backgroundColor, ...rest} = provided;
            return {
                ...rest,
            };
        },
        multiValueLabel: (provided: any) => {
            const {color, ...rest} = provided;
            return {
                ...rest
            }
        },
        multiValueRemove: (provided: any) => {
            const {backgroundColor, ...rest} = provided;
            return {
                ...rest,
                ':hover': {},
            }
        },
        clearIndicator: (provided: any) => {
            const {color, ...rest} = provided;
            return {
                ...rest,
            }
        },
        dropdownIndicator: (provided: any, state: any) => {
            const {color, ...rest} = provided;
            return {
                ...rest,
                transition: 'transform 0.2s ease',
                transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }
        }
    };

    const dispatch = useAppDispatch();
    
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            value.trim().length > 0 
            &&  fetchAction
            &&  dispatch(fetchAction({ query: value, page: 0 }));
        }, 1000),
        [dispatch]
    );

    return (
        <div className="space-y-1">
            <Paragraph>{label ? label : null}</Paragraph>
            <Select
                options={options}
                components={{ Option: CustomOption, MultiValue: CustomMultiValue, SingleValue: CustomSingleValue }}
                value={value}
                onInputChange={debouncedSearch}
                onChange={onChange}
                styles={customStyles}
                isSearchable={isSearchable}
                isClearable={isClearable}
                isMulti={isMulti}
                placeholder={fetchAction ? 'Search ...' : placeholder}
                onBlur={onBlur}
                closeMenuOnSelect={!isMulti}
                isLoading={isLoading}
                loadingMessage={() => 'Loading ...'}
                noOptionsMessage={() => 'No option found.'}
                classNames={{
                    control: () => 'w-full  px-4 py-2 mt-1 outline-none transition',
                    menu: () => 'bg-light-component dark:bg-dark-component',
                    option: () => 'cursor-pointer px-3 py-2 rounded-lg text-light-primary dark:text-dark-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover',
                    multiValue: () => 'bg-light-sub-component dark:bg-dark-sub-component',
                    multiValueLabel: () => 'text-light-primary dark:text-dark-primary',
                    multiValueRemove: () => 'text-light-primary dark:text-dark-primary cursor-pointer hover:bg-light-component dark:hover:bg-dark-component',
                    placeholder: () => 'text-inherit',
                    input: () => 'text-light-primary dark:text-dark-primary',
                    singleValue: () => 'text-light-primary dark:text-dark-primary',
                    clearIndicator: () => 'text-light-primary dark:text-dark-primary cursor-pointer',
                    dropdownIndicator: () => 'text-light-primary dark:text-dark-primary cursor-pointer',
                }}
            />
            {error && <Paragraph intent="danger" size="sm">{error.message}</Paragraph>}
        </div>
    );
};
