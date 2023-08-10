import { writable } from "svelte/store";
import {
  config,
  type ConfigFormatOption,
  type ConfigSettingOption,
} from "./config";
import {
  createPersistentBooleanStore,
  createPersistentJsonStore,
  createPersistentNumberStore,
} from "./lib/store-utisl";

export type SelectedSettings = {
  [key: string]: ConfigSettingOption;
};

export const isOpen = writable<boolean>(false);
export const selectedFiles = writable<File[]>([]);
export const selectedFormat = createPersistentJsonStore<ConfigFormatOption>(
  "selectedFormat",
  structuredClone(config.defaults.format)
);
export const selectedSettings = createPersistentJsonStore<SelectedSettings>(
  "selectedSettings",
  structuredClone(config.defaults.settings[config.defaults.format.value])
);
export const isCustomCommand = createPersistentBooleanStore(
  "isCustomCommand",
  false
);
export const logger = writable<string>("");

export const isPreloadingFFmpeg = writable<boolean>(false);
export const isConverting = writable<boolean>(false);
export const isDownloadReady = writable<boolean>(false);

export const conversionCount = createPersistentNumberStore(
  "conversionCount",
  0
);
export const filesReadyForDownload = writable<Set<File>>(new Set());

// PREFERENCES
export const showFullUi = createPersistentBooleanStore("showFullUi", false);
export const showAdvancedSettings = createPersistentBooleanStore(
  "showAdvancedSettings",
  false
);
export const notifyOnConversionReady = createPersistentBooleanStore(
  "notifyOnConversionReady",
  false
);
export const badgeOnConversionReady = createPersistentBooleanStore(
  "badgeOnConversionReady",
  false
);
