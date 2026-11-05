import { EWA_COMPONENTS } from "./design-system";
import { Component, inject } from "@angular/core";
import { PrototypeState } from "./prototype-state.service";
import { MessageComponent } from "./shared-ui";
@Component({
  selector: "fund-summary",
  standalone: true,
  imports: [...EWA_COMPONENTS, MessageComponent],
  template: ` @if (m.requiresFullAllocationSwitch()) {
      <ui-message
        class="full-allocation-notice"
        tone="success"
        title="Your Eligible Funds Will Switch Together"
        >{{ m.selectedSourceAllocation() }}% of your eligible policy allocation
        will move to {{ m.selectedTarget()?.name }}.</ui-message
      >
    }
    <section class="switch-summary" aria-labelledby="switch-summary-title">
      <h2 id="switch-summary-title">Fund Switch Summary</h2>
      <p class="summary-intro">Please review your switch details.</p>
      <table class="summary-comparison-table">
        <thead>
          <tr>
            <th scope="col">
              <strong>From</strong
              ><span>Current Funds · {{ m.selectedSourceAllocation() }}%</span>
            </th>
            <th scope="col">
              <strong>To</strong><span>Target Fund · 100%</span>
            </th>
          </tr>
        </thead>
        <tbody>
          @for (
            source of m.selectedSources();
            track source.id;
            let i = $index
          ) {
            <tr>
              <td>{{ source.name }} ({{ m.switchableAllocation(source) }}%)</td>
              @if (i === 0) {
                <td [attr.rowspan]="m.selectedSources().length">
                  {{ m.selectedTarget()?.name }} (100%)
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
      <div class="summary-amount">
        <span>Total Amount to Switch</span
        ><strong>{{ m.money(m.switchAmount()) }}</strong>
      </div>
    </section>`,
})
export class FundSummaryComponent {
  m = inject(PrototypeState);
}
