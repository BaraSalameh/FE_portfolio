import { Option } from '@/features/types.features';

export const mergeOptions = (fromEdit?: Option[], fromStore?: Option[]): Option[] => {
    const seen = new Set<string>();
    return [...(fromEdit ?? []), ...(fromStore ?? [])].filter(opt => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
    });
};