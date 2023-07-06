import { derived, writable } from "svelte/store";
import {
  config,
  type ConfigFormatOption,
  type ConfigSettingOption,
} from "./config";

export type SelectedSettings = {
  [key: string]: ConfigSettingOption;
};

export const isOpen = writable<boolean>(false);
export const selectedFiles = writable<File[]>([]);
export const selectedFormat = writable<ConfigFormatOption>(
  structuredClone(config.defaults.format)
);
export const selectedSettings = writable<SelectedSettings>(
  structuredClone(config.defaults.settings[config.defaults.format.value])
);
export const isCustomCommand = writable<boolean>(false);
export const logger = writable<string>("");

export const isPreloadingFFmpeg = writable<boolean>(false);
export const isConverting = writable<boolean>(false);
export const isDownloadReady = writable<boolean>(false);

const createConversionCountStore = () => {
  const { subscribe, set, update } = writable(0);

  try {
    set(
      parseInt(
        localStorage.getItem(`${config.cachePrefix}-conversionCount`) ?? "0"
      )
    );
  } catch (error) {
    console.warn(error);
  }

  return {
    subscribe,
    set: (value: number) => {
      try {
        localStorage.setItem(
          `${config.cachePrefix}-conversionCount`,
          value.toString()
        );
      } catch (error) {
        console.warn(error);
      }

      set(value);
    },
  };
};

export const conversionCount = createConversionCountStore();
export const notifyOnConversionReady = writable<boolean>(false);
export const badgeOnConversionReady = writable<boolean>(false);
export const filesReadyForDownload = writable<Set<File>>(new Set());
