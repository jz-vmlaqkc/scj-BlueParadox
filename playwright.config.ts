import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: "./utils/env/.env" });

let baseUrl: string = process.env.BASE_URL || "";
let environment = process.env.ENV?.toLowerCase() || "default";

if (!baseUrl) {
  switch (environment) {
   
    case "stage":
      baseUrl = process.env.STAGE_BASE_URL || "";
      break;
    case "prod":
      baseUrl = process.env.PROD_BASE_URL || "";
      break;
    default:
      baseUrl = process.env.STAGE_BASE_URL || "";
      environment = "default";
  }

  // If no URL found in environment variables, throw an error
  if (!baseUrl) {
    throw new Error(`No URL configured for environment '${environment}'. 
    Please check your .env file or provide a DEBUG_URL.`);
  }
}

// Set NODE_ENV to match our environment for screenshot directories
process.env.NODE_ENV = environment;

console.log(`Running tests against: ${environment} environment (${baseUrl})`);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: path.join(
    __dirname,
    "screenshots",
    `${process.env.NODE_ENV}`,
    "{arg}{ext}",
  ),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    baseURL: baseUrl,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    {
      name: "smoke-desktop",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*visual-smoke.*\.spec\.ts/,
    },
    {
      name: "smoke-mobile",
      use: { ...devices["iPhone 14"] },
      testMatch: /.*visual-smoke.*\.spec\.ts/,
    },
    {
      name: "components",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*visual-components.*\.spec\.ts/,
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL: process.env.API_BASE_URL ?? baseUrl,
        extraHTTPHeaders: {
          Accept: "application/json",
          // Add API key / auth token here if global
          // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
        },
      },
    },
    {
      name: "ui",
      testDir: "./tests/user-flows",
      use: { ...devices["Desktop Chrome"], baseURL: baseUrl },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
