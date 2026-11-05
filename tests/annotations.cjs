const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { completeSignature } = require("./signature-helpers.cjs");
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
  try {
    const ctx = await b.newContext({ viewport: { width: 825, height: 694 } }),
      p = await ctx.newPage();
    let errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:4200/?scenario=standard-peso");
    await p.getByRole("button", { name: "Next", exact: true }).click();
    assert.equal(await p.locator("#flow-title").innerText(), "Review & Submit");
    assert.equal(
      await p.locator(".flow-header>p").innerText(),
      "Before proceeding, please carefully review the information you entered before submitting your fund switch request.",
    );
    assert(
      await p.getByRole("button", { name: "Submit", exact: true }).isDisabled(),
    );
    for (const [width, height] of [
      [825, 694],
      [1440, 1000],
      [390, 844],
    ]) {
      await p.setViewportSize({ width, height });
      const gaps = await p.evaluate(() => {
        const summary = document
            .querySelector(".switch-summary")
            .getBoundingClientRect(),
          banner = document
            .querySelector(".review-waiver-banner")
            .getBoundingClientRect(),
          checkbox = document
            .querySelector(".review-confirmation")
            .getBoundingClientRect(),
          box = document
            .querySelector(".ds-checkbox__box")
            .getBoundingClientRect(),
          label = document
            .querySelector(".ds-checkbox__label")
            .getBoundingClientRect(),
          line = parseFloat(
            getComputedStyle(document.querySelector(".ds-checkbox__label"))
              .lineHeight,
          );
        return {
          gap: banner.top - summary.bottom,
          next: checkbox.top - banner.bottom,
          box: box.top + box.height / 2,
          firstLine: label.top + line / 2,
          scroll: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      console.log("review", width, gaps);
      assert(Math.abs(gaps.gap - 24) < 1);
      assert(Math.abs(gaps.next - 24) < 1);
      assert(Math.abs(gaps.box - gaps.firstLine) < 2);
      assert(gaps.scroll);
      await p.screenshot({
        path: `output/verification/annotations-review-${width}.png`,
        fullPage: true,
      });
    }
    await p.locator("#review-waiver-ack").check();
    await p.getByRole("button", { name: "Submit", exact: true }).click();
    assert.equal(
      await p
        .locator(".fund-signature-panel")
        .getByRole("button", { name: "Save as Draft", exact: true })
        .count(),
      0,
    );
    assert.equal(
      await p.locator("#signature-modal-title").innerText(),
      "Policy Owner’s Signature",
    );
    for (const [width, height] of [
      [825, 694],
      [398, 900],
      [1440, 1000],
      [390, 844],
    ]) {
      await p.setViewportSize({ width, height });
      await p
        .locator(".fund-signature-panel .ds-modal-dialog__content")
        .evaluate((e) => (e.scrollTop = 0));
      await p.screenshot({
        path: `output/verification/annotations-signature-${width}.png`,
      });
      const geometry = await p.evaluate(() => {
        const panel = document
            .querySelector(".fund-signature-panel")
            .getBoundingClientRect(),
          header = document
            .querySelector(".fund-signature-heading")
            .getBoundingClientRect(),
          pad = document
            .querySelector(".fund-signature-area")
            .getBoundingClientRect();
        return {
          width: panel.width,
          padWidth: pad.width,
          padHeight: pad.height,
          overlap: header.bottom > pad.top,
          center: Math.abs(panel.left + panel.width / 2 - innerWidth / 2),
          scroll: document.documentElement.scrollWidth <= innerWidth,
          assets: [...document.querySelectorAll(".signature-backdrop img")].map(
            (e) => ({
              src: e.getAttribute("src"),
              natural: e.naturalWidth,
              width: e.getBoundingClientRect().width,
              height: e.getBoundingClientRect().height,
            }),
          ),
        };
      });
      console.log("signature", width, geometry);
      assert(!geometry.overlap);
      assert(geometry.center < 1);
      assert(geometry.scroll);
      if (width >= 825) {
        assert.equal(geometry.width, 398);
        assert(Math.abs(geometry.padHeight - 300) < 2);
      }
      for (const a of geometry.assets) {
        assert(a.natural > 0);
        assert.equal(a.width, 16);
        assert.equal(a.height, 16);
      }
    }
    await completeSignature(p);
    await p
      .getByRole("heading", { name: "Request Received", exact: true })
      .waitFor();
    assert.equal(
      await p.locator(".submission-progress .ds-stepper__item").count(),
      3,
    );
    for (const [width, height] of [
      [1440, 1000],
      [825, 694],
      [390, 844],
    ]) {
      await p.setViewportSize({ width, height });
      await p.screenshot({
        path: `output/verification/annotations-success-${width}.png`,
        fullPage: true,
      });
      const geo = await p.evaluate(() => ({
        width: document.querySelector(".success-card").getBoundingClientRect()
          .width,
        scroll: document.documentElement.scrollWidth <= innerWidth,
        image: document
          .querySelector(".success-animation")
          .getBoundingClientRect()
          .toJSON(),
        source: document
          .querySelector(".success-animation")
          .getAttribute("src"),
        logo: document.querySelector(".brand img").getAttribute("src"),
      }));
      assert.equal(await p.locator('#request-summary-title').innerText(), 'Policy Details');
      assert.deepEqual(await p.locator('.request-details-grid dt').allTextContents(), ['First Name', 'Middle Name', 'Last Name', 'Email Address', 'Mobile Number']);
      const connectors = await p.locator('.submission-progress .ds-stepper__item').evaluateAll(items => items.slice(0,-1).map((item,i) => {
        const line = item.querySelector('.ds-stepper__connector--after').getBoundingClientRect();
        const next = items[i+1].querySelector('.ds-stepper__indicator').getBoundingClientRect();
        return Math.abs(line.bottom-next.top);
      }));
      assert(connectors.every(gap => gap < 1), JSON.stringify(connectors));
      console.log("success", width, geo);
      assert(geo.scroll);
      assert.equal(geo.image.width, 66);
      assert.equal(geo.image.height, 60);
      if (width === 1440) assert.equal(geo.width, 1000);
    }
    await p.goto("http://127.0.0.1:4200/?scenario=exact-minimum-peso");
    await p.locator('input[name="policy"]').check();
    assert.equal(
      await p
        .getByRole("button", { name: "Save as Draft", exact: true })
        .count(),
      0,
    );
    assert.equal(await p.locator(".ds-radio__indicator:visible").count(), 0);
    await p.screenshot({
      path: "output/verification/annotations-policy-390.png",
    });
    await p.getByRole("button", { name: "Next", exact: true }).click();
    assert(
      await p
        .getByRole("button", { name: "Save as Draft", exact: true })
        .isVisible(),
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: 11 annotated changes, responsive spacing/alignment, Figma signature assets, success layout and policy actions.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
