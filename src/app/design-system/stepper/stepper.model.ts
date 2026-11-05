export type StepperOrientation = "vertical" | "horizontal";

export type StepperIndicator = "default" | "icon";

export type StepperVisualState =
  "upcoming" | "current" | "completed" | "incomplete" | "disabled";

export type StepperSpecialState = Exclude<
  StepperVisualState,
  "completed" | "current" | "upcoming"
>;

export interface StepperStep {
  label: string;
  description?: string;
  number?: number | string;
  state?: StepperVisualState;
  indicator?: StepperIndicator;
  icon?: string;
}

export const STEPPER_ORIENTATIONS: readonly StepperOrientation[] = [
  "vertical",
  "horizontal",
] as const;
