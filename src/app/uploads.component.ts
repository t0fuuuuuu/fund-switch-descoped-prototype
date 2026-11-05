import { EWA_COMPONENTS } from "./design-system";
import { Component, inject } from "@angular/core";
import { PrototypeState } from "./prototype-state.service";
import { IconComponent } from "./shared-ui";
@Component({
  selector: "fund-uploads",
  standalone: true,
  imports: [...EWA_COMPONENTS, IconComponent],
  templateUrl: "./uploads.component.html",
})
export class UploadsComponent {
  m = inject(PrototypeState);
  documents = [
    { kind: "rpq", label: "Risk Profile Questionnaire (RPQ)" },
    { kind: "ips", label: "Investment Policy Statement (IPS)" },
  ];
  errorCopy: any = {
    error: "We couldn’t upload your document. Please try again.",
    "error-type": "File type not supported. Please upload a JPG, PNG, or PDF.",
    "error-size": "File exceeds the 5 MB limit. Please upload a smaller file.",
  };
  choose(k: string, event: Event) {
    this.m.chooseFile(k, (event.target as HTMLInputElement).files?.[0]);
  }
  reset(k: string) {
    this.m.state.documentUploads[k] = { status: "empty", name: "" };
    this.m.state.waiverAccepted = false;
  }
}
