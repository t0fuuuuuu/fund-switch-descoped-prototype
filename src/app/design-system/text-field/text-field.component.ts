import {ControlValueAccessor,NG_VALUE_ACCESSOR} from '@angular/forms';
import { ChangeDetectorRef, forwardRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type DsTextFieldType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

@Component({
  selector: 'ds-text-field',
  providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>DsTextFieldComponent),multi:true}],
  standalone: false,
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTextFieldComponent implements ControlValueAccessor {
  constructor(private readonly cdr:ChangeDetectorRef){}
  @Input() autocomplete='';
  @Input() trailingActionLabel='';
  @Output() trailingAction=new EventEmitter<void>();
  private onControlChange: (value:string)=>void=()=>{};
  onTouched: ()=>void=()=>{};
  writeValue(value:string|null):void{this.value=value??'';this.cdr.markForCheck();}
  registerOnChange(fn:(value:string)=>void):void{this.onControlChange=fn;}
  registerOnTouched(fn:()=>void):void{this.onTouched=fn;}
  setDisabledState(disabled:boolean):void{this.disabled=disabled;this.cdr.markForCheck();}

  @Input() label = 'Label';
  @Input() showLabelIcon = false;
  @Input() labelIcon = 'info';
  @Input() labelIconFill = false;
  @Input() ariaLabel = '';
  @Input() inputId = '';
  @Input() name = '';
  @Input() type: DsTextFieldType = 'text';
  @Input() value = '';
  @Input() placeholder = 'Placeholder';
  @Input() helperText = '';
  @Input() leadingIcon = '';
  @Input() trailingIcon = '';
  @Input() trailingIconAsset = '';
  @Input() prefixIcon = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() width = 240;
  @Input() fluid = false;
  @Input() compact = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() invalid = false;
  @Input() errorText = '';
  @Input() selectTrigger = false;
  @Input() editableTrigger = false;
  @Input() projectedValue = false;
  @Input() projectedValueEditable = false;
  @Input() popupOpen = false;
  @Input() popupId = '';
  @Input() popupType: 'dialog' | 'listbox' = 'listbox';

  @Output() valueChange = new EventEmitter<string>();

  get describedBy(): string | null {
    if (!this.inputId) return null;

    const ids = [
      this.helperText ? `${this.inputId}-helper` : '',
      this.invalid && this.errorText ? `${this.inputId}-error` : '',
    ].filter(Boolean);

    return ids.length ? ids.join(' ') : null;
  }

  handleInput(event: Event): void {
    const value=(event.target as HTMLInputElement).value;this.value=value;this.onControlChange(value);this.valueChange.emit(value);
  }
}
