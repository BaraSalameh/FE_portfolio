# Chart preference backend contract

The frontend uses the existing user-preference endpoints for public default chart views. No new endpoint is required.

## Preference lookup records

Seed these names in `LKP_Preference` and return them from `GET /Owner/LKP_PreferenceList`:

- `default-overview-chart`: `comparison` or `composition`
- `default-education-chart`: `timeline` or `comparison`
- `default-experience-chart`: `timeline` or `comparison`
- `default-project-chart`: `comparison` or `composition`
- `default-skill-chart`: `matrix` or `comparison`
- `default-language-chart`: `comparison` or `profile`
- `default-certificate-chart`: `timeline` or `comparison`

`POST /Owner/EditUserPreference` continues to accept `{ LKP_PreferenceID, value }`. Saved values must be returned in both `GET /Owner/UserPreferenceList` and the public/owner dashboard `lstUserPreferences` payload.

Unknown values may remain stored for compatibility, but the frontend ignores them and uses the widget system default.

## Chart configuration lookups

`GET /Owner/LKP_WidgetList` must include `Overview`, `Education`, `Experience`, `Project`, `Skill`, `Language`, and `Certificate`. `GET /Owner/LKP_ChartTypeList` continues to include `Bar`, `Pie`, and `Radar`.

The existing `POST /Owner/EditUserChartPreference` contract remains `{ LKP_WidgetID, LKP_ChartTypeID, groupBy, valueSource }`. Timeline, matrix, comparison, composition, and profile are semantic frontend view names; they do not require new chart-type lookup records.

Deploy these lookup records before the frontend release. Until then, the affected settings controls show a compatibility notice and dashboard widgets use their system defaults.
