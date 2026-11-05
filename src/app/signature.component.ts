import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { EWA_COMPONENTS } from "./design-system";
import { PrototypeState } from "./prototype-state.service";

/** Draw-to-sign interaction recovered from the original Fund Switch prototype.
 * The bitmap is transient; browser drafts never contain signature data. */
@Component({
  selector: "fund-signature",
  standalone: true,
  imports: [...EWA_COMPONENTS],
  templateUrl: "./signature.component.html",
  styleUrl: "./signature.component.css",
  encapsulation: ViewEncapsulation.None,
  host: { style: "display:contents" },
})
export class SignatureComponent implements AfterViewInit {
  m = inject(PrototypeState);
  @Input() canSubmit = false;
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @ViewChild("pad", { static: true }) pad!: ElementRef<HTMLCanvasElement>;
  readonly countries = [{ value: "Philippines", label: "Philippines" }];
  readonly cities = ["Taguig", "Makati City", "Manila"].map((value) => ({
    value,
    label: value,
  }));
  readonly districts = ["Bicutan", "Poblacion", "Bel-Air"].map((value) => ({
    value,
    label: value,
  }));
  drawing = false;
  private pointerId: number | null = null;
  get signature() {
    return this.m.signature;
  }
  ngAfterViewInit() {
    this.restoreImage();
  }
  private context() {
    const context = this.pad.nativeElement.getContext("2d");
    if (context) {
      context.lineWidth = 4;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#536173";
    }
    return context;
  }
  private restoreImage() {
    const saved = this.signature.image;
    if (!saved) return;
    const image = new Image();
    image.onload = () => {
      if (this.signature.image === saved && this.pad.nativeElement.isConnected)
        this.context()?.drawImage(image, 0, 0);
    };
    image.src = saved;
  }
  private point(event: PointerEvent) {
    const pad = this.pad.nativeElement;
    const rect = pad.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * pad.width) / rect.width,
      y: ((event.clientY - rect.top) * pad.height) / rect.height,
    };
  }
  begin(event: PointerEvent) {
    if (
      this.m.state.submitting ||
      this.drawing ||
      !event.isPrimary ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    const context = this.context();
    if (!context) return;
    this.pointerId = event.pointerId;
    this.drawing = true;
    this.pad.nativeElement.setPointerCapture(event.pointerId);
    const point = this.point(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + 0.5, point.y + 0.5);
    context.stroke();
  }
  move(event: PointerEvent) {
    if (!this.drawing || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    const p = this.point(event);
    this.context()?.lineTo(p.x, p.y);
    this.context()?.stroke();
  }
  finish(event: PointerEvent) {
    if (!this.drawing || event.pointerId !== this.pointerId) return;
    this.drawing = false;
    this.pointerId = null;
    this.signature.image = this.pad.nativeElement.toDataURL("image/png");
    if (this.pad.nativeElement.hasPointerCapture(event.pointerId))
      this.pad.nativeElement.releasePointerCapture(event.pointerId);
  }
  redo() {
    if (this.m.state.submitting) return;
    this.drawing = false;
    this.pointerId = null;
    this.context()?.clearRect(
      0,
      0,
      this.pad.nativeElement.width,
      this.pad.nativeElement.height,
    );
    this.signature.image = "";
  }
  location(field: "country" | "city" | "district", values: string[]) {
    if (!this.m.state.submitting) this.signature[field] = values[0] || "";
  }
  confirm() {
    if (this.canSubmit && !this.drawing && !this.m.state.submitting)
      this.confirmed.emit();
  }
}
