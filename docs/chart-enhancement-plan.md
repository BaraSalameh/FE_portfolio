# Chart enhancement plan

Status: Approved  
Approved: 2026-09-16  
Scope: Dashboard charts and their owner-facing preferences

## Implementation status

Implemented in the frontend on 2026-09-16:

- typed measures, units, metadata, stable ordering, category limits, and honest missing-date handling;
- KPI Overview, responsive comparison bars, composition donuts, guided primary/alternative view switching, and normalized language radar;
- Experience, Education, and Certificate timelines plus the Skills evidence matrix;
- theme-aware stable chart colors, richer tooltips, persistent values, reduced-motion-safe rendering, accessible tables, and keyboard-operable view controls;
- responsive single-view layout replacing the fixed three-chart grid;
- valid owner-facing visualization names and compatibility mapping from existing preference keys and GUID-backed chart types;
- Playwright coverage for guided views, data-table access, and 320 px overflow behavior.

The coordinated backend schema migration in R3 is intentionally not represented as complete because this repository contains only the frontend/API proxy. The frontend is migration-ready and continues to read existing preferences; adding Timeline and Matrix lookup records and replacing legacy preference keys requires the separate backend service.

## Goal

Make every visualization answer a clear portfolio question, remain readable on all supported viewport sizes and themes, expose its meaning accessibly, and avoid misleading chart/measure combinations.

## Current-state findings

- The dashboard uses Recharts 2.15 with shared bar, pie, and radar components.
- Chart code is dynamically imported by `DashboardWidget`, which is appropriate for the installed Next.js 16 application.
- A widget can render all three chart types simultaneously. The layout uses fixed `h-64` panels and often forces a three-column grid.
- `ChartEntry` contains only `name` and `value`; units, measures, descriptions, formatting, ordering, and source metadata are implicit.
- Bar and radar data commonly use `generateDurationData`. When dates are absent, that utility adds `1`, which can turn a duration chart into an undocumented count chart.
- Pie data is categorical count data. Pie labels currently expose raw values without a designed legend or percentage treatment.
- The five hard-coded colors are not derived from theme tokens and repeat by array position, so a category's color can change after sorting or filtering.
- Chart visibility and chart configuration are separate. Visibility uses individual widget-preference keys, while chart types are backend lookup records referenced by GUID.
- Owner chart settings currently support `groupBy` and `valueSource` for Education, Experience, and Projects.

## Product decisions

The recommended target is **guided customization**:

- The system provides an analytically correct default for each widget.
- Owners may choose only meaningful alternatives for that widget.
- A widget has one primary visualization and, at most, one switchable alternative.
- KPI cards are supporting content and do not count as a chart.
- Arbitrary chart/measure combinations, freeform resizing, and palette editors are out of scope.

### Widget visualization map

| Widget | Default | Valid alternative | Retire |
| --- | --- | --- | --- |
| Overview | KPI cards and compact horizontal bars | Donut for composition | Radar |
| Experience | Career timeline/range bars | Duration bars | Pie and radar |
| Education | Education timeline/range bars | Duration bars | Pie and radar |
| Projects | Technology-frequency bars | Technology donut | Radar |
| Skills | Evidence matrix | Stacked evidence bars | Pie and radar |
| Languages | Horizontal proficiency bars | Normalized radar | Pie |
| Certificates | Issuance timeline | Provider/category bars | Radar; pie by default |

Radar remains valid only when every axis uses the same bounded scale, there are approximately three to eight axes, and axis order is intentional. Donuts are valid only for part-to-whole data with a small category count.

## Chart behavior

### Bars

- Use horizontal bars for long category labels and vertical bars only for short ordered categories.
- Start quantitative axes at zero, sort comparisons by value descending, and show formatted values.
- Default to the top eight categories and group the remainder as `Other` or provide a show-all control.
- Use one accent color for a single series; categorical color is used only when category identity matters.

### Donuts

- Limit visible slices to five, combine smaller categories as `Other`, and show the total in the center.
- Provide category, count, and percentage in tooltips and in the accessible table.
- Prefer an adjacent desktop legend and a below-chart mobile legend.

### Timelines

- Show start, end, ongoing status, duration, and overlaps.
- Order chronologically and calculate ongoing entries against the current date.
- Grow by row count up to a maximum height, then offer expansion rather than compressing rows.

### Evidence matrix

- Use skills as rows and Projects, Experience, Education, and Certificates as columns.
- Expose both presence and evidence counts; never depend on color alone.

## Configuration and data contracts

Replace implicit chart behavior with an explicit discriminated configuration. The exact TypeScript shape can evolve during implementation, but it must represent:

- chart type;
- title and optional description;
- grouping dimension;
- measure (`count`, `duration`, `percentage`, `proficiency`, or `evidence`);
- unit and value formatter;
- ordering and maximum categories;
- orientation, size, labels, and legend behavior;
- empty-state copy and accessible summary.

Aggregation must use separate, testable operations such as `countBy`, `sumDurationBy`, `percentageBy`, `proficiencyBy`, `evidenceBySkill`, and `timelineRanges`. No utility may silently substitute counts for missing durations.

Data-policy decisions required during implementation:

- ongoing entries calculate through today;
- missing dates remain unknown rather than becoming one month;
- overlapping roles are shown independently and are not silently de-duplicated;
- technology counts default to once per project;
- unknown categories are explicitly labelled;
- equal values receive a stable secondary alphabetical sort.

## Shared chart frame

Every chart is rendered inside a common frame containing:

- semantic title and optional one-line explanation;
- concise insight or data-scope text, such as `Based on 12 projects`;
- optional chart-view, measure, grouping, and show-all controls;
- visualization region with a stable loading skeleton;
- accessible data-table alternative;
- empty and invalid-data states.

Generic titles such as `Distribution` are not allowed. Titles must name both the measure and dimension, for example `Experience duration by company`.

## Layout and responsive rules

- One primary chart occupies the full widget width.
- Two views use a segmented switch instead of simultaneous narrow charts.
- Standard charts target 300–360 px height; compact visualizations target 220–280 px.
- Timeline and matrix height derive from row count rather than a global fixed height.
- Mobile is always one column; legends move below charts and bar charts become horizontal.
- Charts must work at 320 px without horizontal page overflow.
- Container-driven styles are preferred to multiple JavaScript viewport queries.
- Size variants are `compact`, `standard`, and `wide`; they describe intent rather than fixed pixels.

## Color and theming

- Add chart tokens to the design system for categorical, sequential, neutral, grid, axis, and focus colors.
- Provide light- and dark-theme values with WCAG-aware contrast.
- Build stable categorical assignment from category identifiers, not current array indices.
- Use semantic colors only for semantic states such as active, expired, featured, warning, or failure.
- A single-series comparison uses neutral marks plus the product accent for emphasis.
- Important distinctions also receive text, position, iconography, or pattern; color is never the sole carrier.

## Interaction

Initial release:

- informative tooltips with unit and context;
- visible value labels where they fit;
- top-N/show-all;
- keyboard-operable legend filtering for multi-series views;
- chart-to-list highlighting when a category is selected;
- accessible table toggle;
- owner selection of permitted grouping and measure.

Deferred unless evidence demonstrates a need:

- zoom and pan;
- drag-resizing;
- arbitrary chart selection;
- custom palettes;
- image export;
- animation controls.

## Accessibility requirements

- Each chart uses a labelled `figure` or equivalent region with a useful `figcaption`.
- A screen-reader-accessible tabular representation contains the plotted values.
- A short text summary communicates the primary insight without requiring SVG interpretation.
- Interactive controls and legends are keyboard accessible and have visible focus.
- Tooltip-only information is available through focus or persistent text/table content.
- Chart distinctions pass contrast checks in both themes and do not rely only on color.
- Animation respects `prefers-reduced-motion`.
- Numeric values, dates, percentages, and durations use locale-aware formatting.

## Performance requirements

- Preserve top-level dynamic loading of the client chart bundle.
- Render only the selected chart view; hidden alternatives must not mount.
- Memoize aggregation from source data plus configuration.
- Cap visible SVG categories and provide an alternate expanded/table view.
- Disable or simplify animation for large datasets and reduced-motion users.
- Prefer CSS/container responsiveness over JavaScript media-query subscriptions.
- Measure chart-bundle impact and dashboard interaction latency before and after migration.

## Preference and API migration

Use two stages to avoid breaking GUID-backed chart preferences.

### Stage 1: compatible frontend improvement

- Treat existing Bar as an adaptive bar family.
- Render eligible Pie configurations as donuts.
- Restrict invalid Radar configurations and provide a documented fallback.
- Add KPI cards outside the chart-type lookup.
- Introduce explicit measure/unit metadata in frontend configuration.
- Keep reading existing visibility and grouping preferences.

### Stage 2: coordinated schema migration

- Add Timeline and Matrix chart-type lookup records.
- Replace per-chart visibility keys with a scalable per-widget presentation configuration.
- Store selected primary/alternative view, grouping, measure, and display options.
- Migrate existing saved preferences and retain a temporary read fallback.
- Remove obsolete radar and pie preference combinations only after migration is verified.

## Delivery phases

1. Correct aggregation semantics and add unit tests.
2. Introduce the typed configuration, formatting utilities, and shared chart frame.
3. Rebuild bars, donuts, tooltips, colors, labels, and accessible tables.
4. Replace the fixed chart grid with primary/alternative responsive presentation.
5. Add KPI Overview, Experience/Education timelines, and the Skills evidence matrix.
6. Update owner settings and perform the backend preference migration.
7. Add component, accessibility, responsive, visual-regression, and end-to-end coverage.
8. Profile bundle size and runtime behavior, then remove compatibility code.

## Priority and effort matrix

| Initiative | User value | Effort | Dependency | Release |
| --- | --- | --- | --- | --- |
| Correct count/duration aggregation | Critical | Medium | None | R1 |
| Explicit measure, unit, and formatter metadata | Critical | Medium | Aggregation rules | R1 |
| Shared chart frame and accessible table | High | Medium | Metadata contract | R1 |
| Responsive horizontal bars | High | Medium | Shared frame | R1 |
| Donut treatment for valid pie data | Medium | Low | Shared frame | R1 |
| Stable theme-aware chart colors | High | Medium | Design tokens | R1 |
| Primary/alternative chart switch | High | Medium | Chart configuration | R1 |
| KPI Overview | High | Low | Correct counts | R1 |
| Experience and Education timelines | High | High | Range aggregation | R2 |
| Skill evidence matrix | High | High | Evidence aggregation | R2 |
| Certificate timeline | Medium | Medium | Range aggregation | R2 |
| Linked chart-to-list filtering | Medium | Medium | Shared selection state | R2 |
| Backend preference redesign | High | High | Agreed API contract | R3 |
| Export, zoom, freeform layout, palette editor | Low | High | Unproven demand | Deferred |

## Release boundaries

### R1: trustworthy chart foundation

R1 is complete when existing dashboards become analytically correct, accessible, responsive, and visually coherent without requiring a backend migration.

It includes:

- explicit count/duration/percentage/proficiency semantics;
- adaptive horizontal/vertical bars;
- eligible pies rendered as donuts;
- radar removed from invalid contexts with a compatibility fallback;
- KPI-based Overview;
- shared titles, metadata, tooltips, loading/empty states, and accessible tables;
- theme-aware stable colors;
- one mounted primary view and one optional alternative;
- retention of existing preference reads.

### R2: portfolio-specific visualizations

R2 adds the visualizations that require richer shapes or relationships:

- Experience and Education timelines;
- Skills evidence matrix and stacked alternative;
- Certificate timeline;
- chart-to-list highlighting;
- stronger narrative summaries derived from the displayed data.

### R3: durable preference model

R3 coordinates the frontend and backend migration:

- Timeline and Matrix lookup support if chart types remain server-managed;
- per-widget primary and alternative view configuration;
- migration of existing visibility, grouping, and value-source preferences;
- removal of obsolete preference keys after verified adoption.

## Component architecture

The implementation should separate concerns into four layers:

1. **Domain adapters** convert Education, Experience, Project, Skill, Language, Certificate, and Overview records into typed chart-ready models.
2. **Aggregation and formatting** calculate counts, ranges, durations, percentages, evidence, labels, units, and summaries without importing React or Recharts.
3. **Presentation primitives** render bars, donuts, timelines, matrices, KPI cards, legends, tooltips, and tables from normalized models.
4. **Chart frame and widget policy** choose allowed views, manage selection and controls, and connect a chart selection to its source list.

This boundary prevents Recharts-specific objects from leaking into widget hooks and permits aggregation behavior to be tested independently of SVG output.

## Verification plan

### Unit coverage

- Count, duration, percentage, proficiency, evidence, and timeline-range aggregation.
- Missing, invalid, future, ongoing, and overlapping dates.
- Stable ordering, top-N grouping, duplicate technology handling, and unknown categories.
- Unit, duration, percentage, date, and plural-aware formatting.
- Stable category-to-color assignment.

### Component and accessibility coverage

- Titles, descriptions, units, summaries, empty states, and accessible tables.
- Keyboard operation of view switches, legends, show-all, and table controls.
- Reduced-motion behavior and tooltip-equivalent focused content.
- Light/dark themes and color-independent distinctions.

### Responsive and visual coverage

- Representative widths of 320, 375, 768, 1024, and 1440 px.
- Long labels, one category, many categories, zero values, and large values.
- No clipping, overlap, unreadable labels, or document-level horizontal overflow.

### End-to-end coverage

- Owner changes an allowed grouping/measure and the public dashboard reflects it.
- Existing saved preferences receive the correct fallback.
- Only the selected view is mounted.
- Selecting a chart category highlights or filters the correct list entries.

### Performance evidence

- Compare production chart chunk sizes before and after each release.
- Record dashboard load and interaction timings with representative large fixtures.
- Confirm advanced views are not downloaded or mounted when unused where practical.
- Set final regression budgets from the measured baseline before implementation, rather than inventing unsupported thresholds now.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Backend lookup types cannot be changed with the frontend release | Ship R1 through existing Bar/Pie/Radar IDs and documented fallbacks |
| Existing user preferences select newly invalid combinations | Map to the widget default and preserve the saved record until migration |
| Dates or proficiency values are incomplete | Present unknown values explicitly and keep them out of misleading calculations |
| Long labels make Recharts axes unusable | Prefer horizontal bars, reserve label width, truncate visually, and expose full text accessibly |
| Too many chart controls weaken the portfolio narrative | Limit controls to valid alternatives and keep visitor-facing defaults simple |
| Theme colors pass visually but fail contrast | Test tokens in both themes and include non-color cues |
| New visualizations increase bundle size | Preserve lazy loading, split advanced views, and measure production chunks |
| Derived narrative summaries overstate the data | Use deterministic factual templates and disclose data scope |

## Acceptance criteria

- Each widget's default and alternatives match the visualization map.
- Every displayed value has an explicit measure, unit, formatter, and aggregation rule.
- No missing date is converted into a duration of one.
- No invalid radar or part-to-whole configuration can be selected.
- A widget never displays three competing charts simultaneously.
- Charts remain usable at 320 px and in both themes without clipped labels or page overflow.
- Every chart has a meaningful title, scope/context text, accessible summary, and data table.
- Keyboard-only and screen-reader users can access all values and controls.
- Reduced-motion users receive no nonessential chart animation.
- Category colors are stable across sorting and filtering.
- Existing saved preferences have a tested migration or fallback path.
- Chart loading remains code-split, and bundle/runtime measurements show no unacceptable regression.

## Decision log

| Decision | Recommendation | Status |
| --- | --- | --- |
| Customization model | Guided customization | Approved |
| Views per widget | One primary plus at most one switchable alternative | Approved |
| Radar | Restrict to normalized profiles | Approved |
| Pie | Render as donut and restrict to part-to-whole | Approved |
| Migration | Two-stage frontend/API migration | Approved |
| Default widget map | Use the map in this document | Approved |
