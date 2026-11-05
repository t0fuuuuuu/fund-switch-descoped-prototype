const { completeSignature } = require("./signature-helpers.cjs");
const { chromium } = require("playwright");
const fs = require("node:fs");
fs.mkdirSync("output/verification", { recursive: true });
const assert = require("assert/strict");
let debugPage;
(async () => {
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
      (fs.existsSync(
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      )
        ? "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
        : undefined),
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  debugPage = page;
  let errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4200/");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert(await page.getByRole("alert").isVisible());
  await page.locator("#login-username").fill("sample");
  await page.locator("#login-password").fill("sample");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "See What’s New" }).click();
  await page
    .getByRole("button", { name: "Fund Switch: Click to start request" })
    .click();
  await page.locator('input[value="810000085627"]').check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator("#source-fund").click();
  await page
    .getByRole("option", { name: "Peso Balanced Fund", exact: true })
    .click();
  await page.locator("#target-fund").click();
  await page
    .getByRole("option", {
      name: "Peso High Dividend Equity Fund",
      exact: true,
    })
    .click();
  assert(
    await page.getByRole("button", { name: "Next", exact: true }).isDisabled(),
  );
  assert.equal(await page.locator(".fund-section-skeleton").count(), 2);
  await page.waitForTimeout(1150);
  assert(
    await page.getByRole("button", { name: "Next", exact: true }).isEnabled(),
  );
  await page.screenshot({
    path: "output/verification/angular-funds-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "output/verification/angular-funds-mobile.png",
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  console.log("PASS: login, onboarding, selection and skeleton");
  for (const name of [
    "Risk Profile Questionnaire (RPQ)",
    "Investment Policy Statement (IPS)",
  ]) {
    const dl = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download " + name, exact: true })
      .click();
    assert((await dl).suggestedFilename().endsWith(".pdf"));
    await page.locator(".draft-modal").waitFor();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Save Draft", exact: true }).click();
    await page
      .getByRole("heading", { name: "Download forms", exact: true })
      .waitFor();
    assert(await page.getByText("Draft Saved", { exact: true }).isVisible());
  }
  console.log("PASS: both downloads and draft retention");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert(
    await page.getByRole("button", { name: "Next", exact: true }).isDisabled(),
  );
  await page.locator("#upload-rpq").setInputFiles({
    name: "wrong.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("test"),
  });
  assert(
    await page
      .getByText("File type not supported.", { exact: false })
      .isVisible(),
  );
  await page
    .getByRole("button", {
      name: "Retry Risk Profile Questionnaire (RPQ)",
      exact: true,
    })
    .click();
  await page.locator("#upload-rpq").setInputFiles({
    name: "big.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });
  assert(
    await page
      .getByText("File exceeds the 5 MB limit.", { exact: false })
      .isVisible(),
  );
  await page
    .getByRole("button", {
      name: "Retry Risk Profile Questionnaire (RPQ)",
      exact: true,
    })
    .click();
  for (const kind of ["rpq", "ips"]) {
    await page.locator("#upload-" + kind).setInputFiles({
      name: kind + ".pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 sample"),
    });
    await page
      .getByRole("button", {
        name:
          "Upload " +
          (kind === "rpq"
            ? "Risk Profile Questionnaire (RPQ)"
            : "Investment Policy Statement (IPS)"),
        exact: true,
      })
      .click();
    await page.getByText("File Uploaded", { exact: true }).first().waitFor();
    if (kind === "ips") await page.waitForTimeout(1100);
  }
  assert(
    await page.getByRole("button", { name: "Next", exact: true }).isEnabled(),
  );
  await page.screenshot({
    path: "output/verification/angular-uploads-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert.equal(await page.locator('input[type="checkbox"]').count(), 1);
  assert(
    await page
      .getByRole("button", { name: "Submit", exact: true })
      .isDisabled(),
  );
  await page
    .getByRole("button", { name: "terms and conditions", exact: true })
    .click();
  assert.equal(await page.locator(".terms-sections>li").count(), 5);
  await page.keyboard.press("Escape");
  assert(!(await page.locator("#review-waiver-ack").isChecked()));
  assert.equal(await page.locator("#review-waiver-ack").count(), 1);
  await page.locator("#review-waiver-ack").check();
  assert.equal(await page.locator(".review-waiver-banner").count(), 0);
  await page.locator("#review-waiver-ack").uncheck();
  assert.equal(await page.locator(".review-waiver-banner").count(), 1);
  await page.locator("#review-waiver-ack").check();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await completeSignature(page);
  await page.getByRole("heading", { name: "Request Received" }).waitFor();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("fund-switch-prototype-draft-v1"),
    ),
    null,
  );
  console.log("PASS: uploads, consent, terms and submission");
  for (const [id, min] of [
    ["exact-minimum-peso", true],
    ["below-minimum-peso", false],
    ["below-minimum-dollar", false],
    ["income-paying-multi-source", true],
    ["income-paying-insufficient", false],
  ]) {
    await page.goto("http://127.0.0.1:4200/?scenario=" + id);
    await page.locator('input[name="policy"]').first().check();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    if (id.includes("minimum"))
      assert.equal(await page.locator("#target-fund").isEnabled(), min);
    else
      assert.equal(
        await page
          .getByRole("button", { name: "Next", exact: true })
          .isEnabled(),
        min,
      );
  }
  await page.goto("http://127.0.0.1:4200/?scenario=document-upload-error");
  await page
    .getByRole("button", {
      name: "Retry Risk Profile Questionnaire (RPQ)",
      exact: true,
    })
    .click();
  await page.getByText("File Uploaded", { exact: true }).waitFor();
  await page.goto("http://127.0.0.1:4200/?scenario=traditional-policy");
  await page.locator('input[name="policy"]').first().check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert(
    await page
      .getByRole("heading", { name: "Fund Switch Unavailable" })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  await page.goto("http://127.0.0.1:4200/?scenario=pending-request");
  await page
    .getByRole("button", { name: /Fund switch request pending/i })
    .click();
  assert(
    await page
      .getByRole("heading", { name: "Fund Switch Request Already Submitted" })
      .isVisible(),
  );
  await page.goto("http://127.0.0.1:4200/?scenario=standard-peso");
  await page
    .getByRole("button", { name: "Save as Draft", exact: true })
    .click();
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await page.waitForURL("**/services");
  await page.reload();
  assert(
    await page
      .getByRole("heading", { name: "Manage your policy online" })
      .isVisible(),
  );
  await page.locator(".request-policy-row").click();
  await page.locator(".request-card-toggle").click();
  assert(
    await page
      .getByRole("heading", { name: "Switch your fund", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Control+Shift+G");
  assert(await page.locator("#scenario-guide-trigger").isHidden());
  await page.keyboard.press("Control+Shift+G");
  assert(await page.locator("#scenario-guide-trigger").isVisible());
  await page.keyboard.press("Control+Shift+H");
  await page.getByRole("heading", { name: "Welcome to EWAOnline" }).waitFor();
  assert.equal(new URL(page.url()).search, "");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: login/onboarding, policy/funds, skeleton timing, both downloads/draft retention, all upload states, consent/terms, submission, minimums/allocation, eligibility, retry, draft reload, guide/restart. No page errors.",
  );
  await browser.close();
})().catch(async (e) => {
  if (debugPage) {
    console.log("FAILURL", await debugPage.url());
    console.log((await debugPage.locator("body").innerText()).slice(-2000));
    await debugPage.screenshot({ path: "output/verification/failure.png" });
  }
  console.error(e);
  process.exit(1);
});
