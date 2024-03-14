import { test, expect } from "@playwright/test";

test.describe("Share Settings", () => {
  test("display share settings modal", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForSelector(".container", { strict: false });
    await page.getByRole("button", { name: "Share" }).click();

    await expect(
      page.getByRole("heading", { name: "Share Settings" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("heading", { name: "Share Settings" }),
    ).not.toBeVisible();
  });

  test("copy settings url to clipboard", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForSelector(".container", { strict: false });

    // select some settings
    await page.getByLabel("wav").click();
    await page.click("text=Advanced Settings");
    await page.getByLabel("32 bit").click();
    await page.getByLabel("96 kHz").click();

    await page.getByRole("button", { name: "Share" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.locator("text=Copied to clipboard")).toBeVisible();

    let clipboardText = await page.evaluate("navigator.clipboard.readText()");
    await page.getByRole("button", { name: "Copy" }).click();

    // expected settings
    const format = {
      id: "wav",
      label: "wav",
      value: "wav",
      ext: "wav",
      mimetype: "audio/wav",
    };

    const settings = {
      "wav-codec": { id: "wav-codec", value: "-vn", isDefault: true },
      "bit-depth": {
        id: "wav-bd-32",
        label: "32 bit",
        value: "-acodec pcm_s32le",
      },
      "sample-rate": { id: "wav-sr-96", label: "96 kHz", value: "-ar 96000" },
    };

    expect(clipboardText).toBe(mockSettingsUrl(format, settings));
  });

  test("open url with shared settings selects the settings", async ({
    page,
  }) => {
    const format = {
      id: "ogg",
      label: "ogg",
      value: "ogg",
      ext: "ogg",
      mimetype: "audio/ogg",
    };

    const settings = {
      "ogg-codec": {
        id: "ogg-codec",
        value: "-vn",
        isDefault: true,
      },
      bitrate: { id: "ogg-vbr-4", label: "VBR 128 kbit/s", value: "-q:a 4" },
      "sample-rate": { id: "ogg-sr-96", label: "96 kHz", value: "-ar 96000" },
    };

    const url = mockSettingsUrl(format, settings);
    await page.goto(url);

    await expect(page.getByLabel("ogg")).toBeChecked();
    await page.click("text=Advanced Settings");
    await expect(page.getByLabel("VBR 128 kbit/s")).toBeChecked();
    await expect(page.getByLabel("96 kHz")).toBeChecked();
  });

  test('open url with shared settings selects the settings and "Custom" format', async ({
    page,
  }) => {
    const format = {
      id: "ogg",
      label: "ogg",
      value: "ogg",
      ext: "ogg",
      mimetype: "audio/ogg",
    };

    const settings = {
      custom: {
        id: "custom",
        label: "Custom",
        value: "my super custom settings",
      },
    };

    const url = mockSettingsUrl(format, settings);
    await page.goto(url);

    await expect(page.getByLabel("ogg")).toBeChecked();
    await expect(page.getByText("Custom Command is in use.")).toBeVisible();

    // open advanced settings
    await page.getByRole("heading", { name: "Expert Stuff" }).click();
    await expect(page.getByLabel("Enable Custom Command")).toBeChecked();
    await expect(
      page.getByLabel("Custom Command", { exact: true }),
    ).toHaveValue("my super custom settings");
  });

  test('opens settgings url with "Custom" format and settings', async ({
    page,
  }) => {
    const format = {
      id: "custom",
      label: "Super Custom",
      ext: "custom",
      value: "my super custom format",
      settings: {
        presetSettings: {
          id: "presetSetting",
          label: "Custom",
          value: "my super custom settings",
        },
      },
      isCustomPreset: true,
    };

    const url = mockSettingsUrl(format, {});
    await page.goto(url);

    await expect(page.getByLabel("Super Custom")).toBeChecked();
    await expect(page.getByText("my super custom settings")).toBeVisible();

    await page.evaluate(() =>
      window.localStorage.removeItem("wo-audio-converter-customPresets"),
    );
  });
});

function mockSettingsUrl(format, settings) {
  const url = new URL("http://localhost:5173");
  url.searchParams.set("format", JSON.stringify(format));
  url.searchParams.set("settings", JSON.stringify(settings));
  return url.toString();
}
