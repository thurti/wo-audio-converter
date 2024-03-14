import { test, expect } from "@playwright/test";
import path from "path";

const __dirname = path.resolve() + "/e2e";
const __tempDir = path.resolve() + "/e2e/temp";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.waitForSelector(".container", { strict: false });

  await page
    .getByLabel("Add Audio or Video Files")
    .setInputFiles(path.join(__dirname, "test.mp3"));

  await page
    .getByLabel("Add Audio or Video Files")
    .setInputFiles(path.join(__dirname, "test-2.ogg"));
});

test.describe("Load/Remove File(s)", () => {
  test("convert button is enabled", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Convert All" }),
    ).toBeEnabled();
  });

  test("display file names in list", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText("test.mp3");
    await expect(page.getByRole("main")).toContainText("test-2.ogg");
  });

  test("removes single file", async ({ page }) => {
    await page.getByTitle("Remove file test.mp3").click();
    await expect(page.getByRole("main")).not.toContainText("test.mp3");
  });

  test("removes all files", async ({ page }) => {
    await page.getByTitle("Remove All").click();
    await expect(page.getByRole("main")).not.toContainText("test.mp3");
    await expect(page.getByRole("main")).not.toContainText("test-2.ogg");
    await expect(
      page.getByRole("button", { name: "Convert All" }),
    ).toBeDisabled();
  });
});

test.describe("Convert", () => {
  test("converts files with default settings", async ({ page }) => {
    await page.getByRole("button", { name: "Convert All" }).click();

    await expect(page.getByTitle("Save test_1.mp3 as")).toBeVisible({
      timeout: 120000,
    });
    await expect(page.getByTitle("Save test-2.mp3 as")).toBeVisible({
      timeout: 120000,
    });

    await expect(
      page.getByRole("button", { name: "Download All" }),
    ).toBeVisible();
  });

  test("converts files with selected format and settings", async ({ page }) => {
    await expect(page.getByLabel("mp3")).toBeChecked();

    // format
    await page.getByLabel("wav").click();
    await expect(page.getByLabel("wav")).toBeChecked();

    // advanced settings
    await page.click("text=Advanced Settings");

    await page.getByLabel("24 bit").click();
    await expect(page.getByLabel("24 bit")).toBeChecked();

    await page.getByLabel("8 kHz", { exact: true }).click();
    await expect(page.getByLabel("8 kHz", { exact: true })).toBeChecked();

    // convert
    await page.getByRole("button", { name: "Convert All" }).click();

    await expect(page.getByTitle("Save test.wav as")).toBeVisible({
      timeout: 120000,
    });
    await expect(page.getByTitle("Save test-2.wav as")).toBeVisible({
      timeout: 120000,
    });
  });

  test("converts files with custom command", async ({ page }) => {
    await page.getByLabel("ogg").click();

    await page.getByRole("heading", { name: "Expert Stuff" }).click();
    await page.getByLabel("Enable Custom Command").click();
    await page.getByLabel("Custom Command", { exact: true }).fill("-vn -q:a 1");

    await page.getByRole("button", { name: "Convert All" }).click();

    await expect(page.getByTitle("Save test.ogg as")).toBeVisible({
      timeout: 120000,
    });
    await expect(page.getByTitle("Save test-2_1.ogg as")).toBeVisible({
      timeout: 120000,
    });
  });

  test("shows ffmpeg error on invalid file", async ({ page }) => {
    await page.getByTitle("Remove All").click();
    await page
      .getByLabel("Add Audio or Video Files")
      .setInputFiles(path.join(__dirname, "test-error.mp3"));

    await page.getByRole("button", { name: "Convert All" }).click();
    await expect(page.getByText("There was an FFMPEG error")).toBeVisible({
      timeout: 120000,
    });
  });

  test("show error on invalid custom command", async ({ page }) => {
    await page.getByRole("heading", { name: "Expert Stuff" }).click();
    await page.getByLabel("Enable Custom Command").click();
    await page.getByLabel("Custom Command", { exact: true }).fill("wtf");

    await page.getByRole("button", { name: "Convert All" }).click();
    await expect(page.locator(".ffmpeg-error")).toHaveCount(2, {
      timeout: 120000,
    });
    await expect(
      page.getByText("There was an FFMPEG error").first(),
    ).toBeVisible();
  });
});
