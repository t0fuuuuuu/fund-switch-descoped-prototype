export enum DsTagVariant {
  Neutral = "neutral",
  Primary = "primary",
  Success = "success",
  Warning = "warning",
  Danger = "danger",
  Info = "info",
}

export type DsTagIcon = string | null | undefined;

export const DS_TAG_VARIANTS: readonly DsTagVariant[] = [
  DsTagVariant.Neutral,
  DsTagVariant.Primary,
  DsTagVariant.Success,
  DsTagVariant.Warning,
  DsTagVariant.Danger,
  DsTagVariant.Info,
] as const;
