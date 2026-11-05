export type DsLinkSize = 18 | 16 | 14 | 12 | 10;
export type DsLinkVariant =
  | "default"
  | "default-with-icon"
  | "subtle"
  | "subtle-with-icon"
  | "strong"
  | "strong-with-icon"
  | "inverse"
  | "inverse-with-icon"
  /** Storybook-only text treatment; not a Figma component variant. */
  | "inline";

export const DS_LINK_SIZES: readonly DsLinkSize[] = [
  18, 16, 14, 12, 10,
] as const;
export const DS_LINK_VARIANTS: readonly DsLinkVariant[] = [
  "default",
  "default-with-icon",
  "subtle",
  "subtle-with-icon",
  "strong",
  "strong-with-icon",
  "inverse",
  "inverse-with-icon",
  "inline",
] as const;
