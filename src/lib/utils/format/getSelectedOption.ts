import { Option } from '@/features/types.features';

export const getSelectedOption = (
    options: Option[],
    value: string | string[] | undefined
) => {
    if (!value) return Array.isArray(value) ? [] : undefined;

    return Array.isArray(value)
        ? options.filter(opt => value.includes(opt.value))
        : options.find(opt => opt.value === value);
}