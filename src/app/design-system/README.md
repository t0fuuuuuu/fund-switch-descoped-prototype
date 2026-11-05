# EWA design-system snapshot

Source of truth: [EWA Storybook](https://ewa-product-designer.github.io/ewa-design-system/), including the supplied [Tag / With Slot story](https://ewa-product-designer.github.io/ewa-design-system/?path=/story/components-tag--with-slot).

This is a local source snapshot of the actual Angular components published by that Storybook, retrieved November 4, 2026. Component TypeScript, templates, original SCSS, and design tokens were recovered from the published build and its source maps. No Storybook runtime, webpack bundles, story/demo wrappers, or remote scripts are loaded by the portal. The GitHub source repository was not available through the connected GitHub account; this is not represented as an installed upstream npm package.

Published snapshot identifiers:

- Story index: `index.json`, 12 component families plus modal composition patterns.
- Preview entry: `main.492c67ef.iframe.bundle.js`.
- Shared styles/tokens: `main.ac48330538c89ab0d867.css`.
- Runtime module map: `runtime~main.b2887d13.iframe.bundle.js`.

## Application mapping

| Storybook component | Fund Switch usage |
| --- | --- |
| Button | Main actions, Save Draft, Back, modal actions, upload controls, loading and skeleton states |
| Checkbox | The single required final review/risk/waiver confirmation |
| Dropdown Menu | Product-filtered source/target fund selection |
| Link | Actual RPQ/IPS downloads, with accessible icon-only link names |
| Progress Bar | Journey completion and simulated document upload progress |
| Radio | Policy selection with the policy card projected into the label |
| Section Message | Requirements, risk warnings, allocation notices, review warning |
| Stepper | Read-only three-step journey indicator; it cannot bypass validation |
| Tab Group | Investments performance periods, including responsive overflow |
| Tag | Policy/request statuses and risk tags; risk uses the published `dsTagSlot` projection |
| Text Field | Typed reactive login inputs and dropdown trigger fields |
| Modal | Download/save-draft prompt, eligibility notices, onboarding, numbered legal document |

Page layout, service cards, policy cards, navigation, upload surfaces, toast and document text remain application compositions because the incomplete Storybook has no corresponding complete components. They use the relevant published controls within them.

## Small integration adapters

The visual SCSS and token values are the published definitions. Local adaptations are limited to:

- Button: native submit/reset type and projected rich labels; loading/disabled behavior remains inside the component.
- Text Field: Angular `ControlValueAccessor`, autocomplete, and an accessible password-visibility action. This retains the typed login `FormGroup`.
- Checkbox/Radio: accessible native input IDs, label references, and projected card/confirmation content. Review still has exactly one required checkbox.
- Dropdown: input IDs, fluid width, and `trackBy` using the option value so application-generated option arrays do not replace a focused option before its click. Home/End on the trigger preserves the portal's existing keyboard navigation; Escape is consumed when closing an open dropdown so it does not also close a containing modal. Enter selection prevents the native trigger from reopening the popup when focus returns.
- Section Message: projected description content, allowing the original copy and action content to remain intact.
- Link: native `download` attribute for the supplied PDF files.
- Modal: programmatic focus target and optional panel class for the portal's scrollable legal document and illustration composition. Existing dialog focus trapping/return is retained by the portal.
- Interface-only models erased by the published JavaScript were reconstructed from component usages. Runtime models/enums are from the published sources.

`src/design-system.tokens.css` contains the published token/theme definitions. Local fonts remain in `assets/fonts`. `src/angular.css` contains portal layout adapters; it does not replace the component variant palettes or interaction styling. Keep any future upstream fixes distinguishable from application adapters, and prefer an official package or repository source when one becomes available.
