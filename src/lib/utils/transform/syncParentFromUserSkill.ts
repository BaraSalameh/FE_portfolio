import { SkillFormData } from "@/features/dashboard/widgets/project/schema";
import { UserSkillResponse } from "@/features/dashboard/widgets/skill/types.skill";

type ParentEntity = { id: string; lstSkills?: SkillFormData[] };

type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> | undefined ? K : never;
}[keyof T];

export function syncParentFromUserSkill<
    TState extends Record<K, ParentEntity[]>,
    K extends ArrayKeys<UserSkillResponse> & keyof TState
>(
    state: TState,
    payload: UserSkillResponse[],
    listKey: K
) {
    state[listKey].forEach((entity, idx) => {
        const matchingSkills = payload
            .filter(us => us[listKey]?.some(e => e.id === entity.id))
            .map(us => us.skill);

        state[listKey][idx] = {
            ...entity,
            lstSkills: matchingSkills,
        };
    });
}
