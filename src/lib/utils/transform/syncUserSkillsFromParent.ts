import { SkillFormData } from '@/features/dashboard/widgets/skill/schema';
import { UserSkillResponse, UserSkillState } from '@/features/dashboard/widgets/skill/types.skill';

export const syncUserSkillsFromParent = <T extends { id: string; lstSkills?: SkillFormData[] }>(
    parent: T,
    state: UserSkillState,
    getParent: (parent: T) => unknown,
    parentField: keyof UserSkillResponse,
) => {
    const linkedSkillIds = new Set(parent.lstSkills?.map(skill => skill.id) ?? []);
    const parentValue = { id: parent.id, prop: getParent(parent) };

    state.lstUserSkills.forEach(userSkill => {
        const existingParents = userSkill[parentField];
        const withoutSavedParent = Array.isArray(existingParents)
            ? existingParents.filter(item => item.id !== parent.id)
            : [];
        userSkill[parentField] = (
            linkedSkillIds.has(userSkill.skill.id)
                ? [...withoutSavedParent, parentValue]
                : withoutSavedParent
        ) as never;
    });

    parent.lstSkills?.forEach(skill => {
        if (state.lstUserSkills.some(userSkill => userSkill.skill.id === skill.id)) return;
        state.lstUserSkills.push({ skill, [parentField]: [parentValue] });
    });
};
