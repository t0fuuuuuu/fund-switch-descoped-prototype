import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DsProgressBarVariant } from './progress-bar.model';

@Component({
  selector: 'ds-progress-bar, app-progress-bar',
  standalone: false,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  private _progress = 75;

  @Input() variant: DsProgressBarVariant = 'brand';
  @Input() ariaLabel = 'Progress';
  @Input() ariaValueText?: string;

  @Input()
  set progress(value: number) {
    this._progress = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  }

  get progress(): number {
    return this._progress;
  }

  get progressBarClasses(): Record<string, boolean> {
    return {
      [`ds-progress-bar--${this.variant}`]: true,
    };
  }
}
