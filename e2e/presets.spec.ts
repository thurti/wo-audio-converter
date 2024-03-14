import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.waitForSelector(".container", { strict: false });
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() =>
    window.localStorage.removeItem("wo-audio-converter-customPresets"),
  );
});

test.describe("Custom Presets", () => {
  test("adds custom preset ", async ({ page }) => {
    await page.getByRole("button", { name: "+ Add" }).click();
    await expect(page.getByLabel("Preset Name")).toHaveValue("mp3");

    await page.getByLabel("Preset Name").fill("Custom Preset");
    await page.getByLabel("Output File Extension").fill("mp4");
    await page.getByLabel("FFmpeg Parameters").fill("my custom command");

    await page.getByRole("button", { name: "Save Preset" }).click();

    await expect(page.getByLabel("Custom Preset")).toBeChecked();
    await expect(page.getByText("my custom command").first()).toBeVisible();
  });

  test("edit custom preset", async ({ page }) => {
    await createCustomSettings(page);

    await page.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Preset Name").fill("Custom Preset 2");
    await page.getByLabel("Output File Extension").fill("mp4");
    await page.getByLabel("FFmpeg Parameters").fill("my custom command");

    await page.getByRole("button", { name: "Save Preset" }).click();

    await expect(page.getByLabel("Custom Preset 2")).toBeChecked();
    await expect(page.getByText("my custom command").first()).toBeVisible();
  });

  test("deletes custom preset", async ({ page }) => {
    await createCustomSettings(page);

    // accept confirm dialog
    page.on("dialog", (dialog) => dialog.accept());

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByLabel("Custom Preset")).not.toBeAttached();
  });

  test("doesnt delete if confirm dialog is cancelled", async ({ page }) => {
    await createCustomSettings(page);

    // cancel confirm dialog
    page.on("dialog", (dialog) => dialog.dismiss());

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByLabel("Custom Preset")).toBeChecked();
  });

  test("show warning if name exists", async ({ page }) => {
    await createCustomSettings(page);

    await page.getByRole("button", { name: "+ Add" }).click();
    await page.getByLabel("Preset Name").fill("Custom Preset");

    await expect(page.getByText("name already exists")).toBeVisible();
  });
});

async function createCustomSettings(page) {
  await page.getByRole("button", { name: "+ Add" }).click();

  await page.getByLabel("Preset Name").fill("Custom Preset");
  await page.getByLabel("Output File Extension").fill("mp4");
  await page.getByLabel("FFmpeg Parameters").fill("my custom command");

  await page.getByRole("button", { name: "Save Preset" }).click();
  await expect(page.getByLabel("Custom Preset")).toBeChecked();
}
