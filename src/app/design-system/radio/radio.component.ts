import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DsRadioChangeEvent } from './radio.model';

@Component({
  selector: 'ds-radio',
  standalone: false,
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  @Input() label = 'Label';
  @Input() inputId = '';
  @Input() ariaLabel = '';
  @Input() name?: string;
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() invalid = false;

  @Output() selectionChange = new EventEmitter<DsRadioChangeEvent>();

  onChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.selectionChange.emit({ checked: input.checked, value: this.value });
  }
}
