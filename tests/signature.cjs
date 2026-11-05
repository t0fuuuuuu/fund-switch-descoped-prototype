const { chromium } = require("playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const {
  drawSignature,
  selectLocation,
  hasInk,
} = require("./signature-helpers.cjs");
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (fs.existsSync(
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  )
    ? "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    : undefined);
(async () => {
  const b = await chromium.launch({ executablePath, headless: true });
  try {
    const context = await b.newContext({
      viewport: { width: 1440, height: 1000 },
      hasTouch: true,
    });
    const p = await context.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:4200/?scenario=standard-peso");
    await p.getByRole("button", { name: "Next", exact: true }).click();
    const proceed = p.getByRole("button", {
      name: "Submit",
      exact: true,
    });
    assert(await proceed.isDisabled());
    await p.locator("#review-waiver-ack").check();
    await proceed.click();
    const panel = p.locator(".fund-signature-panel");
    const next = panel.getByRole("button", { name: "Next", exact: true });
    await panel.waitFor();
    assert(await next.isDisabled());
    assert(!(await hasInk(p)));
    await p.screenshot({
      path: "output/verification/signature-empty-desktop.png",
    });
    await drawSignature(p);
    assert(await hasInk(p));
    assert(await next.isDisabled());
    await selectLocation(p, "city", "Taguig");
    assert(await next.isDisabled());
    await selectLocation(p, "district", "Bicutan");
    assert(await next.isEnabled());
    await p.locator("#signature-district").click();
    await p.keyboard.press("Escape");
    assert(await panel.isVisible());
    assert.equal(
      await p.locator("#signature-district").getAttribute("aria-expanded"),
      "false",
    );
    await p.waitForTimeout(250);
    await p.screenshot({
      path: "output/verification/signature-filled-desktop.png",
    });
    await panel
      .getByRole("button", { name: "Redo Signature", exact: true })
      .click();
    assert(!(await hasInk(p)));
    assert(await next.isDisabled());
    await drawSignature(p);
    await panel.getByRole("button", { name: "Cancel", exact: true }).click();
    await p.waitForFunction(() =>
      document.activeElement?.closest("#flow-next"),
    );
    assert(await p.locator("#review-waiver-ack").isChecked());
    await proceed.click();
    await p.waitForFunction(() => {
      const c = document.querySelector("#signature-pad");
      return (
        c &&
        c
          .getContext("2d")
          .getImageData(0, 0, c.width, c.height)
          .data.some((v, i) => i % 4 === 3 && v > 0)
      );
    });
    assert(await next.isEnabled());
    assert.equal(
      await panel
        .getByRole("button", { name: "Save as Draft", exact: true })
        .count(),
      0,
    );
    await panel.getByRole("button", { name: "Cancel", exact: true }).click();
    await p.getByRole("button", { name: "Save as Draft", exact: true }).click();
    await p
      .locator(".draft-modal")
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
    assert.equal(await panel.count(), 0);
    await proceed.click();
    await panel.waitFor();
    assert(await hasInk(p));
    await panel.getByRole("button", { name: "Cancel", exact: true }).click();
    await p.getByRole("button", { name: "Save as Draft", exact: true }).click();
    await p.getByRole("button", { name: "Save Draft", exact: true }).click();
    await p.waitForURL("**/services");
    const saved = await p.evaluate(() =>
      JSON.parse(localStorage.getItem("fund-switch-prototype-draft-v1")),
    );
    assert.equal(saved.draftResumeModal, "");
    assert.equal(saved.draftResumeScreen, "review");
    assert(!JSON.stringify(saved).includes("data:image"));
    assert(!("signature" in saved));
    await p.locator(".request-policy-row").click();
    await p.locator(".request-card-toggle").click();
    await proceed.click();
    await panel.waitFor();
    assert(await hasInk(p));
    await panel.getByRole("button", { name: "Cancel", exact: true }).click();
    await p.reload();
    // A reload on /review restores that route; a Services entry resumes via My Requests.
    if (await p.locator(".request-policy-row").count()) {
      await p.locator(".request-policy-row").click();
      await p.locator(".request-card-toggle").click();
    }
    await p.locator("#review-waiver-ack").waitFor();
    assert.equal(await panel.count(), 0);
    assert(!(await p.locator("#review-waiver-ack").isChecked()));
    await p.locator("#review-waiver-ack").check();
    await proceed.click();
    assert(!(await hasInk(p)));
    assert(await next.isDisabled());
    await p.setViewportSize({ width: 390, height: 844 });
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({
      path: "output/verification/signature-empty-mobile.png",
    });
    // Real touch pointer events verify the scaled canvas at phone width.
    const pad = p.locator("#signature-pad");
    await pad.scrollIntoViewIfNeeded();
    const r = await pad.boundingBox();
    const cdp = await context.newCDPSession(p);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: r.x + r.width * 0.2, y: r.y + r.height * 0.65 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: r.x + r.width * 0.65, y: r.y + r.height * 0.65 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert(await hasInk(p));
    await selectLocation(p, "city", "Taguig");
    await selectLocation(p, "district", "Bicutan");
    assert(await next.isEnabled());
    await p.waitForTimeout(250);
    await p.screenshot({
      path: "output/verification/signature-filled-mobile.png",
    });
    // Modal focus remains contained and Escape returns to the review CTA.
    await next.focus();
    await p.keyboard.press("Tab");
    assert(
      await panel
        .locator("canvas")
        .evaluate((e) => document.activeElement === e),
    );
    await p.keyboard.press("Escape");
    await p.waitForFunction(() =>
      document.activeElement?.closest("#flow-next"),
    );
    await proceed.click();
    await next.click();
    await panel
      .getByRole("button", { name: "Submitting your request", exact: true })
      .waitFor();
    assert(
      await panel
        .getByRole("button", { name: "Cancel", exact: true })
        .isDisabled(),
    );
    assert.equal(
      await panel
        .getByRole("button", { name: "Submitting your request", exact: true })
        .getAttribute("aria-busy"),
      "true",
    );
    await p.keyboard.press("Tab");
    assert(await panel.evaluate((e) => e.contains(document.activeElement)));
    await p.keyboard.press("Escape");
    assert(await panel.isVisible());
    await p
      .getByRole("heading", {
        name: "Request Received",
        exact: true,
      })
      .waitFor();
    assert.equal(
      await p.evaluate(() =>
        localStorage.getItem("fund-switch-prototype-draft-v1"),
      ),
      null,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: signature/location gates, drawing/redo, cancel/focus, draft prompt return, same-session resume, safe reload/redraw, touch canvas, mobile layout, focus trap and processing/submission.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
