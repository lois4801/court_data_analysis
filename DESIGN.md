# CourtAtlas design context

## Product context
A separate editorial research website about US state courts. It is not CourtSphere, an authenticated application, or an official court record system. Data is a curated sourced snapshot; planning arithmetic is visibly hypothetical.

## North Star
An immersive civic research journal: courthouse columns, large elegant serif headlines, deliberate whitespace, precise captions, and tactile interactive research. The signature is a photographic courthouse hero followed by approachable data stories.

## Audience and register
US court leaders, prospective clients, data scientists, and interested readers. English US locale, desktop and mobile. Presentation-led site with bounded browser-local chart controls; no Japan market, accounts, sensitive records, or CRUD.

## Tokens and ownership
CSS :root in dist/assets/styles.css owns runtime tokens. Midnight #07151d, deep blue #0b202a, paper #efe9dc, muted text #a9b7bb, champagne #c5a474, aqua #83b9b5. Playfair Display for editorial type; DM Sans for body; Manrope for utility. Serif and Arial fallbacks reserve readable geometry if fonts are unavailable.

## Interaction ownership
Shared button, segmented, and notify functions in assets/main.js own chart behavior. Native range slider and details elements retain platform keyboard semantics. Research category, units, selected point and capacity are validated and stored in URL state. Menu is a nonmodal disclosure; Escape closes it and restores trigger focus.

## Motion and accessibility
Hero text reveal, photography entrance, visible-stat counters, scroll reveal, chart transitions. Respect reduced motion globally. Semantic buttons with pressed states and explicit names, linked sources, alternative chart descriptions, labelled range, visible focus, skip link, no hover-only essential data. Browser QA depends on supported preview capability availability.

## Content integrity
NCSC figures preserve period and source limits. Contract and small-claims figures are reported approximations from preliminary 2025 Figure 3 jurisdictions. Growth uses approximate chart values and does not claim a national rate. Scenario studio has no predictive model. No fictitious testimonials, institutional affiliations, or state rankings.

## Assets
New York County Courthouse photo by Mike Peel, CC BY-SA 4.0, source and attribution in footer; visible treatment acknowledged under same license. Federal courtroom photograph by Carol M. Highsmith/Library of Congress is architectural context, labelled as federal. Remote images have fixed aspect geometry and a color fallback if unavailable.

## Delivery and preflight
Separate project and Site identity, buildless assets in dist. Verify JS syntax, internal anchors, source URLs, range bounds, category and view switching, download content, mobile navigation semantics, motion fallback, and source-count separation. Publish the exact pushed source archive. No server integrations are represented as live.
