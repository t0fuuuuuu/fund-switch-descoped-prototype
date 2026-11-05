import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SectionMessageComponent } from './section-message.component';

@NgModule({
  declarations: [SectionMessageComponent],
  exports: [SectionMessageComponent],
  imports: [CommonModule],
})
export class SectionMessageModule {}
