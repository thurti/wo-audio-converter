import type { SelectedSettings } from "./store";
import type { UIInputItem } from "./types/UIInputItem";

export const config = {
  debug: false,
  disableServiceWorker: false,
  updateInterval: 20000,
  version: import.meta.env.PACKAGE_VERSION,
  url: "https://worksoffline.app/audio-converter",
  github: "https://github.com/thurti/wo-audio-converter",
  title: "Audio File Converter",
  titleHeader: "Audio\nFile Converter",
  localStoragePrefix: "wo-audio-converter",
  notificationIcon: "/icons/android-chrome-192x192.png",
  colorScheme: "zinc-emerald",
  allowedFormats: "audio/*, video/*",
  maxFileSizeMb: 2000, //2GB hard wasm max
  fileDropLabel: "Add Audio or Video Files",
  formats: <ConfigFormats>{
    id: "format",
    label: "Convert to Format",
    value: "format",
    options: [
      {
        id: "wav",
        label: "wav",
        value: "wav",
        ext: "wav",
        mimetype: "audio/wav",
      },
      {
        id: "mp3",
        label: "mp3",
        value: "mp3",
        ext: "mp3",
        mimetype: "audio/mpeg",
        isDefault: true,
      },
      {
        id: "ogg",
        label: "ogg",
        value: "ogg",
        ext: "ogg",
        mimetype: "audio/ogg",
      },
      {
        id: "acc",
        label: "aac (m4a)",
        value: "acc",
        ext: "m4a",
        mimetype: "audio/mp4",
      },
      {
        id: "flac",
        label: "flac",
        value: "flac",
        ext: "flac",
        mimetype: "audio/flac",
      },
      {
        id: "alac",
        label: "alac (m4a)",
        value: "alac",
        ext: "m4a",
        mimetype: "audio/alac",
      },
    ],
  },
  settings: <ConfigSettings>{
    wav: [
      {
        id: "wav-codec",
        value: "-vn",
        isDefault: true,
      },
      {
        id: "bit-depth",
        label: "Bit Depth",
        value: "bit-depth",
        options: [
          { id: "wav-bd-none", label: "as source", value: " " },
          { id: "wav-bd-8", label: "8 bit", value: "-acodec pcm_u8" },
          {
            id: "wav-bd-16",
            label: "16 bit",
            value: "-acodec pcm_s16le",
            isDefault: true,
          },
          { id: "wav-bd-24", label: "24 bit", value: "-acodec pcm_s24le" },
          { id: "wav-bd-32", label: "32 bit", value: "-acodec pcm_s32le" },
        ],
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          { id: "wav-sr-none", label: "as source", value: " " },
          { id: "wav-sr-8", label: "8 kHz", value: "-ar 8000" },
          { id: "wav-sr-16", label: "16 kHz", value: "-ar 16000" },
          { id: "wav-sr-22.05", label: "22.05 kHz", value: "-ar 22050" },
          { id: "wav-sr-32", label: "32 kHz", value: "-ar 32000" },
          {
            id: "wav-sr-44.1",
            label: "44.1 kHz",
            value: "-ar 44100",
            isDefault: true,
          },
          { id: "wav-sr-48", label: "48 kHz", value: "-ar 48000" },
          { id: "wav-sr-96", label: "96 kHz", value: "-ar 96000" },
        ],
      },
    ],
    mp3: [
      {
        id: "mp3-codec",
        value: "-vn -acodec libmp3lame",
        isDefault: true,
      },
      {
        id: "bitrate",
        label: "Bitrate",
        value: "bitrate",
        options: [
          {
            id: "mp3-vbr-0",
            label: "VBR 245 kbit/s",
            value: "-q:a 0",
            isDefault: true,
          },
          { id: "mp3-vbr-1", label: "VBR 225 kbit/s", value: "-q:a 1" },
          { id: "mp3-vbr-2", label: "VBR 190 kbit/s", value: "-q:a 2" },
          { id: "mp3-vbr-3", label: "VBR 175 kbit/s", value: "-q:a 3" },
          { id: "mp3-vbr-4", label: "VBR 165 kbit/s", value: "-q:a 4" },
          { id: "mp3-vbr-5", label: "VBR 130 kbit/s", value: "-q:a 5" },
          { id: "mp3-vbr-6", label: "VBR 115 kbit/s", value: "-q:a 6" },
          { id: "mp3-vbr-7", label: "VBR 100 kbit/s", value: "-q:a 7" },
          { id: "mp3-vbr-8", label: "VBR 85 kbit/s", value: "-q:a 8" },
          { id: "mp3-vbr-9", label: "VBR 65 kbit/s", value: "-q:a 9" },
          { id: "mp3-cbr-0", label: "CBR 320 kbit/s", value: "-b:a 320k" },
          { id: "mp3-cbr-2", label: "CBR 256 kbit/s", value: "-b:a 256k" },
          { id: "mp3-cbr-4", label: "CBR 196 kbit/s", value: "-b:a 196k" },
          { id: "mp3-cbr-6", label: "CBR 128 kbit/s", value: "-b:a 128k" },
          { id: "mp3-cbr-8", label: "CBR 96 kbit/s", value: "-b:a 96k" },
        ],
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          {
            id: "mp3-sr-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "mp3-sr-8", label: "8 kHz", value: "-ar 8000" },
          { id: "mp3-sr-11.025", label: "11.025 kHz", value: "-ar 11025" },
          { id: "mp3-sr-16", label: "16 kHz", value: "-ar 16000" },
          { id: "mp3-sr-22.05", label: "22.05 kHz", value: "-ar 22050" },
          { id: "mp3-sr-32", label: "32 kHz", value: "-ar 32000" },
          { id: "mp3-sr-44.1", label: "44.1 kHz", value: "-ar 44100" },
          { id: "mp3-sr-48", label: "48 kHz", value: "-ar 48000" },
        ],
      },
    ],
    ogg: [
      {
        id: "ogg-codec",
        value: "-vn",
        isDefault: true,
      },
      {
        id: "bitrate",
        label: "Bitrate",
        value: "bitrate",
        options: [
          { id: "ogg-vbr-10", label: "VBR 500 kbit/s", value: "-q:a 10" },
          {
            id: "ogg-vbr-9",
            label: "VBR 320 kbit/s",
            value: "-q:a 9",
            isDefault: true,
          },
          { id: "ogg-vbr-8", label: "VBR 256 kbit/s", value: "-q:a 8" },
          { id: "ogg-vbr-7", label: "VBR 224 kbit/s", value: "-q:a 7" },
          { id: "ogg-vbr-6", label: "VBR 192 kbit/s", value: "-q:a 6" },
          { id: "ogg-vbr-5", label: "VBR 160 kbit/s", value: "-q:a 5" },
          { id: "ogg-vbr-4", label: "VBR 128 kbit/s", value: "-q:a 4" },
          { id: "ogg-vbr-3", label: "VBR 112 kbit/s", value: "-q:a 3" },
          { id: "ogg-vbr-2", label: "VBR 96 kbit/s", value: "-q:a 2" },
          { id: "ogg-vbr-1", label: "VBR 80 kbit/s", value: "-q:a 1" },
          { id: "ogg-vbr-0", label: "VBR 64 kbit/s", value: "-q:a 0" },
        ],
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          {
            id: "ogg-sr-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "ogg-sr-8", label: "8 kHz", value: "-ar 8000" },
          { id: "ogg-sr-16", label: "16 kHz", value: "-ar 16000" },
          { id: "ogg-sr-22.05", label: "22.05 kHz", value: "-ar 22050" },
          { id: "ogg-sr-32", label: "32 kHz", value: "-ar 32000" },
          { id: "ogg-sr-44.1", label: "44.1 kHz", value: "-ar 44100" },
          { id: "ogg-sr-48", label: "48 kHz", value: "-ar 48000" },
          { id: "ogg-sr-96", label: "96 kHz", value: "-ar 96000" },
        ],
      },
    ],
    acc: [
      {
        id: "acc-codec",
        value: "-vn",
        isDefault: true,
      },
      {
        id: "bitrate",
        label: "Bitrate",
        value: "bitrate",
        options: [
          {
            id: "acc-vbr-5",
            label: "VBR 96-112 kbps/channel",
            value: "-vbr 5",
            isDefault: true,
          },
          { id: "acc-vbr-4", label: "VBR 64-72 kbps/channel", value: "-vbr 4" },
          { id: "acc-vbr-3", label: "VBR 48-56 kbps/channel", value: "-vbr 3" },
          { id: "acc-vbr-2", label: "VBR 32-40 kbps/channel", value: "-vbr 2" },
          { id: "acc-vbr-1", label: "VBR 20-32 kbps/channel", value: "-vbr 1" },
        ],
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          {
            id: "acc-sr-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "acc-sr-8", label: "8 kHz", value: "-ar 8000" },
          { id: "acc-sr-16", label: "16 kHz", value: "-ar 16000" },
          { id: "acc-sr-22.05", label: "22.05 kHz", value: "-ar 22050" },
          { id: "acc-sr-32", label: "32 kHz", value: "-ar 32000" },
          { id: "acc-sr-44.1", label: "44.1 kHz", value: "-ar 44100" },
          { id: "acc-sr-48", label: "48 kHz", value: "-ar 48000" },
          { id: "acc-sr-96", label: "96 kHz", value: "-ar 96000" },
        ],
      },
    ],
    flac: [
      {
        id: "flac-codec",
        value: "-vn -acodec flac",
        isDefault: true,
      },
      {
        id: "compression",
        label: "Compression Level",
        value: "compression",
        options: [
          {
            id: "flac-c-0",
            label: "Comp. Level 0",
            value: "-compression_level 0",
          },
          {
            id: "flac-c-3",
            label: "Comp. Level 3",
            value: "-compression_level 3",
          },
          {
            id: "flac-c-5",
            label: "Comp. Level 5",
            value: "-compression_level 5",
            isDefault: true,
          },
          {
            id: "flac-c-8",
            label: "Comp. Level 8",
            value: "-compression_level 8",
          },
          {
            id: "flac-c-10",
            label: "Comp. Level 10",
            value: "-compression_level 10",
          },
          {
            id: "flac-c-12",
            label: "Comp. Level 12",
            value: "-compression_level 12",
          },
        ],
      },
      {
        id: "bit-depth",
        label: "Bit Depth",
        value: "bit-depth",
        options: [
          {
            id: "flac-bd-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "flac-bd-16", label: "16 bit", value: "-sample_fmt s16" },
          { id: "flac-bd-32", label: "32 bit", value: "-sample_fmt s32" },
        ],
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          {
            id: "flac-sr-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "flac-sr-44.1", label: "44.1 kHz", value: "-ar 44100" },
          { id: "flac-sr-48", label: "48 kHz", value: "-ar 48000" },
          { id: "flac-sr-96", label: "96 kHz", value: "-ar 96000" },
        ],
      },
    ],
    alac: [
      {
        id: "alac-codec",
        label: "Alac Codec",
        value: "-vn -acodec alac",
        isDefault: true,
      },
      {
        id: "sample-rate",
        label: "Sample Rate",
        value: "sample-rate",
        options: [
          {
            id: "alac-sr-none",
            label: "as source",
            value: " ",
            isDefault: true,
          },
          { id: "alac-sr-44.1", label: "44.1 kHz", value: "-ar 44100" },
          { id: "alac-sr-48", label: "48 kHz", value: "-ar 48000" },
          { id: "alac-sr-96", label: "96 kHz", value: "-ar 96000" },
        ],
      },
    ],
  },
};

export type ConfigFormats = {
  id: string;
  label: string;
  value: string;
  options: ConfigFormatOption[];
};

export interface ConfigFormatOption extends UIInputItem {
  mimetype?: string;
  ext: string;
  isDefault?: boolean;
  isCustomPreset: boolean;
}

export type ConfigSettings = {
  [id: string]: ConfigSettingOption[];
};

export interface ConfigSettingOption extends UIInputItem<string> {
  options?: ConfigSettingOption[];
  isDefault?: boolean;
}
