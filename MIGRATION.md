# Angular migration notes

## Baseline and isolation

Worktree: `/Users/adrianjustinsantos/Documents/GitHub/ewa-cp-interactive-prototype/fund-switch-angular` on `fund-switch`, based on `128914c`. The separate original checkout and published demo remain untouched. The user subsequently authorized pushing this source branch and publishing its build in the separate `/fund-switch/` preview folder on November 5, 2026. The source is not merged into `main`.

The inventory covered all 1,952 lines of the baseline `app.js`, both entry HTML documents, shared/responsive CSS, the standalone public Investments script, all 14 scenarios, and local assets/PDFs. The approved currently reachable Fund Switch journey is the baseline, including its known gaps. Old in-app RPQ scoring/assessment helpers are unreachable from that approved manual download/upload journey and are not reintroduced.

## Architecture

- `src/main.ts`: standalone bootstrap, Angular Router, zone-based change detection for simulated loading/upload/submission timers.
- `src/app/app.component.*`: routed portal shell, typed reactive login, navigation, Services, policy selection, fund-switch journey, requests, modal/focus coordination, and scenario tools. Router paths identify screens; scenario query parameters remain supported. An uninitialized deep link safely returns to the entry experience rather than inventing missing policy data.
- `prototype-state.service.ts`, `prototype.models.ts`, `mock-data.ts`: injectable mock state, typed document metadata, sample records, original product/currency/minimum/allocation calculations, scenarios, and browser draft persistence.
- `investments.component.*`, `uploads.component.*`, `fund-summary.component.ts`: standalone feature components with Angular bindings, control flow, and events.
- `shared-ui.ts`: reusable icons, messages, and loading skeletons. Their markup keeps the existing CSS selectors and visual states.
- `reference-components.ts` and corresponding templates: static sample Dashboard and Policy Details presentation plus onboarding, legal terms, and traditional-policy notice. They are compiled Angular templates; no legacy string renderer or runtime HTML injection is used.
- `styles.css`: preserved shared and responsive visual baseline. `src/angular.css` only adapts component host boxes. Fonts, icons, illustrations, images, and sample PDFs are served locally.
- `reference/legacy/`: archived original HTML/JS and separate public Investments catalog source. The latter is not a connected destination in the approved current Fund Switch path; the account Investments feature is migrated. The original checkout remains the runnable reference.

The prototype keeps client state deliberately simple. Authentication, files, persistence, and processing are simulations. Uploaded bytes are neither sent to a server nor saved in local storage; only names/status metadata persist. Uploading never scores or validates an RPQ.

## Journey coverage

| Area | Preserved behavior |
| --- | --- |
| Entry | Login validation, password visibility, dashboard skeleton, onboarding, account/mobile navigation |
| Dashboard / Policy Details | Sample policy cards, completion notice and request entry |
| Services / Requests | Fund Switch entry, sample request statuses/details, resume draft |
| Investments | Policy breakdown, per-holding Switch Fund entry, sample charts and period tabs |
| Eligibility | Eligible policies, inactive policies, traditional-policy and pending-request notices |
| Funds | Product-filtered same-currency destinations, PHP 10,000/USD 500 minimums, source holdings and current automatic Dollar Income Paying Fund full-allocation behavior |
| Forms | Higher-risk rule, one-second forms/summary skeletons, Next locked while checking, real sample PDF downloads, short draft prompt that retains the forms screen |
| Uploads | Empty, selected/ready, uploading, uploaded, generic retryable failure, unsupported type, over 5 MB; JPG/PNG/PDF |
| Review | One required confirmation checkbox, warning toggles with consent, exact numbered waiver text, scrollable fixed-header/footer modal, closing gives no consent |
| Submit | Simulated processing, success summary, request tracking and saved-draft removal |
| Draft | Selection and uploaded metadata only, reload/resume, Save Draft prompt, green-check Draft Saved toast with dismissal |
| Presentation | All original scenario IDs, searchable guide, visibility persistence, hard restart, typing guard, focus return and dialog tab trapping |

## Original scenario IDs

`standard-peso`, `higher-risk-peso`, `document-upload-error`, `risk-mismatch-waiver`, `exact-minimum-peso`, `below-minimum-peso`, `dollar-same-risk`, `below-minimum-dollar`, `product-specific-funds`, `pending-request`, `income-paying-multi-source`, `income-paying-insufficient`, `traditional-policy`, `completed-fund-switch`.

## Preserved gaps and prototype boundaries

1. Draft status still participates in the existing pending-request check and can show **Already Submitted** from policy selection. A new Continue Draft / Discard and Start New dialog remains unapproved and unimplemented.
2. Automatic 100% source coverage is enforced for **Dollar Income Paying Fund** only. The broader acceptance-criteria rule for payout funds has not been silently extended.
3. Request tracking retains the actual baseline Submitted / In Progress / Completed descriptions and Draft entry; the six later discussed reusable descriptions are not all applied.
4. The `dollar-same-risk` scenario description says documents apply, but the actual baseline condition is target risk strictly greater than source risk. Its equal-risk selection therefore proceeds without uploads; the migration retains the calculation.
5. Documents, Payments, Profile, Log out, other service cards, toolkit actions, and Explore VUL products retain their baseline prototype-only notices or unconfirmed destinations. They do not imply implemented backend features. Period tabs retain illustrative chart data.
6. The standalone public Investments catalog and obsolete RPQ/assessment branches remain archived reference source, rather than adding new navigation into the approved journey.

## Verification

Run `npm run check`, `npm run build`, and `npm run test:flows` against the running preview. The browser checks cover the full higher-risk journey, both downloads with draft retention, document state/error cases, review/terms/consent, submission, minimum and allocation examples, eligibility notices, retry, draft reload, and presentation shortcuts. Desktop and mobile screenshot comparisons use the preserved reference on port 8000. Generated screenshots are local verification artifacts, not public build assets.

### Verified on November 4, 2026

- TypeScript check and Angular production compilation pass.
- `test:flows` passes with no browser page errors: login/onboarding, policy/funds, one-second loading lock, both real PDF downloads, draft prompt retention, upload states/errors/retry, legal/consent, submission, minimums, allocation, eligibility, persisted recovery, guide and hard restart.
- `test:reference` passes: legal text is identical to the reference; Investments switch entry, dropdown keyboard handling, mobile focus restoration, completion notices, product-specific funds, all 14 scenarios, and typing guard. It requires the preserved reference on port 8000 as well as Angular on 4200.
- Desktop (1440×1000) and mobile (390×844) Fund Switch and terms screenshots were compared with the preserved reference. Generated artifacts stay in ignored `output/verification/`.
- `git diff --check` passes. The archived baseline `app.js` matches the original checkout byte-for-byte. No push, merge, or publication was performed.

## EWA Storybook adoption

The user subsequently supplied the EWA design-system Storybook as the component source of truth. All 12 relevant component families are now integrated using a local snapshot of the published Angular source, templates, styles, and tokens. See `src/app/design-system/README.md` for the component-to-screen map, exact build identifiers, and adapter details. This supersedes the earlier hand-matched shared-control baseline; application layouts and the approved business rules remain preserved. The full journey browser checks pass with the integrated controls.

Storybook integration verification: TypeScript and production build pass without warnings; `test:flows` and `test:reference` pass. `test:design-system` checks reactive password visibility, native radio/tag/modal composition, keyboard period tabs and mobile overflow. Updated login, policy, funds, Investments and legal-dialog screenshots were inspected at desktop/mobile widths. The original preview/publication remains unchanged.

## Recovered signature flow — user-approved addition

The original retained `Self-Serve — Fund Switch` version contains the earlier draw-to-sign modal. The user requested its incorporation after the migration and Storybook adoption. `signature.component.*` ports the interaction into Angular with the current DS modal, buttons and dropdowns. The existing three steps, legal wording, review checkbox, risk/document rules and success/request views remain intact. The review CTA is now **Submit**; final submission occurs from the signature modal's Next action.

The bitmap is transient service state, supporting mouse, touch/stylus pointer events, cancel/reopen, redo, and same-session draft resume. Signature/location validation gates Next. Processing disables drawing, fields, Cancel, Save as Draft and duplicate submission; Escape cannot dismiss the processing modal. The signature modal has only Cancel and Next; drafts are saved before signing from the review screen.

Browser drafts store only existing selection/document metadata plus a `draftResumeModal: signature` marker. They never contain signature images. Reload restores the request with consent unchecked; the customer must confirm review and sign again. Country/city/district choices are the original illustrative, non-cascading prototype lists. No document generation, signature embedding, verification service, or backend was introduced.

`test:signature` covers required fields, image capture/redo, focus return, nested dropdown Escape, prompt cancellation, safe draft metadata, same-session resume, reload/redraw, actual touch events at mobile width, focus containment and processing/success. `test:flows` now includes signing on the higher-risk document journey.

## Annotated design corrections

All 11 browser annotations are applied: 24px summary/banner/confirmation spacing, first-line checkbox alignment, signature and policy-stage draft action removal, invisible radio chrome with native card selection retained, exact review title/description/Submit copy, and Figma signature/success compositions. Submit still opens the required signing checkpoint.

Signature uses node `13557:197793`: 398px maximum width, 24px gutters, 26px centered heading, approximately 350×300px pad at full width, exact local undo/chevron assets, normal scrolling heading without pad overlap, Cancel/Next only. A short viewport scrolls the body while retaining actions. The pad scales at smaller phone widths.

Success uses node `7837:202903`: 1000px maximum card, Request Received header and original request-sent animation, read-only Submitted/In Progress/Completed timeline, Fund Switch metadata in the reference's details-card arrangement, and neutral Back to Services action. The service-specific data differs intentionally from the reference's beneficiary/reinstatement placeholders. Existing account navigation remains intact.

Responsive decisions: review spacing is consistent across viewport sizes; existing 760px mobile footer behavior is retained. Success details use three columns, two below 760px and one below 480px. No 825px-specific rule was added. `test:annotations` checks the reported 825×694 viewport as well as desktop/mobile widths, component geometry, static asset slots, checkbox alignment and removed actions.

### Responsive annotation follow-up (5 November 2026)

Signature location dropdowns opt into adaptive top-layer menus. They open upward when space below the trigger is limited, stay within the modal content bounds, and reposition during scrolling/resizing without expanding the form. Existing dropdowns keep their default behavior. Income-source and full-allocation banners use 24px composition spacing outside the summary. Add Policy uses the native secondary filled button; dashboard notices and Add Policy cards stack through 1100px to accommodate the tablet sidebar.

Validation: `node tests/responsive-fixes.cjs` covers 430×932, 825×694, 1440×1000 and 390×844; signature regression, Angular typecheck and production build also run.

The dashboard completion notice now directly uses the published `ds-section-message` success variant, including its native action link and tokens. The action emits an Angular event to open Policy Details. The earlier custom completion-card presentation is no longer rendered.
