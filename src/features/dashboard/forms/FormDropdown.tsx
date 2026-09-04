'use client';

import { useCallback, useEffect, useId, useMemo } from 'react';
import Select, { type InputActionMeta, type StylesConfig } from 'react-select';
import debounce from 'lodash.debounce';
import { useAppDispatch } from '@/lib/store/hooks';
import { CustomMultiValue, CustomOption, CustomSingleValue } from './CustomOption';
import type { Option } from '@/features/types.features';
import type { FormDropdownProps } from './types.forms';

export const FormDropdown = ({
    label,
    ariaLabel,
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
    fetchAction,
}: FormDropdownProps) => {
    const selectId = useId();
    const errorId = `${selectId}-error`;
    const dispatch = useAppDispatch();

    const debouncedSearch = useMemo(
        () => debounce((query: string) => {
            if (fetchAction) {
                dispatch(fetchAction({ query, page: 0 }));
            }
        }, 1000),
        [dispatch, fetchAction],
    );

    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    const handleInputChange = useCallback((inputValue: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action !== 'input-change') return;

        const query = inputValue.trim();
        if (query.length > 0) {
            debouncedSearch(query);
        } else {
            debouncedSearch.cancel();
        }
    }, [debouncedSearch]);

    const customStyles = useMemo<StylesConfig<Option, boolean>>(() => ({
        control: (base, state) => ({
            ...base,
            minHeight: '2.75rem',
            backgroundColor: 'var(--ds-surface-raised)',
            borderColor: error
                ? 'var(--color-danger)'
                : state.isFocused ? 'var(--ds-accent)' : 'var(--ds-line)',
            boxShadow: state.isFocused ? '0 0 0 3px color-mix(in srgb, var(--ds-accent) 15%, transparent)' : 'none',
            cursor: 'text',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            ':hover': {
                borderColor: error ? 'var(--color-danger)' : 'var(--ds-accent)',
            },
        }),
        menu: (base) => ({
            ...base,
            overflow: 'hidden',
            backgroundColor: 'var(--ds-surface-raised)',
            border: '1px solid var(--ds-line)',
            borderRadius: '0.75rem',
            boxShadow: '0 18px 45px -20px rgb(0 0 0 / 35%)',
            zIndex: 30,
        }),
        menuList: (base) => ({ ...base, padding: '0.375rem' }),
        option: (base, state) => ({
            ...base,
            borderRadius: '0.5rem',
            color: state.isSelected ? 'white' : 'var(--ds-ink)',
            backgroundColor: state.isSelected
                ? 'var(--ds-accent)'
                : state.isFocused ? 'var(--ds-canvas-subtle)' : 'transparent',
            cursor: 'pointer',
            ':active': {
                backgroundColor: state.isSelected ? 'var(--ds-accent-strong)' : 'var(--ds-accent-soft)',
            },
        }),
        input: (base) => ({ ...base, color: 'var(--ds-ink)' }),
        singleValue: (base) => ({ ...base, color: 'var(--ds-ink)' }),
        placeholder: (base) => ({ ...base, color: 'var(--ds-ink-muted)' }),
        multiValue: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            backgroundColor: 'var(--ds-accent-soft)',
        }),
        multiValueLabel: (base) => ({ ...base, color: 'var(--ds-ink)', fontWeight: 600 }),
        multiValueRemove: (base) => ({
            ...base,
            borderRadius: '0 0.5rem 0.5rem 0',
            color: 'var(--ds-ink-muted)',
            ':hover': {
                color: 'var(--color-danger)',
                backgroundColor: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: 'var(--ds-ink-muted)',
            cursor: 'pointer',
            ':hover': { color: 'var(--color-danger)' },
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: 'var(--ds-ink-muted)',
            cursor: 'pointer',
            transition: 'color 150ms ease, transform 200ms ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            ':hover': { color: 'var(--ds-ink)' },
        }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--ds-line)' }),
        loadingIndicator: (base) => ({ ...base, color: 'var(--ds-accent)' }),
        noOptionsMessage: (base) => ({ ...base, color: 'var(--ds-ink-muted)' }),
        loadingMessage: (base) => ({ ...base, color: 'var(--ds-ink-muted)' }),
    }), [error]);

    return (
        <div className="space-y-1.5">
            {label ? <label htmlFor={selectId} className="text-sm font-semibold text-ink">{label}</label> : null}
            <Select
                inputId={selectId}
                instanceId={selectId}
                aria-label={ariaLabel ?? label}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                options={options}
                components={{ Option: CustomOption, MultiValue: CustomMultiValue, SingleValue: CustomSingleValue }}
                value={value}
                onInputChange={handleInputChange}
                onChange={onChange}
                onBlur={onBlur}
                styles={customStyles}
                isSearchable={isSearchable}
                isClearable={isClearable}
                isMulti={isMulti}
                isLoading={isLoading}
                placeholder={fetchAction ? 'Search...' : placeholder}
                closeMenuOnSelect={!isMulti}
                loadingMessage={() => 'Loading...'}
                noOptionsMessage={({ inputValue }) => inputValue ? 'No matching options.' : 'No options available.'}
                className="mt-1 text-sm text-ink"
                classNamePrefix="form-dropdown"
            />
            {error ? <p id={errorId} role="alert" className="text-xs text-danger">{error.message}</p> : null}
        </div>
    );
};
