import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  outputDir: join(tmpdir(), "redbook-text2img-playwright-results"),
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3200",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm build && pnpm start -p 3200",
    reuseExistingServer: true,
    timeout: 120_000,
    url: "http://127.0.0.1:3200",
  },
});
