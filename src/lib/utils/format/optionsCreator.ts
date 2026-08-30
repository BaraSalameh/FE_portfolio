import { Option } from "@/features/types.features";
import { extractPathValue } from "@/lib/utils";

export const optionsCreator = ({list, labelKey = 'name', valueKey = 'id', iconKey}: {list: unknown; labelKey?: string | string[]; valueKey?: string; iconKey?: string}): Option[] => {
    const current = Array.isArray(list) ? list : [list];
    return list
    ?   current.map((item) => {
            const icon = iconKey ? extractPathValue(item, iconKey) : undefined;
            return {
                label: String(extractPathValue(item, labelKey) ?? ''),
                value: String(extractPathValue(item, valueKey) ?? ''),
                icon: icon == null ? undefined : String(icon),
            };
        })
    :   [];
}
