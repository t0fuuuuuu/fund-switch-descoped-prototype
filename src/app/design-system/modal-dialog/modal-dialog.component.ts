import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DsButtonEmphasis, DsButtonSize, DsButtonVariant } from '../button/button.model';
import { DsModalDialogAlignment, DsModalDialogSize } from './modal-dialog.model';

@Directive({
  selector: '[dsModalDialogActions]',
  standalone: false,
})
export class DsModalDialogActionsDirective {
  @Input() layout: 'row' | 'column' = 'row';
  @Input() alignment: DsModalDialogAlignment = DsModalDialogAlignment.Right;
  @Input() fullWidth = false;
  @Input() fillContainer = false;
  @Input() visible = true;

  @HostBinding('class.ds-modal-dialog__actions-content') readonly actionsClass = true;
  @HostBinding('style.display')
  get display(): 'flex' | 'none' {
    return this.visible ? 'flex' : 'none';
  }
  @HostBinding('style.alignItems')
  get alignItems(): string {
    return this.layout === 'column' ? 'stretch' : 'center';
  }

  @HostBinding('style.flexDirection')
  get flexDirection(): 'row' | 'column' {
    return this.layout;
  }

  @HostBinding('style.gap') readonly gap = 'var(--space-lg)';
  @HostBinding('style.justifyContent')
  get hostJustifyContent(): string {
    return this.justifyContent;
  }

  @HostBinding('style.maxWidth') readonly maxWidth = '100%';
  @HostBinding('style.width')
  get width(): string {
    return this.fullWidth || this.fillContainer ? '100%' : 'auto';
  }

  get justifyContent(): string {
    if (this.layout === 'column') {
      return 'center';
    }

    const justify: Record<DsModalDialogAlignment, string> = {
      [DsModalDialogAlignment.Left]: 'flex-start',
      [DsModalDialogAlignment.Center]: 'center',
      [DsModalDialogAlignment.Right]: 'flex-end',
    };

    return justify[this.alignment];
  }
}

@Component({
  selector: 'ds-modal-dialog',
  standalone: false,
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent implements OnChanges {
  readonly DsButtonEmphasis = DsButtonEmphasis;
  readonly DsButtonVariant = DsButtonVariant;

  @Input() size: DsModalDialogSize = DsModalDialogSize.FullScreen;
  @Input() alignment: DsModalDialogAlignment = DsModalDialogAlignment.Left;
  @Input() isDismissible = true;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledby?: string;
  @Input() ariaDescribedby?: string;
  @Input() ariaModal = false;
  @Input() panelClass = '';

  @Output() dismissed = new EventEmitter<MouseEvent>();

  private projectedActions?: DsModalDialogActionsDirective;

  @ContentChild(DsModalDialogActionsDirective)
  set actionsSlot(value: DsModalDialogActionsDirective | undefined) {
    this.projectedActions = value;
    this.updateActionsLayout();
  }

  get actionsSlot(): DsModalDialogActionsDirective | undefined {
    return this.projectedActions;
  }

  get hasActions(): boolean {
    return !!this.actionsSlot;
  }

  get dismissButtonSize(): DsButtonSize {
    return this.size === DsModalDialogSize.FullScreen ? DsButtonSize.Medium : DsButtonSize.Small;
  }

  get modalDialogClasses(): Record<string, boolean> {
    return {
      [`ds-modal-dialog--${this.size}`]: true,
      [`ds-modal-dialog--${this.alignment}`]: true,
      'ds-modal-dialog--dismissible': this.isDismissible,
    };
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateActionsLayout();
  }

  dismiss(event: MouseEvent): void {
    this.dismissed.emit(event);
  }

  private updateActionsLayout(): void {
    if (!this.projectedActions) {
      return;
    }

    this.projectedActions.layout = this.size === DsModalDialogSize.Small ? 'column' : 'row';
    this.projectedActions.alignment = this.alignment;
    this.projectedActions.fullWidth = this.size === DsModalDialogSize.Small;
  }
}
