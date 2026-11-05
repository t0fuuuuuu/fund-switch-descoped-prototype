import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioComponent } from './radio.component';

@NgModule({
  declarations: [RadioComponent],
  exports: [RadioComponent],
  imports: [CommonModule],
})
export class RadioModule {}
