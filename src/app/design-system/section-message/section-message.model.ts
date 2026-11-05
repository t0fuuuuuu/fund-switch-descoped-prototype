export type DsSectionMessageAppearance =
  "info" | "success" | "warning" | "error" | "discovery";
export type DsSectionMessageSize = "large" | "medium";

export const DS_SECTION_MESSAGE_APPEARANCES: readonly DsSectionMessageAppearance[] =
  ["info", "success", "warning", "error", "discovery"] as const;

export const DS_SECTION_MESSAGE_SIZES: readonly DsSectionMessageSize[] = [
  "large",
  "medium",
] as const;
