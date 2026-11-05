export enum DsButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Discovery = "discovery",
  Subtle = "subtle",
  Error = "danger",
  Info = "discovery",
  Neutral = "subtle",
}

export enum DsButtonEmphasis {
  DEFAULT = "default",
  OUTLINE = "outline",
  TRANSPARENT = "transparent",
}

export { DsButtonEmphasis as DsButtonAppearance };

export enum DsButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export type DsButtonIcon = string | null | undefined;

export const DS_BUTTON_VARIANTS: readonly DsButtonVariant[] = [
  DsButtonVariant.Primary,
  DsButtonVariant.Secondary,
  DsButtonVariant.Success,
  DsButtonVariant.Danger,
  DsButtonVariant.Warning,
  DsButtonVariant.Discovery,
  DsButtonVariant.Subtle,
] as const;

export const DS_BUTTON_EMPHASIS: readonly DsButtonEmphasis[] = [
  DsButtonEmphasis.DEFAULT,
  DsButtonEmphasis.OUTLINE,
  DsButtonEmphasis.TRANSPARENT,
] as const;

export { DS_BUTTON_EMPHASIS as DS_BUTTON_APPEARANCES };

export const DS_BUTTON_SIZES: readonly DsButtonSize[] = [
  DsButtonSize.Small,
  DsButtonSize.Medium,
  DsButtonSize.Large,
] as const;
