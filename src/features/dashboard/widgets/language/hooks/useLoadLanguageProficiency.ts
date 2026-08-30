'use client';

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { languageProficiencyListQuery } from "../apis";
import { optionsCreator } from "@/lib/utils";

export const useLoadLanguageProficiency = () => {
    const dispatch = useAppDispatch();
    const { lstLanguageProficiencies } = useAppSelector(state => state.userLanguage.languageProficiency);

    useEffect(() => {
        if (lstLanguageProficiencies.length === 0) dispatch(languageProficiencyListQuery());
    }, [dispatch, lstLanguageProficiencies.length]);

    return optionsCreator({list: lstLanguageProficiencies, labelKey: 'level'})
}
