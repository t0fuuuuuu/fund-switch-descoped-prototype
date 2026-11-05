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
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const ref = await ctx.newPage();
  let errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [label, p, base] of [
    ["angular", page, "http://127.0.0.1:4200"],
    ["reference", ref, "http://127.0.0.1:8000"],
  ]) {
    await p.goto(base + "/?scenario=standard-peso");
    await p.getByRole("button", { name: "Next", exact: true }).click();
    await p
      .getByRole("button", { name: "terms and conditions", exact: true })
      .click();
    await p.locator(".terms-modal").waitFor();
    await p.screenshot({
      path: `output/verification/${label}-terms-desktop.png`,
    });
    await p.setViewportSize({ width: 390, height: 844 });
    await p.screenshot({
      path: `output/verification/${label}-terms-mobile.png`,
    });
    await p.keyboard.press("Escape");
    await p.setViewportSize({ width: 1440, height: 1000 });
  }
  await page
    .getByRole("button", { name: "terms and conditions", exact: true })
    .click();
  await ref
    .getByRole("button", { name: "terms and conditions", exact: true })
    .click();
  assert.equal(
    await page.locator(".terms-sections").innerText(),
    await ref.locator(".terms-sections").innerText(),
  );
  await page.keyboard.press("Escape");
  assert(
    await page
      .getByRole("button", { name: "terms and conditions", exact: true })
      .evaluate((e) => e === document.activeElement),
  );
  await page
    .getByRole("button", { name: "Investments", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Show Fund Breakdown", exact: false })
    .last()
    .click();
  await page.getByRole("button", { name: "Switch Fund", exact: true }).click();
  assert(
    await page
      .locator(".flow-portfolio-summary")
      .innerText()
      .then((s) => s.includes("810000086143")),
  );
  await page.locator("#target-fund").click();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1100);
  assert.equal(
    await page.locator("#target-fund").getAttribute("aria-expanded"),
    "false",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await page.locator(".mobile-nav-panel").waitFor();
  assert(
    await page
      .locator(".mobile-nav-panel")
      .evaluate((e) => e === document.activeElement),
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => document.activeElement?.id === "mobile-menu",
  );
  await page.goto("http://127.0.0.1:4200/?scenario=completed-fund-switch");
  assert(
    await page
      .locator(
        ".portal-content .completed-request-message .ds-section-message--success",
      )
      .isVisible(),
  );
  await page
    .getByRole("button", { name: "View Policy Details", exact: true })
    .click();
  assert(
    await page
      .locator(
        ".policy-details-content .policy-completion-message .ds-section-message--success",
      )
      .isVisible(),
  );
  await page.getByRole("button", { name: "View request", exact: true }).click();
  await page.locator(".policy-requests-panel").waitFor();
  await page.goto("http://127.0.0.1:4200/?scenario=product-specific-funds");
  await page.locator('input[name="policy"]').check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator("#target-fund").click();
  assert(
    await page
      .getByRole("option", {
        name: "Peso Global Strategic Payout Fund",
        exact: true,
      })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Open prototype scenario guide", exact: true })
    .click();
  assert.equal(await page.locator(".scenario-link").count(), 14);
  await page.locator("#scenario-search").fill("traditional");
  assert.equal(await page.locator(".scenario-link").count(), 1);
  await page.keyboard.press("Control+Shift+H");
  assert(await page.locator("#scenario-search").isVisible());
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Open prototype scenario guide", exact: true })
    .click();
  await page.locator("#scenario-search").fill("");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+Shift+H");
  await page.getByRole("heading", { name: "Welcome to EWAOnline" }).waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: exact legal wording, terms focus return, Investments switch entry, select keyboard handling, mobile focus return, completion notices, product fund availability, all 14 scenarios, restart typing guard.",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
