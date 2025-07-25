import { combineReducers } from "redux";
import authSlice from "@/features/account/slice";
import searchSlice from "@/features/home/search/slice";
import educationSlice from "@/features/dashboard/widgets/education/slice";
import profileSlice from "@/features/dashboard/profile/slice";
import experienceSlice from "@/features/dashboard/widgets/experience/slice";
import projectTechnologySlice from "@/features/dashboard/widgets/project/slice";
import userLanguageSlice from "@/features/dashboard/widgets/language/slice";
import contactMessageSlice from '@/features/dashboard/profile/contact-message/slice';
import userWidgetPreferenceSlice from "@/features/dashboard/profile/settings/widget-preferences/slice";
import userChartPreferenceSlice from "@/features/dashboard/profile/settings/chart-preferences/slice";
import userSkillSlice from "@/features/dashboard/widgets/skill/slice";

const rootReducer = combineReducers({
    auth: authSlice,
    search: searchSlice,
    profile: profileSlice,
    education: educationSlice,
    experience: experienceSlice,
    projectTechnology: projectTechnologySlice,
    userLanguage: userLanguageSlice,
    contactMessage: contactMessageSlice,
    userWidgetPreference: userWidgetPreferenceSlice,
    userChartPreference: userChartPreferenceSlice,
    userSkill: userSkillSlice
});

export default rootReducer;