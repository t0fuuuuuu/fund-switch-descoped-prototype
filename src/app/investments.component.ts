import { EWA_COMPONENTS } from "./design-system";
import {
  Component,
  EventEmitter,
  Output,
  inject,
  afterNextRender,
} from "@angular/core";
import { PrototypeState } from "./prototype-state.service";
import { investmentFunds, investmentPolicies } from "./mock-data";
import { IconComponent } from "./shared-ui";
@Component({
  selector: "portal-investments",
  standalone: true,
  imports: [...EWA_COMPONENTS, IconComponent],
  templateUrl: "./investments.component.html",
})
export class InvestmentsComponent {
  m = inject(PrototypeState);
  policies = investmentPolicies;
  funds = investmentFunds;
  periods = ["6 Months", "1 Year", "3 Years", "5 Years", "Date Range"];
  @Output() switchFund = new EventEmitter<{
    policyId: string;
    sourceId: string;
  }>();
  @Output() notice = new EventEmitter<string>();
  periodTabs = this.periods.map((label) => ({ label, value: label }));
  constructor() {
    afterNextRender(() => this.drawCharts());
  }
  drawCharts() {
    const palette: any = {
      income: "#b31972",
      asian: "#0b9677",
      bond: "#21cbe1",
      balanced: "#ff9900",
      active: "#ff5c24",
      dividend: "#23458f",
      esg: "#7740a4",
      global: "#3f4852",
      reit: "#fa2b55",
      strategic: "#6683ff",
    };
    document
      .querySelectorAll<HTMLCanvasElement>(".fund-performance-chart")
      .forEach((canvas, index) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const ratio = devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * ratio));
        canvas.height = Math.max(1, Math.floor(rect.height * ratio));
        ctx.scale(ratio, ratio);
        const width = rect.width,
          height = rect.height,
          seed = (index + 1) * 1.83;
        ctx.strokeStyle = palette[canvas.dataset["chart"]];
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let step = 0; step <= 56; step++) {
          const x = (step / 56) * width,
            movement =
              Math.sin(step * (0.19 + (index % 3) * 0.02) + seed) * 13 +
              Math.sin(step * 0.61 + seed) * 5,
            trend =
              (index % 4 === 0 ? step * 0.1 : -step * 0.23) +
              (index % 3 === 1 ? step * 0.38 : 0),
            y = Math.min(
              height - 3,
              Math.max(3, height * 0.62 + movement - trend),
            );
          if (step === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
  }
}
