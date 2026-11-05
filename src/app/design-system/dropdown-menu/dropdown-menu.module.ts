import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { RadioModule } from '../radio/radio.module';
import { TagModule } from '../tag/tag.module';
import { DsTextFieldModule } from '../text-field/text-field.module';
import { DsDropdownMenuComponent } from './dropdown-menu.component';

@NgModule({
  declarations: [DsDropdownMenuComponent],
  exports: [DsDropdownMenuComponent],
  imports: [CommonModule, CheckboxModule, RadioModule, TagModule, DsTextFieldModule],
})
export class DsDropdownMenuModule {}
