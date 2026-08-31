'use client';

import Select, { StylesConfig } from 'react-select';
import { FormDropdownProps } from './types.forms';
import { useAppDispatch } from '@/lib/store/hooks';
import { useEffect, useId, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { CustomMultiValue, CustomOption, CustomSingleValue } from './CustomOption';
import { Option } from '@/features/types.features';

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
    const selectId = useId();
    const customStyles: StylesConfig<Option, boolean> = {
        control: (base) => ({
            ...base,
            backgroundColor: 'transparent',
        }),
        menu: (provided) => {
            return {
                ...provided,
                backgroundColor: 'transparent',
                zIndex: 10
            }
        },
        option: (provided, state) => {
            return {
                ...provided,
                cursor: 'pointer',
                backgroundColor: state.isSelected
                ? 'var(--ds-accent)'
                : ''
            }
        },
        input: (provided) => {
            return {
                ...provided,
                color: 'inherit',
            }
        },
        singleValue: (provided) => {
            return {
                ...provided,
                color: 'inherit',
            }
        },
        multiValue: (provided) => {
            return {
                ...provided,
                backgroundColor: 'transparent',
            };
        },
        multiValueLabel: (provided) => {
            return {
                ...provided,
                color: 'inherit',
            }
        },
        multiValueRemove: (provided) => {
            return {
                ...provided,
                backgroundColor: 'transparent',
                ':hover': {},
            }
        },
        clearIndicator: (provided) => {
            return {
                ...provided,
                color: 'inherit',
            }
        },
        dropdownIndicator: (provided, state) => {
            return {
                ...provided,
                color: 'inherit',
                transition: 'transform 0.2s ease',
                transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }
        }
    };

    const dispatch = useAppDispatch();
    
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            if (value.trim().length > 0 && fetchAction) {
                dispatch(fetchAction({ query: value, page: 0 }));
            }
        }, 1000),
        [dispatch, fetchAction]
    );

    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    return (
        <div className="space-y-1.5">
            {label ? <label htmlFor={selectId} className="text-sm font-semibold text-ink">{label}</label> : null}
            <Select
                inputId={selectId}
                instanceId={selectId}
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
                    control: (state) => `w-full min-h-11 px-2 mt-1 rounded-xl bg-surface-raised text-ink shadow-sm transition ${state.isFocused ? 'border-accent ring-2 ring-accent/15' : 'border-line'}`,
                    menu: () => 'bg-surface-raised text-ink',
                    option: () => 'cursor-pointer px-3 py-2 rounded-lg text-ink hover:bg-canvas-subtle',
                    multiValue: () => 'bg-accent-soft',
                    multiValueLabel: () => 'text-ink',
                    multiValueRemove: () => 'text-ink cursor-pointer hover:bg-surface',
                    placeholder: () => 'text-inherit',
                    input: () => 'text-ink',
                    singleValue: () => 'text-ink',
                    clearIndicator: () => 'text-ink-muted cursor-pointer',
                    dropdownIndicator: () => 'text-ink-muted cursor-pointer',
                }}
            />
            {error && <p role="alert" className="text-xs text-danger">{error.message}</p>}
        </div>
    );
};
