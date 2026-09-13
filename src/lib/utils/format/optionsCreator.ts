import { Option } from "@/features/types.features";
import { extractPathValue } from "@/lib/utils";

export const optionsCreator = ({list, labelKey = 'name', valueKey = 'id', iconKey, badgeKey, descriptionKey}: {list: unknown; labelKey?: string | string[]; valueKey?: string; iconKey?: string; badgeKey?: string; descriptionKey?: string}): Option[] => {
    const current = Array.isArray(list) ? list : [list];
    return list
    ?   current.map((item) => {
            const icon = iconKey ? extractPathValue(item, iconKey) : undefined;
            const badge = badgeKey ? extractPathValue(item, badgeKey) : undefined;
            const description = descriptionKey ? extractPathValue(item, descriptionKey) : undefined;
            return {
                label: String(extractPathValue(item, labelKey) ?? ''),
                value: String(extractPathValue(item, valueKey) ?? ''),
                icon: icon == null ? undefined : String(icon),
                badge: badge == null ? undefined : String(badge),
                description: description == null ? undefined : String(description),
            };
        })
    :   [];
}
