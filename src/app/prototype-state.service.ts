import {
  PrototypeData,
  Holding,
  UploadMetadata,
  SignatureState,
} from "./prototype.models";
import { Injectable } from "@angular/core";
import {
  initialState,
  policies,
  funds,
  policyHoldings,
  productFundMatrix,
  prototypeScenarios,
} from "./mock-data";
@Injectable({ providedIn: "root" })
export class PrototypeState {
  state: PrototypeData = initialState() as PrototypeData;
  signature: SignatureState = {
    image: "",
    country: "Philippines",
    city: "",
    district: "",
  };
  clearSignature() {
    this.signature = {
      image: "",
      country: "Philippines",
      city: "",
      district: "",
    };
  }
  signatureReady() {
    const s = this.signature;
    return !!(s.image && s.country && s.city && s.district);
  }
  private fundTimer: ReturnType<typeof setTimeout>;
  policies = policies;
  scenarios = prototypeScenarios;
  money(value: number, currency = this.selectedPolicy()?.currency || "PHP") {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency,
      currencyDisplay: currency === "USD" ? "code" : "symbol",
      maximumFractionDigits: 2,
    }).format(value || 0);
  }

  selectedPolicy() {
    return policies.find((policy) => policy.id === this.state.policyId);
  }
  policyFunds(policyId = this.state.policyId): Holding[] {
    return (policyHoldings[policyId] || []).map((holding) => ({
      ...funds.find((fund) => fund.id === holding.id),
      ...holding,
    }));
  }
  availablePolicyFunds() {
    const policy = this.selectedPolicy();
    const currency = policy?.currency;
    const allowedFundIds = productFundMatrix[policy?.productKey] || [];
    const holdings = this.policyFunds();
    return funds
      .filter(
        (fund) =>
          fund.currency === currency && allowedFundIds.includes(fund.id),
      )
      .map((fund) => ({
        ...fund,
        ...(holdings.find((holding) => holding.id === fund.id) || {
          allocation: 0,
          value: 0,
        }),
      }));
  }
  selectedSource() {
    return this.policyFunds().find((fund) => fund.id === this.state.sourceId);
  }
  selectedTarget() {
    return this.availablePolicyFunds().find(
      (fund) => fund.id === this.state.targetId,
    );
  }
  selectedSources() {
    if (this.requiresFullAllocationSwitch())
      return this.policyFunds().filter(
        (fund) =>
          fund.value > 0 &&
          fund.id !== this.state.targetId &&
          this.switchableAllocation(fund) > 0,
      );
    const ids = [
      this.state.sourceId,
      ...(this.state.additionalSourceIds || []),
    ].filter(Boolean);
    return this.policyFunds().filter((fund) => ids.includes(fund.id));
  }
  switchableAllocation(fund: Holding) {
    return fund?.switchableAllocation ?? fund?.allocation ?? 0;
  }
  switchableValue(fund: Holding) {
    return fund?.switchableValue ?? fund?.value ?? 0;
  }
  selectedSourceAllocation() {
    return this.selectedSources().reduce(
      (sum, fund) => sum + this.switchableAllocation(fund),
      0,
    );
  }
  requiresFullAllocationSwitch() {
    return this.selectedTarget()?.id === "dollar-income";
  }
  maximumSelectableAllocation() {
    return this.policyFunds()
      .filter((fund) => fund.value > 0 && fund.id !== this.state.targetId)
      .reduce((sum, fund) => sum + this.switchableAllocation(fund), 0);
  }
  canReachFullAllocation() {
    return this.maximumSelectableAllocation() >= 100;
  }
  fullAllocationReady() {
    return (
      !this.requiresFullAllocationSwitch() ||
      (this.canReachFullAllocation() && this.selectedSourceAllocation() === 100)
    );
  }
  requiresRiskAssessment() {
    const source = this.selectedSource();
    const target = this.selectedTarget();
    return Boolean(source && target && target.riskScore > source.riskScore);
  }
  // Prototype routing rule only; Business and Compliance must confirm production document criteria.
  requiresSupportingDocuments() {
    return this.requiresRiskAssessment();
  }
  riskScoreForProfile(profile) {
    return (
      {
        "Moderately Conservative": 3,
        Moderate: 6,
        "Moderately Aggressive": 7,
        Aggressive: 9,
      }[profile] || 0
    );
  }
  resultAligned() {
    return Boolean(
      this.selectedTarget() &&
      this.riskScoreForProfile(this.state.rpqResult) >=
        this.selectedTarget().riskScore,
    );
  }
  riskGateComplete() {
    return (
      !this.requiresRiskAssessment() ||
      (this.resultAligned()
        ? this.state.ipsAccepted
        : this.state.waiverAccepted)
    );
  }
  switchAmount() {
    return this.selectedSources().reduce(
      (sum, source) => sum + this.switchableValue(source),
      0,
    );
  }
  minimumSwitchAmount(currency = this.selectedPolicy()?.currency) {
    return currency === "USD" ? 500 : 10000;
  }
  meetsMinimumSwitch() {
    return Boolean(
      this.selectedSource() &&
      this.switchAmount() >= this.minimumSwitchAmount(),
    );
  }
  hasPendingRequest(policy) {
    return Boolean(
      policy.pendingRequest ||
      (this.state.requestPolicyId === policy.id &&
        [
          "Draft",
          "Submitted",
          "In Progress",
          "Additional Documents Required",
        ].includes(this.state.requestStatus)),
    );
  }

  selectSource(id: string) {
    if (this.state.sourceId === id) return;
    this.state.sourceId = id;
    this.state.targetId = "";
    this.state.additionalSourceIds = [];
    this.resetDocuments();
  }
  selectTarget(id: string) {
    if (this.state.targetId === id) return;
    clearTimeout(this.fundTimer);
    this.state.targetId = id;
    this.state.waiverAccepted = false;
    this.resetDocuments();
    this.state.fundCheck = "checking";
    this.fundTimer = setTimeout(() => {
      if (this.state.targetId === id) this.state.fundCheck = "complete";
    }, 1000);
  }
  resetDocuments() {
    this.clearSignature();
    this.state.documentUploads = {
      rpq: { status: "empty", name: "" },
      ips: { status: "empty", name: "" },
    };
    this.state.waiverAccepted = false;
  }
  launch(id: string) {
    this.clearSignature();
    clearTimeout(this.fundTimer);
    const scenario = this.scenarios.find((x) => x.id === id);
    if (!scenario) return false;
    const preset: any = { ...scenario.state };
    if (scenario.requiresPolicySelection) {
      Object.assign(preset, {
        screen: "policy",
        scenarioPolicyId: preset.policyId,
        policyId: "",
        sourceId: "",
        targetId: "",
        additionalSourceIds: [],
        fundCheck: "idle",
      });
    }
    this.state = {
      ...initialState(),
      loggedIn: true,
      activeNav: "Services",
      prototypeScenarioId: id,
      ...preset,
    };
    return true;
  }
  documentsUploaded() {
    return ["rpq", "ips"].every(
      (k) => this.state.documentUploads[k].status === "uploaded",
    );
  }
  chooseFile(kind: string, file?: File) {
    if (!file) return;
    this.clearSignature();
    const valid =
      /\.(pdf|png|jpe?g)$/i.test(file.name) &&
      (!file.type ||
        ["application/pdf", "image/png", "image/jpeg"].includes(file.type));
    this.state.documentUploads[kind] = {
      name: file.name,
      status: !valid
        ? "error-type"
        : file.size > 5 * 1024 * 1024
          ? "error-size"
          : "selected",
    };
    this.state.waiverAccepted = false;
  }
  upload(kind: string) {
    const upload = this.state.documentUploads[kind];
    upload.status = "uploading";
    upload.progress = 0;
    const advance = () => {
      if (this.state.documentUploads[kind] !== upload) return;
      upload.progress += 25;
      if (upload.progress === 100) upload.status = "uploaded";
      else setTimeout(advance, 250);
    };
    setTimeout(advance, 250);
  }
  restore() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("fund-switch-prototype-draft-v1") || "null",
      );
      if (
        saved?.requestStatus === "Draft" &&
        policies.some((p) => p.id === saved.policyId)
      ) {
        this.state = {
          ...initialState(),
          ...saved,
          loggedIn: true,
          activeNav: "Services",
          screen: "services",
          waiverAccepted: false,
        };
      }
    } catch {}
  }
  save(resumeSignature = false) {
    const s = this.state;
    const draft = {
      requestStatus: "Draft",
      requestPolicyId: s.policyId,
      draftResumeScreen: s.screen,
      draftResumeModal: resumeSignature ? "signature" : "",
      policyId: s.policyId,
      sourceId: s.sourceId,
      targetId: s.targetId,
      additionalSourceIds: [...s.additionalSourceIds],
      fundCheck: "complete",
      documentUploads: Object.fromEntries(
        Object.entries(s.documentUploads).map(([k, v]: [string, any]) => [
          k,
          v.status === "uploaded"
            ? { status: "uploaded", name: v.name }
            : { status: "empty", name: "" },
        ]),
      ),
    };
    localStorage.setItem(
      "fund-switch-prototype-draft-v1",
      JSON.stringify(draft),
    );
    Object.assign(s, {
      requestStatus: "Draft",
      requestPolicyId: s.policyId,
      draftResumeScreen: s.screen,
      draftResumeModal: resumeSignature ? "signature" : "",
    });
  }
}
