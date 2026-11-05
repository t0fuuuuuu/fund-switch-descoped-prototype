import { EWA_COMPONENTS } from "./design-system";
import { PrototypeState } from "./prototype-state.service";
import { Component, EventEmitter, Output, inject } from "@angular/core";
@Component({
  selector: "portal-dashboard",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./dashboard.html",
})
export class DashboardComponent {
  @Output() viewPolicyDetails = new EventEmitter<void>();
  m = inject(PrototypeState);
}
@Component({
  selector: "portal-dashboard-loading",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./dashboard-loading.html",
})
export class DashboardLoadingComponent {}
@Component({
  selector: "portal-policy-details",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./policy-details.html",
})
export class PolicyDetailsComponent {
  @Output() viewRequest = new EventEmitter<void>();
  m = inject(PrototypeState);
}
@Component({
  selector: "portal-terms",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./terms.html",
})
export class TermsComponent {}
@Component({
  selector: "portal-onboarding",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./onboarding.html",
})
export class OnboardingComponent {}
@Component({
  selector: "portal-non-vul",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./non-vul.html",
})
export class NonVulComponent {}
