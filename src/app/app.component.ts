import { SignatureComponent } from "./signature.component";
import { EWA_COMPONENTS } from "./design-system";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  Component,
  HostListener,
  inject,
  afterNextRender,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { PrototypeState } from "./prototype-state.service";
import { prototypeScenarios } from "./mock-data";
import {
  IconComponent,
  MessageComponent,
  SkeletonComponent,
} from "./shared-ui";
import { FundSummaryComponent } from "./fund-summary.component";
import { UploadsComponent } from "./uploads.component";
import { InvestmentsComponent } from "./investments.component";
import {
  DashboardComponent,
  PolicyDetailsComponent,
  TermsComponent,
  OnboardingComponent,
  NonVulComponent,
  DashboardLoadingComponent,
} from "./reference-components";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: "<router-outlet/>",
})
export class AppComponent {}
@Component({
  selector: "portal-app",
  standalone: true,
  imports: [
    ...EWA_COMPONENTS,
    SignatureComponent,
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    MessageComponent,
    SkeletonComponent,
    FundSummaryComponent,
    UploadsComponent,
    InvestmentsComponent,
    DashboardComponent,
    PolicyDetailsComponent,
    TermsComponent,
    OnboardingComponent,
    NonVulComponent,
    DashboardLoadingComponent,
  ],
  templateUrl: "./app.component.html",
})
export class PortalComponent {
  m = inject(PrototypeState);
  router = inject(Router);
  get s() {
    return this.m.state;
  }
  login = new FormGroup({
    username: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  modal = "";
  modalPolicy: any;
  fromDownload = false;
  draftReturnSignature = false;
  signatureReturnFocus: HTMLElement | null = null;
  returnFocus: HTMLElement | null = null;
  mobileOpen = false;
  search = "";
  toast = "";
  toastSuccess = false;
  guideHidden = this.readGuidePreference();
  private readGuidePreference() {
    try {
      return (
        sessionStorage.getItem("fund-switch-scenario-guide-hidden") === "true"
      );
    } catch {
      return false;
    }
  }
  documents = [
    {
      kind: "rpq",
      label: "Risk Profile Questionnaire (RPQ)",
      file: "output/pdf/risk-profile-questionnaire-20250411.pdf",
    },
    {
      kind: "ips",
      label: "Investment Policy Statement (IPS)",
      file: "output/pdf/investment-policy-statement-20250401.pdf",
    },
  ];
  services = [
    {
      icon: "restart_alt",
      title: "Reinstatement",
      copy: "Restore your lapsed policy by submitting a reinstatement request and completing the required steps online.",
    },
    {
      icon: "person_edit",
      title: "Change of Beneficiary",
      copy: "Update your policy beneficiary details online by submitting a change in beneficiary request.",
    },
    {
      icon: "swap_horiz",
      title: "Fund Switch",
      copy: "Move your investment between available funds to better match your financial goals and risk preference.",
    },
    {
      icon: "list_alt",
      title: "Other Services",
      copy: "More self-service requests will be available soon. Check back for future updates.",
    },
  ];
  statusVariant(label: string) {
    return (
      (
        {
          Inforce: "warning",
          Lapsed: "danger",
          Terminated: "danger",
          Submitted: "success",
          Completed: "success",
          Draft: "warning",
        } as Record<string, string>
      )[label] || "neutral"
    );
  }
  stepItems = ["Select Policy", "Switch Your Fund", "Review & Submit"].map(
    (label) => ({ label }),
  );
  dropdownOptions(kind: string) {
    return this.options(kind).map((f) => ({ value: f.id, label: f.name }));
  }
  sumValues = (sum: number, fund: any) => sum + fund.value;
  navs = [
    "Dashboard",
    "Policy Details",
    "Documents",
    "Payments",
    "Investments",
    "Services",
  ];
  constructor() {
    const id = new URLSearchParams(location.search).get("scenario");
    if (!id || !this.m.launch(id)) this.m.restore();
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      const url = new URL(event.urlAfterRedirects, location.origin);
      const id = url.searchParams.get("scenario");
      if (id && id !== this.s.prototypeScenarioId && this.m.launch(id)) {
        this.sync();
        return;
      }
      const screen = url.pathname.replace(/^\/|\/$/g, "");
      const allowed = [
        "login",
        "dashboard",
        "services",
        "policy-details",
        "investments",
        "requests",
        "policy",
        "funds",
        "documents",
        "review",
        "success",
      ];
      if (allowed.includes(screen) && screen !== this.s.screen) {
        if (screen === "login" || this.s.loggedIn) {
          if (
            !["funds", "documents", "review", "success"].includes(screen) ||
            this.m.selectedPolicy()
          ) {
            this.s.screen = screen;
            this.s.activeNav =
              (
                {
                  dashboard: "Dashboard",
                  "policy-details": "Policy Details",
                  investments: "Investments",
                } as any
              )[screen] || "Services";
            this.sync();
          }
        }
      }
    });
    this.login.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.s.loginError = ""));
    afterNextRender(() => this.sync());
  }
  get activeStep() {
    return this.s.screen === "policy" ? 1 : this.s.screen === "review" ? 3 : 2;
  }
  get flowTitle() {
    return (
      {
        policy: "Select Policy",
        funds: "Switch your fund",
        documents: "Upload Documents",
        upload: "Upload Documents",
        review: "Review & Submit",
      } as any
    )[this.s.screen];
  }
  get flowDescription() {
    return (
      {
        policy: "Choose the policy you want to make fund switch for.",
        funds:
          "Choose the fund you want to switch from and the fund you want to switch to.",
        documents: "Upload the completed RPQ and IPS before continuing.",
        upload: "Upload the completed RPQ and IPS before continuing.",
        review:
          "Before proceeding, please carefully review the information you entered before submitting your fund switch request.",
      } as any
    )[this.s.screen];
  }
  get visiblePolicies() {
    const ids = [
      "810000085627",
      "810000086143",
      "810000087920",
      "810000088405",
    ];
    return this.m.policies.filter((p) =>
      this.s.scenarioPolicyId
        ? p.id === this.s.scenarioPolicyId
        : ids.includes(p.id),
    );
  }
  get ready() {
    return !!(
      this.s.sourceId &&
      this.s.targetId &&
      this.m.meetsMinimumSwitch() &&
      this.m.fullAllocationReady() &&
      this.s.fundCheck !== "checking"
    );
  }
  get nextDisabled() {
    return this.s.screen === "policy"
      ? !this.s.policyId
      : this.s.screen === "funds"
        ? !this.ready
        : ["documents", "upload"].includes(this.s.screen)
          ? !this.m.documentsUploaded()
          : !this.s.waiverAccepted ||
            this.s.submitting ||
            (this.m.requiresSupportingDocuments() &&
              !this.m.documentsUploaded());
  }
  get requestPolicy() {
    return (
      this.m.policies.find((p) => p.id === this.s.requestPolicyId) ||
      this.m.policies[0]
    );
  }
  get filteredScenarios() {
    return this.m.scenarios.filter((x) =>
      (x.title + " " + x.description + " " + x.category)
        .toLowerCase()
        .includes(this.search.toLowerCase()),
    );
  }
  options(kind: string) {
    return (
      kind === "source" ? this.m.policyFunds() : this.m.availablePolicyFunds()
    ).filter(
      (f) =>
        f.id !== (kind === "source" ? this.s.targetId : this.s.sourceId) &&
        !this.s.additionalSourceIds.includes(f.id) &&
        (kind !== "source" || f.value > 0),
    );
  }
  sync() {
    document.body.classList.toggle("public-mode", this.s.screen === "login");
    document.body.classList.toggle("account-mode", this.s.screen !== "login");
    document.body.classList.toggle("dialog-open", !!this.modal);
    document.body.classList.toggle("terms-open", this.modal === "terms");
    document.body.classList.toggle("mobile-nav-open", this.mobileOpen);
    document.title =
      (this.flowTitle || this.s.activeNav || "Log In") + " — EastWest Ageas";
  }
  go(screen: string, nav?: string) {
    this.s.screen = screen;
    if (nav) this.s.activeNav = nav;
    this.router.navigate(["/", screen === "login" ? "" : screen], {
      queryParams: {
        scenario: this.s.prototypeScenarioId || null,
        screen: null,
      },
      queryParamsHandling: "merge",
    });
    this.sync();
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("#app")
        ?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    });
  }
  navigate(nav: string) {
    this.mobileOpen = false;
    const screen: any = {
      Dashboard: "dashboard",
      "Policy Details": "policy-details",
      Services: "services",
      Investments: "investments",
    };
    if (screen[nav]) this.go(screen[nav], nav);
    else this.notify(nav + " is outside this prototype.");
    this.sync();
  }
  loginSubmit() {
    if (this.login.invalid) {
      this.s.loginError = "Enter your username and password to continue.";
      document
        .querySelector<HTMLElement>(
          this.login.controls.username.invalid
            ? "#login-username"
            : "#login-password",
        )
        ?.focus();
      return;
    }
    this.s.loggedIn = true;
    this.s.dashboardLoading = true;
    this.go("dashboard", "Dashboard");
    setTimeout(
      () => {
        this.s.dashboardLoading = false;
        if (this.s.screen === "dashboard") this.openModal("onboarding");
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 2000,
    );
  }
  start() {
    this.m.clearSignature();
    Object.assign(this.s, {
      prototypeScenarioId: "",
      scenarioPolicyId: "",
      policyId: "",
      sourceId: "",
      targetId: "",
      additionalSourceIds: [],
    });
    this.clearScenario();
    this.go("policy", "Services");
  }
  choosePolicy(id: string) {
    this.s.policyId = id;
    this.s.sourceId = "";
    this.s.targetId = "";
    this.s.additionalSourceIds = [];
    this.m.resetDocuments();
  }
  chooseFund(kind: string, id: string) {
    kind === "source" ? this.m.selectSource(id) : this.m.selectTarget(id);
    requestAnimationFrame(() =>
      document.getElementById(kind + "-fund")?.focus(),
    );
  }
  next() {
    if (this.nextDisabled) return;
    if (this.s.screen === "policy") {
      if (!this.m.selectedPolicy()?.fundSwitchEligible) {
        this.openModal("non-vul");
        return;
      }
      const scenario = prototypeScenarios.find(
        (x) => x.id === this.s.prototypeScenarioId,
      );
      if (
        scenario?.requiresPolicySelection &&
        scenario.state.policyId === this.s.policyId
      ) {
        const { screen, policyId, ...preset } = scenario.state;
        Object.assign(this.s, preset);
      }
      this.go("funds");
    } else if (this.s.screen === "funds")
      this.go(this.m.requiresSupportingDocuments() ? "documents" : "review");
    else if (["documents", "upload"].includes(this.s.screen)) this.go("review");
    else this.openModal("signature");
  }
  back() {
    this.go(
      this.s.screen === "policy"
        ? "services"
        : this.s.screen === "funds"
          ? "policy"
          : this.s.screen === "review"
            ? this.m.requiresSupportingDocuments()
              ? "documents"
              : "funds"
            : "funds",
    );
  }
  openModal(name: string) {
    if (name === "signature")
      this.signatureReturnFocus =
        document.querySelector<HTMLElement>("#flow-next button") ||
        (document.activeElement as HTMLElement);
    this.returnFocus = document.activeElement as HTMLElement;
    this.modal = name;
    this.sync();
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>('#dialog-root [role="dialog"]')
        ?.focus(),
    );
  }
  closeModal() {
    const focus =
      this.modal === "signature" ? this.signatureReturnFocus : this.returnFocus;
    this.modal = "";
    this.sync();
    requestAnimationFrame(() => {
      if (focus?.isConnected) focus.focus({ preventScroll: true });
    });
  }
  pending(policy: any) {
    this.modalPolicy = policy;
    this.openModal("pending");
  }
  launch(id: string) {
    this.closeModal();
    this.m.launch(id);
    this.router.navigate(["/"], {
      queryParams: { scenario: id },
      replaceUrl: true,
    });
    this.sync();
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>("#app")?.focus(),
    );
  }
  clearScenario() {
    this.router.navigate([], {
      queryParams: { scenario: null },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }
  downloadPrompt() {
    setTimeout(() => this.savePrompt(true), 0);
  }
  savePrompt(download = false) {
    this.draftReturnSignature = this.modal === "signature";
    this.fromDownload = download;
    this.openModal("draft");
  }
  cancelDraftPrompt() {
    if (this.draftReturnSignature) {
      this.modal = "signature";
      this.sync();
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>('#dialog-root [role="dialog"]')
          ?.focus(),
      );
    } else this.closeModal();
  }
  resumeDraft() {
    this.go(this.s.draftResumeScreen || "funds");
    if (this.s.draftResumeModal === "signature" && this.s.waiverAccepted)
      requestAnimationFrame(() => this.openModal("signature"));
  }
  saveDraft() {
    try {
      this.m.save(this.draftReturnSignature);
    } catch {
      this.notify(
        "Your draft could not be saved. Please try again before leaving.",
      );
      return;
    }
    this.s.prototypeScenarioId = "";
    this.closeModal();
    if (this.fromDownload) this.clearScenario();
    else this.go("services", "Services");
    this.notify("Continue from My Requests in Services.", true);
  }
  notify(copy: string, success = false) {
    this.toast = copy;
    this.toastSuccess = success;
    setTimeout(
      () => {
        if (this.toast === copy) this.toast = "";
      },
      success ? 6000 : 2600,
    );
  }
  submit() {
    if (
      this.modal !== "signature" ||
      this.nextDisabled ||
      !this.m.signatureReady()
    )
      return;
    this.s.submitting = true;
    const submittedState = this.s;
    setTimeout(() => {
      if (this.s !== submittedState) return;
      this.s.submitting = false;
      this.s.requestStatus = "Submitted";
      this.s.requestPolicyId = this.s.policyId;
      try {
        localStorage.removeItem("fund-switch-prototype-draft-v1");
      } catch {}
      this.closeModal();
      this.m.clearSignature();
      this.go("success");
    }, 2000);
  }
  requestSentAsset = matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "assets/figma-request-sent-static.png"
    : "assets/figma-request-sent.gif";
  focusLogin() {
    document.getElementById("login-username")?.focus();
  }
  @HostListener("window:resize")
  @HostListener("window:scroll")
  sizePortfolio() {
    const portfolio = document.querySelector<HTMLDetailsElement>(
      ".flow-portfolio-card[open]",
    );
    const panel = portfolio?.querySelector<HTMLElement>(
      ".flow-investment-breakdown",
    );
    if (!panel) return;
    const footerTop =
      document.querySelector(".flow-footer")?.getBoundingClientRect().top ??
      innerHeight;
    panel.style.maxHeight =
      Math.min(
        innerWidth <= 760 ? 303 : 330,
        Math.max(64, footerTop - panel.getBoundingClientRect().top - 8),
      ) + "px";
  }
  readonly submissionSteps = [
    {
      label: "Submitted",
      state: "completed" as const,
      number: "",
      description:
        "Your fund switch request is currently under review. We’ll notify you if additional information is required.",
    },
    { label: "In Progress", state: "upcoming" as const, number: "" },
    { label: "Completed", state: "upcoming" as const, number: "" },
  ];
  submittedDate = new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
  @HostListener("click", ["$event"]) handleClick(event: MouseEvent) {
    const el = event.target as HTMLElement;
    const c = el.closest<HTMLElement>("[data-action]");
    const portfolio = document.querySelector<HTMLDetailsElement>(
      ".flow-portfolio-card[open]",
    );
    if (portfolio && !portfolio.contains(el)) portfolio.open = false;
    if (!c) return;
    const action = c.dataset.action;
    if (action === "skip-onboarding") this.closeModal();
    else if (action === "explore-fund-switch") {
      this.closeModal();
      this.go("services", "Services");
      this.notify("Fund Switch is ready under Services.");
    } else if (action === "close-waiver-terms") this.closeModal();
    else if (action === "choose-another-policy") {
      this.closeModal();
      this.s.policyId = "";
      this.go("policy");
    } else if (action === "close-non-vul-modal") this.closeModal();
    else if (action === "explore-vul-policies") {
      this.closeModal();
      this.notify("Destination to be confirmed.");
    } else if (action === "open-policy-requests") this.go("requests");
    else if (action === "view-updated-policy")
      this.go("policy-details", "Policy Details");
    else if (action === "toolkit-info" || action === "public-info")
      this.notify("This link is outside the Fund Switch prototype.");
  }
  openMobile() {
    this.returnFocus = document.activeElement as HTMLElement;
    this.mobileOpen = true;
    this.sync();
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(".mobile-nav-panel")?.focus(),
    );
  }
  closeMobile() {
    this.mobileOpen = false;
    this.sync();
    requestAnimationFrame(() =>
      document.getElementById("mobile-menu")?.focus(),
    );
  }
  @HostListener("document:keydown", ["$event"]) key(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    const typing =
      target.matches("input,textarea,select") || target.isContentEditable;
    if (
      event.ctrlKey &&
      event.shiftKey &&
      !event.altKey &&
      !event.metaKey &&
      !event.repeat &&
      !typing &&
      event.key.toLowerCase() === "g"
    ) {
      event.preventDefault();
      this.guideHidden = !this.guideHidden;
      try {
        sessionStorage.setItem(
          "fund-switch-scenario-guide-hidden",
          String(this.guideHidden),
        );
      } catch {}
      return;
    }
    if (
      event.ctrlKey &&
      event.shiftKey &&
      !event.altKey &&
      !event.metaKey &&
      !event.repeat &&
      event.key.toLowerCase() === "h" &&
      !typing
    ) {
      event.preventDefault();
      try {
        localStorage.removeItem("fund-switch-prototype-draft-v1");
      } catch {
        this.notify(
          "Could not clear the saved draft. Please try restarting again.",
        );
        return;
      }
      location.replace(new URL("/", location.origin).href);
      return;
    }
    if (event.key === "Escape") {
      if (this.modal === "signature" && this.s.submitting) {
        event.preventDefault();
        return;
      }
      if (this.modal === "draft") {
        this.cancelDraftPrompt();
        return;
      }
      if (this.modal) this.closeModal();
      else if (this.mobileOpen) {
        this.mobileOpen = false;
        this.sync();
        requestAnimationFrame(() =>
          document.getElementById("mobile-menu")?.focus(),
        );
      }
    }
    if ((this.modal || this.mobileOpen) && event.key === "Tab") {
      const dialog = document.querySelector<HTMLElement>(
        this.mobileOpen ? ".mobile-nav-panel" : '#dialog-root [role="dialog"]',
      );
      const controls = Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input:not(:disabled),[tabindex="0"]:not([disabled])',
        ) || [],
      ).filter((e) => e.getClientRects().length);
      const first = controls[0],
        last = controls.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first?.focus();
      }
    }
  }
}
