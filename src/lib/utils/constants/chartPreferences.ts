export const chart_preferences = {
    key: {
        widget: {
            education: 'Education',
            experience: 'Experience',
            project: 'Project',
            language: 'Language'
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
                {label: 'Degree abbreviation', value: 'degree.abbreviation'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
            ],
            pie: [
                {label: 'Degree name', value: 'degree.name'},
                {label: 'Degree abbreviation', value: 'degree.abbreviation'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
            ],
            radar: [
                {label: 'Degree name', value: 'degree.name'},
                {label: 'Degree abbreviation', value: 'degree.abbreviation'},
                {label: 'Field of study', value: 'fieldOfStudy.name'},
            ]
        },
        experience: {
            bar: [
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Company name', value: 'companyName'},
                {label: 'Location', value: 'location'},
            ],
            pie: [
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Company name', value: 'companyName'},
                {label: 'Location', value: 'location'},
            ],
            radar: [
                {label: 'Job title', value: 'jobTitle'},
                {label: 'Company name', value: 'companyName'},
                {label: 'Location', value: 'location'}
            ]
        },
        project: {
            bar: [
                {label: 'Title', value: 'title'},
                {label: 'Featured?', value: 'isFeatured'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Technologies', value: 'lstTechnologies.name'}
            ],
            pie: [
                {label: 'Title', value: 'title'},
                {label: 'Featured?', value: 'isFeatured'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Technologies', value: 'lstTechnologies.name'}
            ],
            radar: [
                {label: 'Title', value: 'title'},
                {label: 'Featured?', value: 'isFeatured'},
                {label: 'Experience', value: 'experience.companyName'},
                {label: 'Education', value: 'education.institution.name'},
                {label: 'Technologies', value: 'lstTechnologies.name'}
            ]
        }
    }
};