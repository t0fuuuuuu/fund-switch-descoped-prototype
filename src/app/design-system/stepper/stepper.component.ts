import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DsButtonSize, DsButtonVariant } from '../button/button.model';
import { StepperOrientation, StepperStep, StepperVisualState } from './stepper.model';

@Component({
  selector: 'ds-stepper, app-stepper',
  standalone: false,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  private _currentIndex = 0;

  readonly DsButtonSize = DsButtonSize;
  readonly DsButtonVariant = DsButtonVariant;

  @Input() steps: StepperStep[] = [];
  @Input() orientation: StepperOrientation = 'vertical';
  @Input() showLeftConnector = true;
  @Input() showRightConnector = true;
  @Input() backLabel = 'Back';
  @Input() nextLabel = 'Next';
  @Input() showPreviewControls = false;
  @Input() clickableSteps = false;
  @Input() icon = 'docs';

  @Output() currentIndexChange = new EventEmitter<number>();
  @Output() stepChange = new EventEmitter<StepperStep>();

  @Input()
  set currentIndex(value: number) {
    this._currentIndex = Number.isFinite(value) ? Math.trunc(value) : 0;
  }

  get currentIndex(): number {
    return this.resolvedCurrentIndex;
  }

  get resolvedCurrentIndex(): number {
    if (this.steps.length === 0) {
      return 0;
    }

    return Math.min(Math.max(this._currentIndex, 0), this.steps.length - 1);
  }

  get canGoBack(): boolean {
    return this.getAvailableStepIndex(this.resolvedCurrentIndex - 1) !== null;
  }

  get canGoNext(): boolean {
    return this.getAvailableStepIndex(this.resolvedCurrentIndex + 1) !== null;
  }

  get hostClasses(): Record<string, boolean> {
    return {
      [`ds-stepper--${this.orientation}`]: true,
      'ds-stepper--clickable': this.clickableSteps,
      'ds-stepper--hide-left-connector': !this.showLeftConnector,
      'ds-stepper--hide-right-connector': !this.showRightConnector,
    };
  }

  getStepNumber(step: StepperStep, index: number): number | string {
    return step.number ?? index + 1;
  }

  getStepVisualState(step: StepperStep, index: number): StepperVisualState {
    if (step.state) {
      return step.state;
    }

    if (index < this.resolvedCurrentIndex) {
      return 'completed';
    }

    if (index === this.resolvedCurrentIndex) {
      return 'current';
    }

    return 'upcoming';
  }

  getStepClasses(step: StepperStep, index: number): Record<string, boolean> {
    const visualState = this.getStepVisualState(step, index);
    const usesIconIndicator = step.indicator === 'icon' && this.supportsIconIndicator(visualState);

    return {
      [`ds-stepper__item--${visualState}`]: true,
      'ds-stepper__item--clickable': this.isStepClickable(step),
      'ds-stepper__item--icon-indicator': usesIconIndicator,
    };
  }

  getIndicatorIcon(step: StepperStep, index: number): string | null {
    const visualState = this.getStepVisualState(step, index);

    if (visualState === 'completed') {
      return 'check_circle';
    }

    if (visualState === 'incomplete') {
      return 'warning';
    }

    if (step.indicator === 'icon' && this.supportsIconIndicator(visualState)) {
      return step.icon || this.icon;
    }

    if (visualState === 'current' || visualState === 'upcoming' || visualState === 'disabled') {
      return 'circle';
    }

    return null;
  }

  shouldShowStepNumber(step: StepperStep, index: number): boolean {
    const visualState = this.getStepVisualState(step, index);
    return !this.usesIconIndicator(step, index) &&
      (visualState === 'current' || visualState === 'upcoming' || visualState === 'disabled');
  }

  getIconFontVariation(step: StepperStep, index: number): string | null {
    const visualState = this.getStepVisualState(step, index);

    if (this.usesIconIndicator(step, index)) {
      const fill = visualState === 'current';
      return `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`;
    }

    return null;
  }

  private usesIconIndicator(step: StepperStep, index: number): boolean {
    return step.indicator === 'icon' && this.supportsIconIndicator(this.getStepVisualState(step, index));
  }

  private supportsIconIndicator(state: StepperVisualState): boolean {
    return state === 'current' || state === 'upcoming' || state === 'disabled';
  }

  isStepDisabled(step: StepperStep): boolean {
    return step.state === 'disabled';
  }

  isStepBlocked(step: StepperStep): boolean {
    return this.isStepDisabled(step) || step.state === 'incomplete';
  }

  isStepClickable(step: StepperStep): boolean {
    return this.clickableSteps && !this.isStepBlocked(step);
  }

  getAriaCurrent(step: StepperStep, index: number): 'step' | null {
    return this.getStepVisualState(step, index) === 'current' ? 'step' : null;
  }

  getStepAriaLabel(step: StepperStep, index: number): string {
    const visualState = this.getStepVisualState(step, index);
    return `${step.label}, step ${this.getStepNumber(step, index)}, ${visualState}`;
  }

  onStepClick(step: StepperStep, index: number): void {
    if (!this.isStepClickable(step)) {
      return;
    }

    this.setCurrentIndex(index);
  }

  onStepKeydown(event: KeyboardEvent, index: number): void {
    if (!this.clickableSteps) {
      return;
    }

    const targetIndex = this.getKeyboardTargetIndex(event.key, index);

    if (targetIndex === null) {
      return;
    }

    event.preventDefault();
    this.focusStep(targetIndex);
  }

  goBack(): void {
    const previousIndex = this.getAvailableStepIndex(this.resolvedCurrentIndex - 1);

    if (previousIndex !== null) {
      this.setCurrentIndex(previousIndex);
    }
  }

  goNext(): void {
    const nextIndex = this.getAvailableStepIndex(this.resolvedCurrentIndex + 1);

    if (nextIndex !== null) {
      this.setCurrentIndex(nextIndex);
    }
  }

  private setCurrentIndex(index: number): void {
    const nextIndex = Math.min(Math.max(index, 0), this.steps.length - 1);
    const nextStep = this.steps[nextIndex];

    if (!nextStep || this.isStepBlocked(nextStep)) {
      return;
    }

    this._currentIndex = nextIndex;
    this.currentIndexChange.emit(nextIndex);
    this.stepChange.emit(nextStep);
  }

  private getKeyboardTargetIndex(key: string, index: number): number | null {
    if (key === 'Home') {
      return this.getAvailableStepIndex(0);
    }

    if (key === 'End') {
      return this.getAvailableStepIndex(this.steps.length - 1);
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      return this.getAvailableStepIndex(index + 1);
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      return this.getAvailableStepIndex(index - 1);
    }

    return null;
  }

  private getAvailableStepIndex(index: number): number | null {
    const step = this.steps[index];
    return step && !this.isStepBlocked(step) ? index : null;
  }

  private focusStep(index: number): void {
    const step = this.steps[index];

    if (!step || !this.isStepClickable(step)) {
      return;
    }

    this.setCurrentIndex(index);

    window.requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`[data-stepper-index="${index}"]`);
      element?.focus();
    });
  }
}
