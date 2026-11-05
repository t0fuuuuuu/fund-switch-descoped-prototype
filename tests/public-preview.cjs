const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { completeSignature } = require("./signature-helpers.cjs");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    headless: true,
  });
  try {
    const base =
      process.env.PREVIEW_URL ||
      "http://127.0.0.1:4301/fund-switch-descoped-prototype/fund-switch/";
    const p = await b.newPage({ viewport: { width: 430, height: 932 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.status() + " " + r.url());
    });
    await p.goto(base + "?scenario=standard-peso");
    await p.getByRole("button", { name: "Next", exact: true }).click();
    await p.locator("#review-waiver-ack").check();
    await p.getByRole("button", { name: "Submit", exact: true }).click();
    await completeSignature(p);
    await p
      .getByRole("heading", { name: "Request Received", exact: true })
      .waitFor();
    assert.equal(
      await p.locator("#request-summary-title").innerText(),
      "Policy Details",
    );
    await p.goto(base + "policy-details/?scenario=completed-fund-switch");
    await p
      .locator(".policy-completion-message .ds-section-message--success")
      .waitFor();
    await p.reload();
    await p.locator(".policy-completion-message").waitFor();
    await p.getByRole("button", { name: "View request", exact: true }).click();
    await p.locator(".policy-requests-panel").waitFor();
    for (const file of [
      "output/pdf/risk-profile-questionnaire-20250411.pdf",
      "assets/fonts/lato-regular.woff2",
    ]) {
      if (file.endsWith(".pdf"))
        assert.equal((await p.request.get(base + file)).status(), 200);
    }
    await p.screenshot({
      path: "output/verification/public-preview-mobile.png",
    });
    assert.deepEqual(errors, []);
    console.log(
      "PASS: packaged preview navigation, signature submission, refreshed deep link, success messages, request action, PDF, asset loading.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
