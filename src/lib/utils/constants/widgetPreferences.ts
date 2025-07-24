export const widget_preferences = {
    key: {
        // profile
        profile_width: 'profile-width',
        profile_picture_position: 'profile-picture-position',
        show_gender: 'show-gender',
        show_email_address: 'show-email-address',
        birthdate_format: 'birthdate-format',
        show_birthdate: 'show-birthdate',
        show_phone_number: 'show-phone-number',

        // education widget
        show_education_bar_chart: 'show-education-bar-chart',
        show_education_pie_chart: 'show-education-pie-chart',
        show_education_radar_chart: 'show-education-radar-chart',

        // experience widget
        show_experience_bar_chart: 'show-experience-bar-chart',
        show_experience_pie_chart: 'show-experience-pie-chart',
        show_experience_radar_chart: 'show-experience-radar-chart',

        // language widget
        show_language_bar_chart: 'show-language-bar-chart',
        show_language_pie_chart: 'show-language-pie-chart',
        show_language_radar_chart: 'show-language-radar-chart',

        // project widget
        show_project_widget: 'show-project-widget',
        show_project_bar_chart: 'show-project-bar-chart',
        show_project_pie_chart: 'show-project-pie-chart',
        show_project_radar_chart: 'show-project-radar-chart',

        // overview widget
        show_overview_widget: 'show-overview-widget',
        show_overview_bar_chart: 'show-overview-bar-chart',
        show_overview_pie_chart: 'show-overview-pie-chart',
        show_overview_radar_chart: 'show-overview-radar-chart',

        // skill widget
        show_skill_widget: 'show-skill-widget',
        show_skill_bar_chart: 'show-skill-bar-chart',
        show_skill_pie_chart: 'show-skill-pie-chart',
        show_skill_radar_chart: 'show-skill-radar-chart',
    },
    value: {
        toggle: [
            {label: 'Show', value: 'show'},
            {label: 'Hide', value: 'hide'}
        ],
        custom: {
            position: [
                {label: 'Center', value: 'center'},
                {label: 'Right', value: 'right'},
                {label: 'Left', value: 'left'}
            ]
        }
    }
}