import { test, expect } from "@playwright/test";
import path from "path";

const __dirname = path.resolve() + "/e2e";
const __tempDir = path.resolve() + "/e2e/temp";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/#/preferences");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() =>
    window.localStorage.removeItem("wo-audio-converter-customPresets"),
  );
});

test.describe("Preferences", () => {
  test("import custom presets", async ({ page }) => {
    await addPresets(page);

    // open modal and set file
    await page.getByRole("button", { name: "Import presets" }).click();
    await page
      .getByLabel("Selecte Preset File")
      .setInputFiles(path.join(__dirname, "audio-converter-presets.json"));

    // check preview
    await expect(page.getByText("audio-converter-presets.json")).toBeVisible();
    await expect(page.getByText("mp3 new")).toBeVisible();
    await expect(page.getByText("ogg2 - already exists")).toBeVisible();

    // import
    await page
      .getByRole("button", { name: "Import Presets", exact: true })
      .click();
    await expect(page.getByText("Import complete")).toBeVisible();

    // close modal, prefrerences page
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("link", { name: "Back to Home" }).click();

    // check if presets are imported
    await expect(page.getByLabel("mp3 2")).toBeVisible();
    await expect(page.getByLabel("mp3 new")).toBeVisible();
    await expect(page.getByLabel("ogg2")).toBeVisible();
  });

  test("import replace existing presets", async ({ page }) => {
    await addPresets(page);

    // open modal and set file
    await page.getByRole("button", { name: "Import presets" }).click();
    await page
      .getByLabel("Selecte Preset File")
      .setInputFiles(path.join(__dirname, "audio-converter-presets.json"));

    // import
    await page.getByLabel("replace all").check();
    await page
      .getByRole("button", { name: "Import Presets", exact: true })
      .click();

    // close modal, prefrerences page
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("link", { name: "Back to Home" }).click();

    // check if presets are imported
    await expect(page.getByLabel("mp3 2")).not.toBeAttached();
    await expect(page.getByLabel("mp3 new")).toBeVisible();
    await expect(page.getByLabel("ogg2")).toBeVisible();
  });
});

async function addPresets(page) {
  await page.evaluate(() => {
    window.localStorage.setItem(
      "wo-audio-converter-customPresets",
      JSON.stringify([
        {
          id: "mp3 2",
          label: "mp3 2",
          value: "mp3 2",
          ext: "mp3",
          settings: {
            presetSetting: {
              id: "presetSetting",
              label: "Custom",
              value: "-vn -acodec libmp3lame -q:a 0",
            },
          },
          isCustomPreset: true,
        },
        {
          id: "ogg2",
          label: "ogg2",
          value: "ogg2",
          ext: "ogg",
          settings: {
            presetSetting: {
              id: "presetSetting",
              label: "Custom",
              value: "-vn -q:a 9",
            },
          },
          isCustomPreset: true,
        },
      ]),
    );
  });
}
