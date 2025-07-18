"use client";

import dayjs from 'dayjs';
import {
    Home, LayoutDashboard, Book, Briefcase, Folder, BadgePercent,
    Languages, PenSquare, MessageSquare, Settings, LogOut
} from 'lucide-react';
import { PREFERENCES } from '../constants';
import { useParams } from 'next/navigation';
import { UserLanguageFormData } from '@/features/dashboard/widgets/language/schema';
import { EducationFormData } from '@/features/dashboard/widgets/education/schema';
import { Option } from '@/features/types'
import { UserWidgetPreferenceFormData } from '@/features/dashboard/profile/settings/widget-preferences/schema';
import { UserChartPreferenceKeys, UserChartPreferenceValues } from '@/features/dashboard/profile/settings/chart-preferences/types';
import { ChartTypeFormData, UserChartPreferenceFormData, WidgetFormData } from '@/features/dashboard/profile/settings/chart-preferences/schema';

export function transformPayload<T extends object>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => 
            [key, value === '' ? null : value]
        )
    ) as T;
};

const normalizeFieldValue = (value: any): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value) return [value];
    return [];
};


export const generatePieData = <T extends Record<string, any>>(
    list: T[],
    key?: string | string[]
) => {
    const counts = new Map<string, number>();

    list.forEach(item => {
        const names = normalizeFieldValue(extractPathValue(item, key ?? ''));

        names.forEach(name => {
            counts.set(name, (counts.get(name) ?? 0) + 1);
        });
    });

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
};



export const generateDurationData = <T extends Record<string, any>>(
    list: T[],
    nameKey?: string | string[],
    startDateKey: keyof T = 'startDate',
    endDateKey: keyof T = 'endDate',
    unit: dayjs.ManipulateType = 'month'
): { name: string; value: number }[] => {
    const durations = new Map<string, number>();

    list.forEach(item => {
        const start = item[startDateKey] ? dayjs(item[startDateKey]) : null;
        const end = item[endDateKey] ? dayjs(item[endDateKey]) : dayjs();
        const value = start ? end.diff(start, unit) : null;

        const names = normalizeFieldValue(extractPathValue(item, nameKey ?? '')) || ['Unknown'];

        names.forEach(name => {
            const total = durations.get(name) ?? 0;
            durations.set(name, total + (value !== null ? value : 1));
        });
    });

    return Array.from(durations.entries()).map(([name, value]) => ({ name, value }));
};


export const generateColorMap = (
    data: { name: string }[],
    colors: string[] = ['#F97316', '#3B82F6', '#10B981', '#EAB308', '#6366F1']
): Record<string, string> => {
    return data.reduce((acc, item, index) => {
        acc[item.name] = colors[index % colors.length];
        return acc;
    }, {} as Record<string, string>);
};

export const extractPathValue = (
    item: any,
    path: string | string[]
): any => {
    const paths = Array.isArray(path) ? path : [path];

    for (const singlePath of paths) {
        const keys = singlePath.split('.');
        let current = item;

        for (let i = 0; i < keys.length; i++) {
            if (Array.isArray(current)) {
                const restPath = keys.slice(i).join('.');
                const arrayResult = current
                    .map(child => extractPathValue(child, restPath))
                    .filter(Boolean);
                if (arrayResult) return arrayResult;
                return undefined; // no need to continue this path
            }

            current = current?.[keys[i]];
        }

        if (current !== undefined && current !== null && current !== '') {
            return current;
        }
    }

    return undefined;
};

export const mapEducationToForm = (educationFromDb: any): EducationFormData => {
    const result = educationFromDb
        ?   {
                ...educationFromDb,
                startDate: educationFromDb.startDate?.slice(0, 10),
                endDate: educationFromDb.endDate?.slice(0, 10),
                LKP_InstitutionID: educationFromDb.institution?.id ?? '',
                LKP_DegreeID: educationFromDb.degree?.id ?? '',
                LKP_FieldOfStudyID: educationFromDb.fieldOfStudy?.id ?? '',
            }
        : null;
    return result;
};

export const mapUserLanguageToForm = (userLanguageFromDb: any): UserLanguageFormData => {
    const userLanguageDto = {
        lstLanguages: userLanguageFromDb.map((ul: Record<string, Record<string, string>>) => ({
            lkP_LanguageID: ul.language.id,
            lkP_LanguageProficiencyID: ul.languageProficiency.id
        }))
    };
    return userLanguageDto;
};

export const mapProjectTechnologyToForm = (projectTechnologyFromDb: any): EducationFormData => {
    const result = projectTechnologyFromDb
        ?   {
                ...projectTechnologyFromDb,
                EducationID: projectTechnologyFromDb?.education?.id,
                ExperienceID: projectTechnologyFromDb?.experience?.id,
                lstTechnologies: projectTechnologyFromDb.lstTechnologies?.map(
                    (pt: any) => pt.id
                ) ?? []
            }
        : null;
    return result;
};

export const mapPreferenceToForm = (
    oldUserPreferences: any[],
    preferenceKey: string,
    preferences: any[],
    preferenceValue: Option[]
): UserWidgetPreferenceFormData => {
    const userOption = oldUserPreferences.find(item => item?.preference?.name === preferenceKey);
    const defaultOption = preferences.find(opt => opt.name === preferenceKey);
    const defaultValue = preferenceValue?.[0];

    return {
        LKP_PreferenceID: defaultOption?.id,
        value: userOption?.value ?? defaultValue?.value
    };
}

export const mapChartPreferenceToForm = (
    UserChartPreferences: any[],
    Keys: UserChartPreferenceKeys,
    widgets: WidgetFormData[],
    chartTypes: ChartTypeFormData[],
    Values: UserChartPreferenceValues
): UserChartPreferenceFormData => {
    const userOption = UserChartPreferences.find(item => item?.widget?.name === Keys.widget && item?.chartType?.name === Keys.chartType);
    const defaultWidgetOption = widgets.find(opt => opt.name === Keys.widget);
    const defaultChartTypeOption = chartTypes.find(opt => opt.name === Keys.chartType);
    const defaultGroupByValue = Values.groupBy[0];
    const defaultValueSourceValue = Values.valueSource[0];

    return {
        LKP_WidgetID: defaultWidgetOption?.id ?? '',
        LKP_ChartTypeID: defaultChartTypeOption?.id ?? '',
        groupBy: userOption?.groupBy ?? defaultGroupByValue?.value,
        valueSource: userOption?.valueSource ?? defaultValueSourceValue?.value
    };
}

export const getSelectedOption = (
    options: Option[],
    value: string | string[] | undefined
) => {
    if (!value) return Array.isArray(value) ? [] : undefined;

    return Array.isArray(value)
        ? options.filter(opt => value.includes(opt.value))
        : options.find(opt => opt.value === value);
};


export const getNavLinks = (username?: string | undefined, role?: 'owner' | 'client' | 'admin' ) => {
    if (!username) return [{ href: '/', label: 'Home', icon: Home }];

    if (role === 'client' || !role) return [
        { href: '/', label: 'Home', icon: Home },
        { href: `/client/${username}/dashboard`, label: 'Dashboard', icon: LayoutDashboard }
    ];

    if (role === 'owner') return [
        { href: '/', label: 'Home', icon: Home },
        { href: `/owner/${username}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `/owner/${username}/education`, label: 'Education', icon: Book },
        { href: `/owner/${username}/experience`, label: 'Experience', icon: Briefcase },
        { href: `/owner/${username}/project`, label: 'Projects', icon: Folder },
        { href: `/owner/${username}/skill`, label: 'Skills', icon: BadgePercent },
        { href: `/owner/${username}/language`, label: 'Languages', icon: Languages },
        { href: `/owner/${username}/blog-post`, label: 'Blog Post', icon: PenSquare },
        { href: `/owner/${username}/message`, label: 'Messages', icon: MessageSquare },
        { href: `/owner/${username}/setting`, label: 'Settings', icon: Settings },
        { href: `/owner/${username}/logout`, label: 'Logout', icon: LogOut },
    ];

    return [{ href: '/', label: 'Home', icon: Home }];
}

export const getClientLink = (): Record<string, string> | null => {
    if (typeof window === 'undefined') return null;

    const { origin, pathname } = window.location;
    const parts = pathname.split('/');

    if (parts.length > 1) {
        parts[1] = 'client';
    }

    const modifiedPath = parts.join('/');
    return {
        fullPath: `${origin}${modifiedPath}`,
        shortPath: modifiedPath
    }
};

export const mergeOptions = (fromEdit?: Option[], fromStore?: Option[]): Option[] => {
    const seen = new Set<string>();
    return [...(fromEdit ?? []), ...(fromStore ?? [])].filter(opt => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
    });
};

export const OptionsCreator = ({list, labelKey = 'name', valueKey = 'id', iconKey}: {list: any; labelKey?: string | string[]; valueKey?: string; iconKey?: string}): Option[] => {
    const current = Array.isArray(list) ? list : [list];
    return list
    ?   current?.map((i: any) => ({
            label: extractPathValue(i, labelKey),
            value: extractPathValue(i, valueKey),
            icon: iconKey ? extractPathValue(i, iconKey) : undefined
        }))
    :   [];
}

export const CheckPreferences = (list: UserWidgetPreferenceFormData[], key: string, flag: string = PREFERENCES.VALUE.TOGGLE[0].value) => {
    const pref = list.find((cfg: any) => cfg.preference.name === key);
    
    return !pref ? true : flag ? pref?.value === flag : pref.value;
}

export const CheckChartPreferences = (list: UserChartPreferenceFormData[], keys: UserChartPreferenceKeys) => {
    const pref = list.find((cfg: any) => cfg.widget.name === keys.widget && cfg.chartType.name === keys.chartType);
    
    return pref;
}

export const getUrlParams = () => {
    const { role, username } = useParams<{role: 'owner' | 'client' | 'admin', username: string }>();
    return {
        role,
        username
    };
}