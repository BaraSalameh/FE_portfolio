import { SkillFormData } from "@/features/dashboard/widgets/skill/schema";
import { SkillMap, UserSkillState } from "@/features/dashboard/widgets/skill/types.skill";

export const syncUserSkillsFromParentList = <T extends { id: string; lstSkills?: SkillFormData[] }> (
    parentList: T[],
    state: UserSkillState,
    getInstitution: (parent: T) => any,            // how to extract institution-like info
    setParentField: keyof typeof state.lstUserSkills[number] // e.g. "lstEducations" or "lstCertificates"
) => {
    // Build map: skillId → list of related parents
    const skillIdToParents: SkillMap = {};

    parentList.forEach(parent => {
        parent.lstSkills?.forEach(skill => {
            if (!skillIdToParents[skill.id]) {
                skillIdToParents[skill.id] = [];
            }
            skillIdToParents[skill.id].push({
                id: parent.id,
                prop: getInstitution(parent),
                skill
            });
        });
    });

    // Track existing skill IDs
    const existingSkillIds = new Set(state.lstUserSkills.map(us => us.skill.id));

    // Update existing skills
    state.lstUserSkills = state.lstUserSkills.map(us => {
        const skillId = us.skill.id;
        if (skillIdToParents[skillId]) {
            return {
                ...us,
                [setParentField]: skillIdToParents[skillId].map(e => ({
                    id: e.id,
                    prop: e.prop
                }))
            };
        } else {
            return {
                ...us,
                [setParentField]: []
            };
        }
    });

    // Add new skills
    Object.entries(skillIdToParents).forEach(([skillId, parentList]) => {
        if (!existingSkillIds.has(skillId)) {
            state.lstUserSkills.push({
                skill: parentList[0].skill,
                [setParentField]: parentList.map(e => ({
                    id: e.id,
                    prop: e.prop
                }))
            });
        }
    });
}