import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { DsModalDialogActionsDirective, ModalDialogComponent } from './modal-dialog.component';

@NgModule({
  declarations: [DsModalDialogActionsDirective, ModalDialogComponent],
  exports: [DsModalDialogActionsDirective, ModalDialogComponent],
  imports: [ButtonModule, CommonModule],
})
export class ModalDialogModule {}
