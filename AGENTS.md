# Fund Switch Prototype: Agent Instructions

## Purpose and Current Stack

- This repository is the standalone descoped Fund Switch stakeholder prototype, separate from the full-version source.
- This migration worktree uses Angular 21.2 and TypeScript 5.9, standalone components, Angular Router, typed reactive login forms, and an injectable mock state service. The separate original checkout remains the visual and behavior reference.
- Login, uploads, processing, and submission are simulated with sample data. Do not introduce real customer data or describe simulated behavior as a production integration.
- Inspect the current source and Git diff before editing. This file records durable guidance; the checked-out source establishes actual behavior.

## Source Map

- `src/main.ts`: Angular bootstrap and router.
- `src/app/app.component.*`: portal shell, login, Services, Fund Switch, requests, scenarios, and modal coordination.
- `src/app/prototype-state.service.ts`, `prototype.models.ts`, `mock-data.ts`: mock state, types, rules, persistence, and sample scenarios.
- `src/app/investments.component.*`, `uploads.component.*`, `fund-summary.component.ts`, `signature.component.*`, `shared-ui.ts`: standalone features and shared UI.
- `src/app/design-system/`, `src/design-system.tokens.css`: local source snapshot of the published EWA Angular components and tokens.
- `styles.css`, `src/angular.css`, `src/fonts.css`: portal composition styling, host adaptations, and local typography/icons.
- `assets/`, `output/pdf/`: illustrations, fonts/licenses, icons, and downloadable sample documents.
- `reference/legacy/`: archived original scripts and HTML; not runtime code. The separate original checkout is the runnable reference.
- `MIGRATION.md`: inventory, architecture, coverage, verification, and known gaps.

## Local Preview and Verification

Use this worktree explicitly for implementation/Git commands; do not modify the original checkout. Use Angular-compatible Node (the migration was built with 22.22.3).

```sh
npm ci
npm start
npm run check
npm run build
npm run test:flows
npm run test:signature
```

Open `http://127.0.0.1:4200/`. Keep the original reference on port 8000. Check listeners and HTTP responses before starting additional servers. `tests/flows.cjs` contains focused Playwright checks; Edge on macOS or an installed Playwright Chromium is required. Ignore generated `output/verification/` screenshots.

- Run `git diff --check` and appropriate Angular build/type checks.
- Verify changed flows in the browser, including validation, back navigation, state resets, keyboard/focus behavior, and mobile/desktop layout.
- Use original `?scenario=...` IDs from `prototypeScenarios`; do not invent replacements.
- Use Angular templates, bindings and services. Do not restore the legacy DOM/string renderer or add runtime HTML injection.

## Approved Journey and Design Conventions

- Preserve the three main steps: Select Policy, Switch Your Fund, and Review & Submit.
- Use the actual EWA Storybook components in `src/app/design-system/` and its published design tokens for applicable controls. The user supplied https://ewa-product-designer.github.io/ewa-design-system/?path=/story/components-tag--with-slot as the current component reference. Preserve Lato/Montserrat and Material Symbols. See the design-system README for source provenance and the small integration adapters; avoid parallel lookalike controls.
- Source and target funds must share a currency. The minimum switch amount is PHP 10,000 or USD 500. Preserve current product eligibility and allocation validation unless the user changes the scope.
- A more aggressive target currently triggers RPQ and IPS downloads followed by uploads. These are manually completed forms; uploading does not automatically score or validate the RPQ result.
- Preserve the seven upload states: empty, ready to upload, uploading, uploaded, upload failure, unsupported type, and oversized file. Supported uploads are JPG, PNG, or PDF, up to 5 MB.
- Target selection uses a one-second skeleton state for Download Forms and Fund Switch Summary; Next stays unavailable during that update.
- Final review uses one required confirmation checkbox covering review, risk acknowledgment, and waiver terms. The warning banner hides when checked and returns when unchecked.
- The user has approved reintroducing the recovered signature flow: Review → Submit → draw signature and select country/city/district → Next → processing/success. Keep the existing three main journey steps. Use the standalone signature component and Storybook controls; do not restore obsolete RPQ/FSAF flows.
- Signature capture supports mouse, touch and stylus, redo, cancel, required location gating, and processing lock. Its Figma reference is node `13557:197793`; use “Policy Owner’s Signature”, with only Cancel and Next. Signature PNGs stay only in memory; after a reload, require the existing review confirmation and a fresh signature.
- Save as Draft is available on fund selection, documents, and review; it is absent during policy selection and in the signature modal. Policy cards retain accessible single-choice semantics without visible radio indicators.
- Review uses the approved “Review & Submit” title, full explanatory copy, and “Submit” CTA (which opens signature capture). Its summary/banner/confirmation spacing is owned by `.review-panel` composition styles, not margins in shared controls.
- Success follows Figma node `7837:202903`: Request Received header, status timeline, Policy Details card (node `7838:214656`, with the supplied sample name/contact content), Back to Services footer. The timeline connector spans each variable-height step, including wrapped descriptions.
- Opening or closing Terms and Conditions does not give consent. Preserve the supplied waiver wording, readable document layout, keyboard focus management, and accessible Close action.
- Downloading either form opens the Save as Draft prompt. Saving from that prompt keeps the forms screen available for the other download.
- Keep customer-facing wording concise and actions explicit. Keep presentation-only controls out of the customer journey.

## Drafts and Presentation Controls

- Draft selection data and simulated uploaded-document metadata are stored in this browser's local storage. This is not backend persistence or storage of actual uploaded files.
- `Ctrl + Shift + G` toggles the Prototype Scenario Guide button. Its visibility preference persists in the current tab's session storage.
- `Ctrl + Shift + H` clears the saved draft and reloads the entry URL, resetting progress and returning to login. Preserve the typing guard and removal of scenario query parameters.

## Known Gaps and Proposed Work

- Drafts currently share the pending-request check and can incorrectly show an already-submitted message. The recommended separate draft dialog (Continue Draft / Discard and Start New) has been discussed but is not implemented.
- The request tracker does not implement every discussed status. Reusable status descriptions were proposed in chat; inspect source before claiming they are applied.
- The 100% source-allocation rule currently targets Dollar Income Paying Fund only; broader payout-fund coverage needs reconciliation with the acceptance criteria.
- Keep proposed behavior separate from implemented behavior. Do not implement unrelated gaps without a task requesting them.

## Git, Publishing, and Angular Migration

- Preserve unrelated local changes. Do not reset or overwrite user work.
- Work locally by default. Commit, push, or publish when the user requests it; a prior publication does not authorize publishing every later edit.
- The stakeholder site is `https://t0fuuuuuu.github.io/fund-switch-descoped-prototype/`, currently published from `main`.
- After an authorized publication, verify the live page and changed assets match the approved source before reporting success.
- Angular migration is implemented locally in this isolated worktree on `fund-switch`, based on `128914c`. See `MIGRATION.md` for scope and validation.
- Do not create another migration worktree. Preserve the original checkout and root stakeholder publication. On November 5, 2026, the user authorized renaming the source branch to `fund-switch`, pushing it, and publishing a separate `/fund-switch/` preview. Future publications still require authorization; do not merge source into `main`.
- Hand off the actual project path, source revision, setup instructions, approved behavior, and known gaps to the new chat. Do not assume it knows the full conversation history.
