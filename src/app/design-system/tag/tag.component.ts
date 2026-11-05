import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DsTagIcon, DsTagVariant } from './tag.model';

@Component({
  selector: 'ds-tag, app-tag',
  standalone: false,
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() label = 'Tag';
  @Input() variant: DsTagVariant = DsTagVariant.Neutral;
  @Input() leadingIcon: DsTagIcon = null;
  @Input() removable = false;
  @Input() disabled = false;

  @Output() removed = new EventEmitter<void>();

  get tagClasses(): Record<string, boolean> {
    return {
      [`ds-tag--${this.variant}`]: true,
      'ds-tag--removable': this.removable,
      'ds-tag--disabled': this.disabled,
    };
  }

  get removeAriaLabel(): string {
    return `Remove ${this.label || 'tag'}`;
  }

  handleRemove(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.removed.emit();
  }
}
