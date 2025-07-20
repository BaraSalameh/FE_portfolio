import { ChartTypeFormData, UserChartPreferenceFormData, WidgetFormData } from "@/features/dashboard/profile/settings/chart-preferences/schema";
import { UserChartPreferenceKeys, UserChartPreferenceValues } from "@/features/dashboard/profile/settings/chart-preferences/types.chart-preferences";

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