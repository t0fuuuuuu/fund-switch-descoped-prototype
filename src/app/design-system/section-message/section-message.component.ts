import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DsSectionMessageAppearance, DsSectionMessageSize } from './section-message.model';

@Component({
  selector: 'ds-section-message, app-section-message',
  standalone: false,
  templateUrl: './section-message.component.html',
  styleUrls: ['./section-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionMessageComponent {
  @Input() title = 'Section Message';
  @Input() description = 'A section message is used to alert users to a particular section of the screen.';
  @Input() appearance: DsSectionMessageAppearance = 'info';
  @Input() size: DsSectionMessageSize = 'large';
  @Input() showTitle = true;
  @Input() showDescription = true;
  @Input() showAction1 = true;
  @Input() showAction2 = true;
  @Input() label1 = 'Action';
  @Input() label2 = 'Action';
  @Input() isDismissible = true;
  @Input() icon?: string | null;
  @Input() iconFill: boolean | null = null;
  @Input() fullWidth = false;

  @HostBinding('class.ds-section-message-host--full-width')
  get hasFullWidth(): boolean {
    return this.fullWidth;
  }

  @Output() action1Clicked = new EventEmitter<MouseEvent>();
  @Output() action2Clicked = new EventEmitter<MouseEvent>();
  @Output() dismissed = new EventEmitter<MouseEvent>();

  get resolvedIcon(): string {
    if (this.icon) {
      return this.icon;
    }

    const icons: Record<DsSectionMessageAppearance, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'warning',
      discovery: 'lightbulb',
    };

    return icons[this.appearance];
  }

  get iconFontVariation(): string {
    return `'FILL' ${this.resolvedIconFill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`;
  }

  get resolvedIconFill(): boolean {
    return this.iconFill ?? this.size === 'large';
  }

  get sectionMessageClasses(): Record<string, boolean> {
    return {
      [`ds-section-message--${this.appearance}`]: true,
      [`ds-section-message--${this.size}`]: true,
      'ds-section-message--without-title': !this.showTitle,
      'ds-section-message--without-description': !this.showDescription,
      'ds-section-message--without-dismiss': !this.isDismissible,
      'ds-section-message--full-width': this.fullWidth,
    };
  }
}
