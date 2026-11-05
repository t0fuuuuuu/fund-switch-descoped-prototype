// GitHub Pages serves directories rather than rewriting SPA routes.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../dist/fund-switch/browser");
for (const route of [
  "login",
  "dashboard",
  "services",
  "policy-details",
  "investments",
  "requests",
  "policy",
  "funds",
  "documents",
  "review",
  "success",
]) {
  fs.mkdirSync(path.join(root, route), { recursive: true });
  fs.copyFileSync(
    path.join(root, "index.html"),
    path.join(root, route, "index.html"),
  );
}
