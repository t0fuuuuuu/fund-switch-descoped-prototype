async function drawSignature(page) {
  const pad = page.locator("#signature-pad");
  await pad.scrollIntoViewIfNeeded();
  const r = await pad.boundingBox();
  await page.mouse.move(r.x + r.width * 0.15, r.y + r.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(r.x + r.width * 0.35, r.y + r.height * 0.4, {
    steps: 10,
  });
  await page.mouse.move(r.x + r.width * 0.65, r.y + r.height * 0.2, {
    steps: 10,
  });
  await page.mouse.up();
}
async function selectLocation(page, id, name) {
  await page.locator("#signature-" + id).click();
  await page.getByRole("option", { name, exact: true }).click();
}
async function completeSignature(page) {
  await page.locator(".fund-signature-panel").waitFor();
  await drawSignature(page);
  await selectLocation(page, "city", "Taguig");
  await selectLocation(page, "district", "Bicutan");
  await page
    .locator(".fund-signature-panel")
    .getByRole("button", { name: "Next", exact: true })
    .click();
}
async function hasInk(page) {
  return page.locator("#signature-pad").evaluate((canvas) => {
    const pixels = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) return true;
    return false;
  });
}
module.exports = { drawSignature, selectLocation, completeSignature, hasInk };
