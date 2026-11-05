export type DsDropdownMode = "item" | "checkbox" | "radio";
export interface DsDropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
