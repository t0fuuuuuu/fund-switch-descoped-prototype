import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DsTabAlignment, DsTabItem, DsTabOverflowItem, DsTabOverflowMode, DsTabSize } from './tab.model';

@Component({
  selector: 'ds-tab-group, app-tab-group',
  standalone: false,
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() tabs: DsTabItem[] = [];
  @Input() selectedIndex = 0;
  @Input() alignment: DsTabAlignment = 'left';
  @Input() size: DsTabSize = 'small';
  @Input() overflowMode: DsTabOverflowMode = 'auto';
  /** Compatibility override. When provided, true forces the trigger and false suppresses it. */
  @Input() showOverflow?: boolean;
  @Input() overflowItems: DsTabOverflowItem[] = [];

  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() tabChange = new EventEmitter<DsTabItem>();
  @Output() overflowItemSelected = new EventEmitter<DsTabOverflowItem>();

  @ViewChild('tabsViewport') private tabsViewport?: ElementRef<HTMLElement>;

  isOverflowOpen = false;
  private hiddenTabIndices = new Set<number>();
  private resizeObserver?: ResizeObserver;
  private measureFrame = 0;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleOverflowMeasurement());
    }
    this.scheduleOverflowMeasurement();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.scrollTabIntoView(this.resolvedSelectedIndex));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scheduleOverflowMeasurement();
    if (changes['selectedIndex'] && this.tabsViewport && typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.scrollTabIntoView(this.resolvedSelectedIndex));
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.measureFrame);
  }

  get visibleOverflowItems(): DsTabOverflowItem[] {
    const candidates = this.overflowItems.length > 0
      ? this.overflowItems
      : this.tabs.map((tab) => ({ label: tab.label, value: tab.value, disabled: tab.disabled }));

    return candidates.filter((item) => {
      const tabIndex = this.tabs.findIndex((tab) => item.value !== undefined
        ? tab.value === item.value
        : tab.label === item.label);
      return tabIndex < 0 || this.hiddenTabIndices.has(tabIndex);
    });
  }

  get shouldShowOverflow(): boolean {
    if (this.showOverflow !== undefined) {
      return this.showOverflow;
    }
    if (this.overflowMode === 'always') {
      return true;
    }
    return this.overflowMode === 'auto' && this.visibleOverflowItems.length > 0;
  }

  onTabsScroll(): void {
    this.updateHiddenTabs();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleOverflowMeasurement();
  }

  get resolvedSelectedIndex(): number {
    const index = Number.isFinite(this.selectedIndex) ? Math.trunc(this.selectedIndex) : 0;
    return Math.min(Math.max(index, 0), Math.max(this.tabs.length - 1, 0));
  }

  selectTab(index: number): void {
    const tab = this.tabs[index];
    if (!tab || tab.disabled) {
      return;
    }

    this.selectedIndexChange.emit(index);
    this.tabChange.emit(tab);
    this.scrollTabIntoView(index);
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    let target: number | null = null;

    if (event.key === 'Home') {
      target = this.findEnabledIndex(0, 1);
    } else if (event.key === 'End') {
      target = this.findEnabledIndex(this.tabs.length - 1, -1);
    } else if (direction !== 0) {
      target = this.findEnabledIndex(index + direction, direction);
    }

    if (target === null) {
      return;
    }

    event.preventDefault();
    this.selectTab(target);
  }

  toggleOverflow(): void {
    this.updateHiddenTabs();
    if (this.visibleOverflowItems.length > 0) {
      this.isOverflowOpen = !this.isOverflowOpen;
    }
  }

  closeOverflow(event: KeyboardEvent): void {
    if (!this.isOverflowOpen) {
      return;
    }

    event.preventDefault();
    this.isOverflowOpen = false;
    (event.currentTarget as HTMLElement | null)?.querySelector<HTMLButtonElement>('button[aria-label="More tabs"]')?.focus();
  }

  @HostListener('document:click', ['$event'])
  closeOverflowOnOutsideClick(event: MouseEvent): void {
    const target = event.target;
    const overflow = this.elementRef.nativeElement.querySelector('.ds-tab-group__overflow-wrap');
    if (this.isOverflowOpen && target instanceof Node && !overflow?.contains(target)) {
      this.isOverflowOpen = false;
    }
  }

  selectOverflowItem(item: DsTabOverflowItem): void {
    if (!item.disabled) {
      const tabIndex = this.tabs.findIndex((tab) => item.value !== undefined
        ? tab.value === item.value
        : tab.label === item.label);
      if (tabIndex >= 0) {
        this.selectTab(tabIndex);
      }
      this.overflowItemSelected.emit(item);
      this.isOverflowOpen = false;
    }
  }

  private scrollTabIntoView(index: number): void {
    const tab = this.tabsViewport?.nativeElement.children.item(index) as HTMLElement | null;
    tab?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    this.scheduleOverflowMeasurement();
  }

  private scheduleOverflowMeasurement(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }

    cancelAnimationFrame(this.measureFrame);
    this.measureFrame = requestAnimationFrame(() => {
      const viewport = this.tabsViewport?.nativeElement;
      if (!viewport) {
        return;
      }

      this.resizeObserver?.observe(viewport);
      Array.from(viewport.children).forEach((tab) => this.resizeObserver?.observe(tab));
      this.updateHiddenTabs();
    });
  }

  private updateHiddenTabs(): void {
    const viewport = this.tabsViewport?.nativeElement;
    if (!viewport || viewport.clientWidth === 0) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const nextHidden = new Set<number>();
    Array.from(viewport.children).forEach((tab, index) => {
      const tabRect = tab.getBoundingClientRect();
      if (tabRect.width === 0 || tabRect.left < viewportRect.left - 1 || tabRect.right > viewportRect.right + 1) {
        nextHidden.add(index);
      }
    });

    const changed = nextHidden.size !== this.hiddenTabIndices.size ||
      Array.from(nextHidden).some((index) => !this.hiddenTabIndices.has(index));
    if (changed) {
      this.hiddenTabIndices = nextHidden;
      if (this.overflowMode === 'auto' && this.showOverflow === undefined && this.visibleOverflowItems.length === 0) {
        this.isOverflowOpen = false;
      }
      this.changeDetector.markForCheck();
    }
  }

  private findEnabledIndex(start: number, direction: 1 | -1): number | null {
    if (this.tabs.length === 0) {
      return null;
    }

    let index = start;
    while (index >= 0 && index < this.tabs.length) {
      if (!this.tabs[index].disabled) {
        return index;
      }
      index += direction;
    }

    return null;
  }
}
