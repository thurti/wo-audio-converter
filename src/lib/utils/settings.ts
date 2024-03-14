import type { ConfigFormatOption } from "@/config";
import type { SelectedSettings } from "@/store";
import { getOutputFilename } from "./file";

export function createFFmegCommandArgs(
  file: File,
  format: ConfigFormatOption,
  settings: SelectedSettings,
): string[] {
  if (!file || !format || !settings) return [];

  return [
    "-i",
    file.name,
    ...getSettingsString(settings).split(" "),
    getOutputFilename(file.name, format),
  ];
}

export function getSettingsString(settings: SelectedSettings): string {
  if (!settings) return "";

  return Object.values(settings)
    .reduce((acc, setting) => {
      return `${acc} ${setting.value}`.trim();
    }, "")
    .trim();
}

export function createSettingsFromString(
  value: string,
  key = "custom",
): SelectedSettings {
  if (!value) return {};

  const settings: SelectedSettings = {};

  settings[key] = {
    id: key,
    label: "Custom",
    value,
  };

  return settings;
}

export function settingsIsForFormat(
  settings: SelectedSettings,
  formatId: string,
): boolean {
  if (!settings || !formatId) return false;
  return Object.values(settings).some((setting) =>
    setting.id.startsWith(formatId),
  );
}

export function isCustomPreset(data: any): boolean {
  const keys = Object.keys(data);
  const requiredKeys = [
    "id",
    "label",
    "value",
    "ext",
    "isCustomPreset",
    "settings",
  ];

  return (
    requiredKeys.every((key) => keys.includes(key)) &&
    data.isCustomPreset === true &&
    data.settings.presetSetting?.value !== undefined
  );
}
