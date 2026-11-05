# Fund Switch — Angular stakeholder prototype

Angular 21.2, TypeScript 5.9, standalone feature components, Angular Router, a typed reactive login form, and the actual EWA Storybook component modules. All customer records, uploads, loading, and submissions are simulated. Use sample credentials only; any nonempty username and password work.

```sh
cd /Users/adrianjustinsantos/Documents/GitHub/ewa-cp-interactive-prototype/fund-switch-angular
# Node 22.22.3 or another Angular 21-compatible Node version
npm ci
npm start
```

Open **http://127.0.0.1:4200/**. The original reference remains at http://127.0.0.1:8000/ and the [published stakeholder demo](https://t0fuuuuuu.github.io/fund-switch-descoped-prototype/). The Angular source branch is `fund-switch`. Its separate public preview is published under `/fund-switch/`; the original Descoped demo remains at the root URL.

```sh
npm run check       # TypeScript
npm run build       # Angular templates and production build
npm run test:flows  # Focused browser checks; start the preview first
npm run test:reference # Optional parity/focus checks; also needs original on 8000
npm run test:design-system # Storybook controls, keyboard tabs and mobile overflow
npm run test:signature # Signature, drafts, mouse/touch, mobile and submission
```

Browser checks use Microsoft Edge when installed on macOS, or Playwright Chromium. Else run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a compatible browser executable. Screenshots are written to ignored `output/verification/`. Serve `dist/fund-switch/browser` with an SPA fallback for production-style local previews.

The scenario guide retains all 14 original `?scenario=` IDs; for example [higher-risk-peso](http://127.0.0.1:4200/?scenario=higher-risk-peso). Ctrl+Shift+G toggles its visibility. Ctrl+Shift+H clears the draft and restarts at login; shortcuts ignore typing where appropriate. Draft storage contains selection and document metadata, never uploaded file contents.

See [MIGRATION.md](MIGRATION.md) for architecture, coverage, and known gaps, and [AGENTS.md](AGENTS.md) for project instructions. `reference/legacy/` is an archived source baseline, not the Angular runtime.

Version compatibility was checked against [Angular's official compatibility table](https://angular.dev/reference/versions): Angular 21 accepts TypeScript >=5.9 <6 and Node ^20.19, ^22.12, or ^24. The exact installed dependencies are in `package-lock.json`. If Node is not yet installed, the current session has a temporary runtime at `/tmp/node-v22.22.3-darwin-x64/bin`; prepend that directory to `PATH` to use the setup commands until a permanent Node installation is available. Local fonts and their redistribution licenses live in `assets/fonts/`.

The applicable published design components are mapped in [the design-system integration notes](src/app/design-system/README.md). The snapshot is served locally, with small adapters for forms, accessibility, and the approved prototype flows.

Review now continues to **Submit**. Draw the signature, select its country/city/district, then choose Next to submit. Redo and Cancel are available in the signature modal; Save as Draft remains on the fund, document, and review screens. Signature images stay in memory only; a draft reopened after leaving/reloading requires review confirmation and a fresh signature. Location choices remain the illustrative options from the recovered prototype.

## Separate public preview

Source branch: `fund-switch`. Build with `NG_BUILD_MAX_WORKERS=1 npm run build:preview` (Node 22). Publish only `dist/fund-switch/browser/` to the `fund-switch/` directory on the Pages `main` branch. Do not merge the Angular source into `main` or replace the root Descoped files. The route index copies support refresh/direct links on GitHub Pages.

Preview URL: https://t0fuuuuuu.github.io/fund-switch-descoped-prototype/fund-switch/
