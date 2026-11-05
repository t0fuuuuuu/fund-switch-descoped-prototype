import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { StepperComponent } from './stepper.component';

@NgModule({
  declarations: [StepperComponent],
  exports: [StepperComponent],
  imports: [CommonModule, ButtonModule],
})
export class StepperModule {}
