import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabGroupComponent } from './tab-group.component';
import { TabComponent } from './tab.component';

@NgModule({
  declarations: [TabComponent, TabGroupComponent],
  exports: [TabComponent, TabGroupComponent],
  imports: [CommonModule],
})
export class TabModule {}
