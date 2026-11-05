import { ButtonModule, SectionMessageModule } from "./design-system";
import { Component, Input } from "@angular/core";
@Component({
  selector: "[uiIcon]",
  standalone: true,
  template: "{{name}}",
  host: { "aria-hidden": "true", class: "material-symbols-rounded" },
})
export class IconComponent {
  @Input() name = "";
}
@Component({
  selector: "ui-message",
  standalone: true,
  imports: [SectionMessageModule],
  template: `<ds-section-message
    [title]="title"
    [description]="''"
    [appearance]="$any(tone)"
    size="large"
    [showAction1]="false"
    [showAction2]="false"
    [isDismissible]="false"
    [fullWidth]="true"
    ><ng-content
  /></ds-section-message>`,
})
export class MessageComponent {
  @Input() title = "";
  @Input() tone = "info";
}
@Component({
  selector: "ui-skeleton",
  standalone: true,
  imports: [ButtonModule],
  template:
    '<section [class]="kind===\'downloads\'?\'document-downloads fund-section-skeleton\':\'switch-summary fund-section-skeleton\'" role="status" aria-busy="true" [attr.aria-label]="kind===\'downloads\'?\'Loading download forms\':\'Loading fund switch summary\'"><div aria-hidden="true"><span class="skeleton-line skeleton-heading"></span><span class="skeleton-line skeleton-description"></span><div class="skeleton-form-row"><span class="skeleton-line"></span><ds-button label="Loading" [skeleton]="true" [disabled]="true"></ds-button></div><div class="skeleton-form-row"><span class="skeleton-line"></span><ds-button label="Loading" [skeleton]="true" [disabled]="true"></ds-button></div></div></section>',
})
export class SkeletonComponent {
  @Input() kind = "summary";
}
