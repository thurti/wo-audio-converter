import { derived, get, writable } from "svelte/store";
import {
  type ConfigFormatOption,
  type ConfigSettingOption,
  config,
} from "./config";
import {
  createPersistentBooleanStore,
  createPersistentJsonStore,
  createPersistentNumberStore,
} from "./lib/utils/store";
import type { UIInputItem } from "./types/UIInputItem";

export type SelectedSettings = {
  [key: string]: ConfigSettingOption;
};

/**
 * Show complete UI.
 */
export const isOpen = writable<boolean>(false);

/**
 * Array of selected files for conversion.
 */
export const selectedFiles = writable<File[]>([]);

export type CustomPreset = {
  ext: string;
  settings: SelectedSettings;
  isCustomPreset: true;
} & UIInputItem;
export const customPresets = createPersistentJsonStore<Array<CustomPreset>>(
  "customPresets",
  [],
);

/**
 * Available formates/presets for conversion.
 */
export const configFormats = derived(customPresets, ($customPresets) => {
  const configFormats = structuredClone(config.formats);
  configFormats.options = [...config.formats.options, ...$customPresets];

  return configFormats;
});

/**
 * Available settings for given id.
 */
export const configFormatsSettings = derived(
  customPresets,
  ($customPresets) => {
    const settings = structuredClone(config.settings);

    for (const customPreset of $customPresets) {
      settings[customPreset.id] = [Object.values(customPreset.settings)[0]];
    }

    return settings;
  },
);

export const getDefaultFormat = (): ConfigFormatOption =>
  // cast to ConfigFormatOption because default format must be set in config
  structuredClone(
    get(configFormats).options.find((format) => format.isDefault),
  ) as ConfigFormatOption;

/**
 * The selected target file format. (eg. mp3)
 */
export const selectedFormat = createPersistentJsonStore<
  ConfigFormatOption | CustomPreset
>("selectedFormat", getDefaultFormat());

/**
 * The default settings for the selected format.
 */
export const defaultSettings = derived(
  [selectedFormat, configFormatsSettings],
  ([$selectedFormat, $configFormatsSettings]) => {
    const configSettings = structuredClone(
      $configFormatsSettings[$selectedFormat?.id],
    );

    const settings = {} as SelectedSettings;
    if (!configSettings) return settings;

    for (const setting of configSettings) {
      settings[setting.id] =
        setting.options?.find((options) => options.isDefault) ?? setting;
    }

    return settings;
  },
);

/**
 * The selected settings for the conversion. (eg. sample rate, bit rate, etc.)
 */
export const selectedSettings = createPersistentJsonStore<SelectedSettings>(
  "selectedSettings",
  structuredClone(get(defaultSettings)),
);

/**
 * True if the user has selected a custom command. in the expert settings.
 */
export const isCustomCommand = createPersistentBooleanStore(
  "isCustomCommand",
  false,
);

/**
 * True if the app was opened with a url sharing params for format, settings.
 */
export const isSharedSettings = writable<boolean>(false);

/**
 * Log output from ffmpeg.
 */
export const logger = writable<string>("");

/**
 * True while ffmpeg files are being preloaded. (wasm, sw, script)
 */
export const isPreloadingFiles = writable<boolean>(false);

/**
 * True while files are being converted.
 */
export const isConverting = writable<boolean>(false);

/**
 * True if converted files are ready for download.
 */
export const isDownloadReady = writable<boolean>(false);

/**
 * Total files that have been converted all time.
 */
export const conversionCount = createPersistentNumberStore(
  "conversionCount",
  0,
);

/**
 * Array of files that are ready for download.
 */
export const filesReadyForDownload = writable<Set<File>>(new Set());

/**
 * If true the UI will show the reduced upload UI with an expanded dropzone.
 */
export const showReducedUploadUi = createPersistentBooleanStore(
  "showReducedUploadUi",
  false,
);

/**
 * If true the the advanced settings details tab is open.
 */
export const showAdvancedSettings = createPersistentBooleanStore(
  "showAdvancedSettings",
  false,
);

/**
 * If true a notification will be shown when files are ready for download.
 */
export const notifyOnConversionReady = createPersistentBooleanStore(
  "notifyOnConversionReady",
  false,
);

/**
 * If true a badge will be shown when files are ready for download.
 */
export const badgeOnConversionReady = createPersistentBooleanStore(
  "badgeOnConversionReady",
  false,
);

/**
 * Light, dark, or auto color scheme.
 */
export const preferedColorScheme = createPersistentJsonStore<
  "auto" | "light" | "dark"
>("prefersLightTheme", "auto");
