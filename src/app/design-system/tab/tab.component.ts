import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DsTabSize } from './tab.model';

@Component({
  selector: 'ds-tab, app-tab',
  standalone: false,
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() label = 'Tab';
  @Input() size: DsTabSize = 'small';
  @Input() value = '';
  @Input() disabled = false;
  @Input() selected = false;
  @Input() showStatusIcon = false;
  @Input() statusIcon = 'warning';
  @Input() iconFill = true;
  @Input() showDisclosureIcon = false;
  @Input() disclosureIcon = 'keyboard_arrow_down';
  @Input() showBadge = false;
  @Input() badge: string | number = '#';
  @Input() showIndicator = false;

  @Output() tabSelected = new EventEmitter<void>();

  get isSelected(): boolean {
    return this.selected && !this.disabled;
  }

  get iconFontVariation(): string {
    return `'FILL' ${this.iconFill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`;
  }

  onSelect(): void {
    if (!this.disabled) {
      this.tabSelected.emit();
    }
  }
}
