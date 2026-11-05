import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { DsDropdownMode, DsDropdownOption } from "./dropdown-menu.model";

let nextDropdownId = 0;

@Component({
  selector: "ds-dropdown-menu",
  standalone: false,
  templateUrl: "./dropdown-menu.component.html",
  styleUrls: ["./dropdown-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDropdownMenuComponent implements OnChanges {
  @Input() label = "Label";
  @Input() inputId = "";
  @Input() trailingIconAsset = "";
  @Input() fluid = false;
  @Input() adaptiveOverlay = false;
  @Input() placeholder = "Placeholder";
  @Input() mode: DsDropdownMode = "item";
  @Input() options: DsDropdownOption[] = [];
  @Input() selected: string[] = [];
  @Input() open = false;
  @Input() compact = false;
  @Input() disabled = false;
  @Input() placement: "bottom-start" | "bottom-end" = "bottom-start";
  @Input() width = 112;
  @Input() searchable = false;
  @Input() searchQuery = "";
  searchFocused = false;

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() searchQueryChange = new EventEmitter<string>();

  @ViewChild("triggerField", { read: ElementRef })
  private triggerField?: ElementRef<HTMLElement>;
  private menuPanel?: ElementRef<HTMLElement>;
  @ViewChild("menuPanel", { read: ElementRef }) set panel(
    value: ElementRef<HTMLElement> | undefined,
  ) {
    this.menuPanel = value;
    if (value && this.adaptiveOverlay) {
      value.nativeElement.setAttribute("popover", "manual");
      value.nativeElement.showPopover();
      this.positionOverlay();
    }
  }
  private readonly reposition = () => this.positionOverlay();

  ngOnInit(): void {
    window.addEventListener("scroll", this.reposition, true);
    window.addEventListener("resize", this.reposition);
  }
  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.reposition, true);
    window.removeEventListener("resize", this.reposition);
  }
  private positionOverlay(): void {
    if (!this.adaptiveOverlay || !this.menuPanel || !this.triggerField) return;
    const panel = this.menuPanel.nativeElement;
    const trigger = this.triggerField.nativeElement
      .querySelector(".ds-text-field__control")!
      .getBoundingClientRect();
    const content = this.elementRef.nativeElement
      .closest(".ds-modal-dialog__content")
      ?.getBoundingClientRect();
    const top = Math.max(8, content?.top ?? 8);
    const bottom = Math.min(
      window.innerHeight - 8,
      content?.bottom ?? window.innerHeight - 8,
    );
    const below = Math.max(0, bottom - trigger.bottom - 4);
    const above = Math.max(0, trigger.top - top - 4);
    const desired = Math.min(240, this.options.length * 44 + 16);
    const up = below < desired && above > below;
    const height = Math.min(desired, up ? above : below);
    Object.assign(panel.style, {
      position: "fixed",
      margin: "0",
      inset: "auto",
      boxSizing: "border-box",
      left: `${trigger.left}px`,
      width: `${trigger.width}px`,
      minWidth: "0",
      maxHeight: `${height}px`,
      top: `${up ? trigger.top - height - 4 : trigger.bottom + 4}px`,
    });
  }

  readonly menuId = `ds-dropdown-menu-${++nextDropdownId}`;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["open"]?.previousValue === true &&
      changes["open"]?.currentValue === false
    ) {
      this.clearSearchQuery();
    }
  }

  trackOption(_index: number, option: DsDropdownOption): string {
    return option.value;
  }

  get selectedOptions(): DsDropdownOption[] {
    return this.options.filter((option) =>
      this.selected.includes(option.value),
    );
  }

  get filteredOptions(): DsDropdownOption[] {
    const query = this.searchQuery.trim().toLocaleLowerCase();
    return !this.searchable || !query
      ? this.options
      : this.options.filter((option) =>
          option.label.toLocaleLowerCase().includes(query),
        );
  }

  get triggerPlaceholder(): string {
    return this.searchable && this.searchFocused ? "" : this.placeholder;
  }

  get triggerValue(): string {
    if (!this.searchable) return this.displayValue;
    return this.mode === "checkbox"
      ? this.searchQuery
      : this.searchQuery || this.displayValue;
  }

  onTriggerFocus(): void {
    if (!this.searchable) return;
    this.searchFocused = true;
    if (
      this.mode === "item" &&
      this.selectedOptions.length &&
      !this.searchQuery
    ) {
      this.triggerField?.nativeElement.querySelector("input")?.select();
    }
  }

  onTriggerBlur(): void {
    if (this.searchable) this.searchFocused = false;
  }

  get displayValue(): string {
    return this.selectedOptions.map((option) => option.label).join(", ");
  }

  isSelected(value: string): boolean {
    return this.selected.includes(value);
  }

  toggle(): void {
    if (this.disabled) return;
    if (this.open) {
      this.close();
    } else {
      this.open = true;
    }
  }

  onTriggerClick(event: MouseEvent): void {
    if (this.searchable && event.target instanceof HTMLInputElement) {
      if (!this.disabled) this.open = true;
      return;
    }
    if (!(event.target instanceof HTMLInputElement)) {
      // Handle the icon/control click directly. Prevent the wrapping label from
      // forwarding a second click to its input (which would undo the toggle).
      event.preventDefault();
      this.triggerField?.nativeElement.querySelector("input")?.focus();
    }
    this.toggle();
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.searchQueryChange.emit(query);
    this.open = true;
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === "Escape") {
      if (this.open) {
        event.preventDefault();
        this.close(true);
      }
      return;
    }
    // Preserve the portal's Home/End navigation when the trigger retains focus.
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      this.open = true;
      const focusEdge = () => {
        const options = this.focusableOptions();
        (event.key === "Home" ? options[0] : options.at(-1))?.focus();
      };
      if (this.menuPanel) focusEdge();
      else setTimeout(focusEdge);
      return;
    }
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      this.open = true;
      setTimeout(() => this.focusFirstOption());
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    const items = this.focusableOptions();
    if (!items.length) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (event.key === "ArrowDown") next = (current + 1) % items.length;
    if (event.key === "ArrowUp")
      next = (current - 1 + items.length) % items.length;
    items[next].focus();
  }

  selectOption(option: DsDropdownOption): void {
    if (option.disabled) return;
    this.selected = [option.value];
    this.selectionChange.emit(this.selected);
    this.close(true);
  }

  toggleCheckbox(value: string, checked: boolean): void {
    this.selected = checked
      ? [...this.selected, value]
      : this.selected.filter((selectedValue) => selectedValue !== value);
    this.selectionChange.emit(this.selected);
  }

  toggleCheckboxOption(option: DsDropdownOption, event: MouseEvent): void {
    if (option.disabled) return;

    const target = event.target as HTMLElement;
    if (target.closest(".ds-checkbox")) return;

    this.toggleCheckbox(option.value, !this.isSelected(option.value));
  }

  selectRadio(value: string): void {
    this.selected = [value];
    this.selectionChange.emit(this.selected);
    this.close(true);
  }

  selectRadioOption(option: DsDropdownOption, event: MouseEvent): void {
    if (option.disabled) return;

    const target = event.target as HTMLElement;
    const radio = target.closest("ds-radio");
    if (radio && radio !== target) return;

    this.selectRadio(option.value);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.open &&
      !this.elementRef.nativeElement.contains(event.target as Node)
    )
      this.close();
  }

  @HostListener("document:focusin", ["$event"])
  onDocumentFocus(event: FocusEvent): void {
    if (
      this.open &&
      !this.elementRef.nativeElement.contains(event.target as Node)
    )
      this.close();
  }

  private close(restoreFocus = false): void {
    this.open = false;
    this.clearSearchQuery();
    if (restoreFocus)
      setTimeout(() =>
        this.triggerField?.nativeElement.querySelector("input")?.focus(),
      );
  }

  private clearSearchQuery(): void {
    if (!this.searchQuery) return;
    this.searchQuery = "";
    this.searchQueryChange.emit("");
  }

  private focusFirstOption(): void {
    this.focusableOptions()[0]?.focus();
  }

  private focusableOptions(): HTMLElement[] {
    return Array.from(
      this.menuPanel?.nativeElement.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"]), input:not(:disabled)',
      ) ?? [],
    );
  }
}
