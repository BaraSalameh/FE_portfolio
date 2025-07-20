import { Option } from "@/features/types.features";
import { extractPathValue } from "@/lib/utils";

export const optionsCreator = ({list, labelKey = 'name', valueKey = 'id', iconKey}: {list: any; labelKey?: string | string[]; valueKey?: string; iconKey?: string}): Option[] => {
    const current = Array.isArray(list) ? list : [list];
    return list
    ?   current?.map((i: any) => ({
            label: extractPathValue(i, labelKey),
            value: extractPathValue(i, valueKey),
            icon: iconKey ? extractPathValue(i, iconKey) : undefined
        }))
    :   [];
}