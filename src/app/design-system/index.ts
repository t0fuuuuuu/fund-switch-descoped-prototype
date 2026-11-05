import { ButtonModule } from "./button/button.module";
import { CheckboxModule } from "./checkbox/checkbox.module";
import { DsDropdownMenuModule } from "./dropdown-menu/dropdown-menu.module";
import { LinkModule } from "./link/link.module";
import { ProgressBarModule } from "./progress-bar/progress-bar.module";
import { RadioModule } from "./radio/radio.module";
import { SectionMessageModule } from "./section-message/section-message.module";
import { StepperModule } from "./stepper/stepper.module";
import { TabModule } from "./tab/tab.module";
import { TagModule } from "./tag/tag.module";
import { DsTextFieldModule } from "./text-field/text-field.module";
import { ModalDialogModule } from "./modal-dialog/modal-dialog.module";
export const EWA_COMPONENTS = [
  ButtonModule,
  CheckboxModule,
  DsDropdownMenuModule,
  LinkModule,
  ProgressBarModule,
  RadioModule,
  SectionMessageModule,
  StepperModule,
  TabModule,
  TagModule,
  DsTextFieldModule,
  ModalDialogModule,
] as const;
export * from "./button/button.module";
export * from "./checkbox/checkbox.module";
export * from "./dropdown-menu/dropdown-menu.module";
export * from "./link/link.module";
export * from "./progress-bar/progress-bar.module";
export * from "./radio/radio.module";
export * from "./section-message/section-message.module";
export * from "./stepper/stepper.module";
export * from "./tab/tab.module";
export * from "./tag/tag.module";
export * from "./text-field/text-field.module";
export * from "./modal-dialog/modal-dialog.module";
