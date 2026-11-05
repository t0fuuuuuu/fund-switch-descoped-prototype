import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DsLinkSize, DsLinkVariant } from './link.model';

@Component({
  selector: 'ds-link, app-link',
  standalone: false,
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  @Input() label = 'Link';
  @Input() href = '#';
  @Input() download: string | boolean | null = null;
  @Input() size: DsLinkSize = 16;
  @Input() variant: DsLinkVariant = 'default';
  @Input() icon = 'chevron_right';
  @Input() target?: string;
  @Input() ariaLabel?: string;
  @Input() ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

  get linkClasses(): Record<string, boolean> {
    return {
      [`ds-link--size-${this.size}`]: true,
      [`ds-link--${this.variant}`]: true,
    };
  }

  get showsIcon(): boolean {
    return this.variant.endsWith('-with-icon') && !!this.icon;
  }

  get isStrong(): boolean {
    return this.variant === 'strong' || this.variant === 'strong-with-icon';
  }

  get visualVariant(): string {
    if (this.variant === 'inline') return 'default';
    return this.variant.replace(/-with-icon$/, '');
  }

  get rel(): string | null {
    return this.target === '_blank' ? 'noopener noreferrer' : null;
  }
}
