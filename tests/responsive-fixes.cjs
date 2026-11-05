const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    headless: true,
  });
  try {
    for (const [width, height] of [
      [430, 932],
      [825, 694],
      [1440, 1000],
      [390, 844],
    ]) {
      const c = await b.newContext({ viewport: { width, height } }),
        p = await c.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto("http://127.0.0.1:4200/?scenario=standard-peso");
      await p.getByRole("button", { name: "Next", exact: true }).click();
      await p.locator("#review-waiver-ack").check();
      await p.getByRole("button", { name: "Submit", exact: true }).click();
      for (const [id, name] of [
        ["city", "Taguig"],
        ["district", "Bicutan"],
      ]) {
        await p.locator("#signature-" + id).click();
        const panel = p.locator(
          ".fund-signature-locations .ds-dropdown-menu__panel",
        );
        const geo = await panel.evaluate((el) => {
          const r = el.getBoundingClientRect(),
            content = el
              .closest(".ds-modal-dialog__content")
              .getBoundingClientRect();
          return {
            top: r.top,
            bottom: r.bottom,
            bound: content.bottom,
            hit: el.contains(
              document.elementFromPoint(r.x + 30, r.bottom - 10),
            ),
            scroll: el.closest(".ds-modal-dialog__content").scrollTop,
          };
        });
        assert(
          geo.top >= 0 && geo.bottom <= geo.bound + 1 && geo.hit,
          JSON.stringify(geo),
        );
        await p.screenshot({
          path: `output/verification/dropdown-${id}-${width}.png`,
        });
        await p.getByRole("option", { name, exact: true }).click();
      }
      await p.goto(
        "http://127.0.0.1:4200/?scenario=income-paying-multi-source",
      );
      await p.locator('input[name=policy][value="810000090308"]').check();
      await p.getByRole("button", { name: "Next", exact: true }).click();
      await p.locator(".full-allocation-notice").waitFor();
      assert.equal(
        await p.locator(".switch-summary .full-allocation-notice").count(),
        0,
      );
      await p.goto("http://127.0.0.1:4200/?scenario=dollar-same-risk");
      await p.locator('input[name=policy][value="810000090305"]').check();
      await p.getByRole("button", { name: "Next", exact: true }).click();
      await p.locator(".income-source-notice").waitFor();
      const gap = await p
        .locator(".income-source-notice")
        .evaluate(
          (el) =>
            el.getBoundingClientRect().top -
            el.previousElementSibling.getBoundingClientRect().bottom,
        );
      assert(Math.abs(gap - 24) < 1);
      await p.goto("http://127.0.0.1:4200/?scenario=completed-fund-switch");
      await p
        .locator(".completed-request-message .ds-section-message--success")
        .waitFor();
      assert(
        await p.locator(".add-policy-button .ds-button--secondary").count(),
      );
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p.screenshot({
        path: `output/verification/dashboard-fixes-${width}.png`,
        fullPage: true,
      });
      assert.deepEqual(errors, []);
      await c.close();
      console.log("PASS", width);
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
