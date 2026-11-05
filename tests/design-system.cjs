const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const b = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
      (fs.existsSync(
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      )
        ? "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
        : undefined),
    headless: true,
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://127.0.0.1:4200/");
  assert.equal(await p.locator("ds-text-field").count(), 2);
  await p.locator("#login-password").fill("sample");
  await p.getByRole("button", { name: "Show password", exact: true }).click();
  assert.equal(await p.locator("#login-password").getAttribute("type"), "text");
  await p.getByRole("button", { name: "Hide password", exact: true }).click();
  assert.equal(
    await p.locator("#login-password").getAttribute("type"),
    "password",
  );
  await p.screenshot({
    path: "output/verification/ewa-login-desktop.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({
    path: "output/verification/ewa-login-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4200/?scenario=traditional-policy");
  assert.equal(await p.locator("ds-radio").count(), 1);
  assert.equal(await p.locator("ds-tag").count(), 1);
  assert(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await p.screenshot({
    path: "output/verification/ewa-policy-mobile.png",
    fullPage: true,
  });
  await p.locator('input[name="policy"]').check();
  await p.getByRole("button", { name: "Next", exact: true }).click();
  assert.equal(await p.locator('ds-modal-dialog [role="dialog"]').count(), 1);
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "Menu", exact: false }).click();
  await p
    .locator(".mobile-nav-panel")
    .getByRole("button", { name: "Investments", exact: true })
    .click();
  assert.equal(await p.locator("ds-tab-group").count(), 1);
  await p.locator("ds-tab").first().getByRole("tab").click();
  await p.keyboard.press("ArrowRight");
  assert.equal(
    await p
      .locator("ds-tab")
      .nth(1)
      .getByRole("tab")
      .getAttribute("aria-selected"),
    "true",
  );
  assert(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await p.screenshot({
    path: "output/verification/ewa-investments-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4200/?scenario=higher-risk-peso");
  await p.screenshot({
    path: "output/verification/ewa-funds-mobile-final.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.screenshot({
    path: "output/verification/ewa-funds-desktop-final.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  await b.close();
  console.log(
    "PASS: native Storybook fields, reactive password visibility, policy radio/tag, eligibility modal, tab keyboard selection, and no mobile horizontal overflow.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
