export const chart_preferences = {
    key: {
        widget: {
            overview: 'Overview',
            education: 'Education',
            experience: 'Experience',
            project: 'Project',
            skill: 'Skill',
            language: 'Language',
            certificate: 'Certificate'
        },
        chart: {
            bar: 'Bar',
            pie: 'Pie',
            radar: 'Radar'
        }
    },
    values: {
        education: {
            bar: [
                {label: 'Degree name', value: 'degree.name'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
                {label: 'Institution', value: 'institution.name'},
            ],
            pie: [
                {label: 'Degree name', value: 'degree.name'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
                {label: 'Institution', value: 'institution.name'},
            ],
            radar: [
                {label: 'Degree name', value: 'degree.name'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
                {label: 'Institution', value: 'institution.name'},
            ]
        },
        experience: {
            bar: [
                {label: 'Company name', value: 'companyName'},
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Location', value: 'location'},
            ],
            pie: [
                {label: 'Company name', value: 'companyName'},
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Location', value: 'location'},
            ],
            radar: [
                {label: 'Company name', value: 'companyName'},
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Location', value: 'location'}
            ]
        },
        project: {
            bar: [
                {label: 'Technology or skill', value: 'lstSkills.name'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Featured status', value: 'isFeatured'}
            ],
            pie: [
                {label: 'Technology or skill', value: 'lstSkills.name'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Featured status', value: 'isFeatured'}
            ],
            radar: [
                {label: 'Technology or skill', value: 'lstSkills.name'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Featured status', value: 'isFeatured'}
            ]
        },
        skill: {
            pie: [{label: 'Evidence source', value: 'evidenceSource'}]
        },
        certificate: {
            pie: [
                {label: 'Credential', value: 'certificate.name'},
                {label: 'Associated skill', value: 'lstSkills.name'}
            ]
        }
    }
};
