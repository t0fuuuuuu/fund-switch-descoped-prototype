import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar.component';

@NgModule({
  declarations: [ProgressBarComponent],
  exports: [ProgressBarComponent],
  imports: [CommonModule],
})
export class ProgressBarModule {}
