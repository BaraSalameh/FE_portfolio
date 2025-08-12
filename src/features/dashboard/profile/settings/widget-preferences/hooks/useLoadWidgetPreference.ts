import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react"
import { widgetPreferenceListQuery } from "../apis";

export const useLoadWidgetPreference = () => {
    const dispatch = useAppDispatch();
    const { lstPreferences } = useAppSelector((state) => state.userWidgetPreference.preference);

    useEffect(() => {
        lstPreferences.length === 0 && dispatch(widgetPreferenceListQuery());
    }, []);
}