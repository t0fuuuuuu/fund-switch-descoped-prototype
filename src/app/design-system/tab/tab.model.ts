export type DsTabSize = "small" | "medium";
export type DsTabAlignment = "left" | "center" | "right";
export type DsTabOverflowMode = "auto" | "always" | "never";
export interface DsTabItem {
  label: string;
  value?: string;
  disabled?: boolean;
  statusIcon?: string;
  disclosureIcon?: string;
  showStatusIcon?: boolean;
  showDisclosureIcon?: boolean;
  showBadge?: boolean;
  badge?: string | number;
  showIndicator?: boolean;
}
export interface DsTabOverflowItem {
  label: string;
  value?: string;
  disabled?: boolean;
}
