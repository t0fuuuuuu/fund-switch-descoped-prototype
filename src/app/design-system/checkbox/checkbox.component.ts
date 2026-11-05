import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DsCheckboxChangeEvent } from './checkbox.model';

@Component({
  selector: 'ds-checkbox',
  standalone: false,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  @Input() label = 'Label';
  @Input() inputId = '';
  @Input() ariaLabelledby = '';
  @Input() name?: string;
  @Input() value = '';
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() required = false;

  @Output() selectionChange = new EventEmitter<DsCheckboxChangeEvent>();

  onChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false;
    this.selectionChange.emit({ checked: input.checked, value: this.value });
  }
}
