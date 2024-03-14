import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.waitForSelector(".container", { strict: false });
});

test.describe("Basic App", () => {
  test("displays title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Audio\nFile Converter" }).first(),
    ).toBeVisible();
  });

  test("displays file input", async ({ page }) => {
    await expect(page.getByLabel("Add Audio or Video Files")).toBeAttached();
    await expect(page.getByText("Please add some files.")).toBeVisible();
  });

  test("displays format settings from config", async ({ page }) => {
    await expect(page.getByLabel("wav")).toBeVisible();
    await expect(page.getByLabel("mp3")).toBeVisible();
    await expect(page.getByLabel("ogg")).toBeVisible();
    await expect(page.getByLabel("aac (m4a)")).toBeVisible();
    await expect(page.getByLabel("flac")).toBeVisible();
    await expect(page.getByLabel("alac (m4a)")).toBeVisible();
  });

  test("displays advanced settings from config", async ({ page }) => {
    await page.click("text=Advanced Settings");

    // bitrate
    await expect(page.getByRole("heading", { name: "Bitrate" })).toBeVisible();
    await expect(page.getByLabel("VBR 245 kbit/s")).toBeVisible();
    await expect(page.getByLabel("VBR 225 kbit/s")).toBeVisible();
    await expect(page.getByLabel("VBR 190 kbit/s")).toBeVisible();
    // ...

    // sample rate
    await expect(
      page.getByRole("heading", { name: "Sample Rate" }),
    ).toBeVisible();
    await expect(page.getByLabel("as source")).toBeVisible();
    await expect(page.getByLabel("44.1 kHz")).toBeVisible();
    await expect(page.getByLabel("48 kHz")).toBeVisible();
    // ...
  });

  test("default settings are selected", async ({ page }) => {
    await expect(page.getByLabel("mp3")).toBeChecked();
    await page.click("text=Advanced Settings");
    await expect(page.getByLabel("VBR 245 kbit/s")).toBeChecked();
    await expect(page.getByLabel("as source")).toBeChecked();
  });

  test("display convert button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Convert All" }),
    ).toBeDisabled();
  });
});

test.describe("Pages", () => {
  test("About page", async ({ page }) => {
    await page.getByRole("link", { name: "About" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/info");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
    await page.getByRole("link", { name: "Back to Home" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/");
  });

  test("Preferences page", async ({ page }) => {
    await page.getByRole("link", { name: "Preferences" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/preferences");
    await expect(
      page.getByRole("heading", { name: "Preferences" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to Home" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/");
  });

  test("Privacy page", async ({ page }) => {
    await page.getByRole("link", { name: "Privacy" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/privacy");
    await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
    await page.getByRole("link", { name: "Back to Home" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/");
  });

  test("Imprint page", async ({ page }) => {
    await page.getByRole("link", { name: "Imprint" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/imprint");
    await expect(page.getByRole("heading", { name: "Imprint" })).toBeVisible();
    await page.getByRole("link", { name: "Back to Home" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/");
  });

  test("FAQ page", async ({ page }) => {
    await page.getByRole("link", { name: "FAQ" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/faq");
    await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible();
    await page.getByRole("link", { name: "Back to Home" }).click();
    await expect(page.url()).toBe("http://localhost:5173/#/");
  });
});
