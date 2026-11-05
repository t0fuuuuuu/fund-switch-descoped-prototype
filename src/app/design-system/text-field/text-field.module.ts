import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DsTextFieldComponent } from './text-field.component';

@NgModule({
  declarations: [DsTextFieldComponent],
  exports: [DsTextFieldComponent],
  imports: [CommonModule],
})
export class DsTextFieldModule {}
