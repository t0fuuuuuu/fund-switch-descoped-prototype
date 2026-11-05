import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DsButtonEmphasis, DsButtonIcon, DsButtonSize, DsButtonVariant } from './button.model';

@Component({
  selector: 'ds-button, app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private _emphasis: DsButtonEmphasis = DsButtonEmphasis.DEFAULT;

  @Input() label = 'Button';
  @Input() useProjectedContent=false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: DsButtonVariant = DsButtonVariant.Primary;
  @Input() size: DsButtonSize = DsButtonSize.Medium;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() skeleton = false;
  @Input() leftIcon: DsButtonIcon = null;
  @Input() rightIcon: DsButtonIcon = null;
  @Input() iconFill = true;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Input() ariaExpanded?: boolean;
  @Input() ariaControls?: string;
  @Input() ariaPressed?: boolean;

  @Output() clicked = new EventEmitter<MouseEvent>();

  @HostBinding('class.ds-button-host--full-width')
  get hasFullWidth(): boolean {
    return this.fullWidth;
  }

  @Input()
  set emphasis(value: DsButtonEmphasis) {
    this._emphasis = value ?? DsButtonEmphasis.DEFAULT;
  }

  get emphasis(): DsButtonEmphasis {
    return this._emphasis;
  }

  @Input()
  set appearance(value: DsButtonEmphasis) {
    this.emphasis = value;
  }

  get appearance(): DsButtonEmphasis {
    return this.emphasis;
  }

  get isInteractionDisabled(): boolean {
    return this.disabled || this.isLoading || this.skeleton;
  }

  get isLoading(): boolean {
    return this.loading && !this.disabled && !this.skeleton;
  }

  get iconFontVariation(): string {
    return `'FILL' ${this.iconFill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`;
  }

  get resolvedEmphasis(): DsButtonEmphasis {
    if (this.variant === DsButtonVariant.Subtle && this.emphasis !== DsButtonEmphasis.DEFAULT) {
      return DsButtonEmphasis.DEFAULT;
    }

    return this.emphasis;
  }

  get buttonClasses(): Record<string, boolean> {
    return {
      [`ds-button--${this.variant}`]: true,
      [`ds-button--${this.resolvedEmphasis}`]: true,
      [`ds-button--${this.size}`]: true,
      'ds-button--full-width': this.fullWidth,
      'ds-button--loading': this.isLoading,
      'ds-button--skeleton': this.skeleton,
      'ds-button--icon-only': !this.label && (!!this.leftIcon || !!this.rightIcon),
    };
  }

  handleClick(event: MouseEvent): void {
    if (this.isInteractionDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.clicked.emit(event);
  }
}
