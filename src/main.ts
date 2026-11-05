import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent, PortalComponent } from "./app/app.component";
bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter([{ path: "**", component: PortalComponent }]),
  ],
}).catch(console.error);
