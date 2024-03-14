import {
  createFFmegCommandArgs,
  getSettingsString,
  createSettingsFromString,
  settingsIsForFormat,
  isCustomPreset,
} from "@/lib/utils/settings";
import type { CustomPreset } from "@/store";
import { describe } from "vitest";

describe("lib/utils", () => {
  describe("#getSettingsString()", () => {
    it("should return an empty string if no settings are specified", () => {
      const settingsString = getSettingsString(null);
      expect(settingsString).toEqual("");
    });

    it("should return a string with all settings", () => {
      const settings = {
        "bit-depth": { id: "16", label: "16 bit", value: "-acodec pcm_s16le" },
        "sample-rate": {
          id: "44.1",
          label: "44.1 kHz",
          value: "-ar 44100",
        },
      };

      const settingsString = getSettingsString(settings);
      expect(settingsString).toEqual("-acodec pcm_s16le -ar 44100");
    });

    it("should remove whitespaces from empty settings", () => {
      const settings = {
        test: { id: "a", label: "a", value: "test" },
        codec: { id: "mp3", label: "mp3", value: " " },
        "bit-depth": { id: "16", label: "16 bit", value: " " },
        "sample-rate": {
          id: "44.1",
          label: "44.1 kHz",
          value: "-ar 44100",
        },
      };

      const settingsString = getSettingsString(settings);
      expect(settingsString).toEqual("test -ar 44100");
    });
  });

  describe("#createSettingsFromString()", () => {
    it("should return an empty object if no settings are specified", () => {
      const settings = createSettingsFromString(null);
      expect(settings).toEqual({});
    });

    it("should return an object with all settings", () => {
      const settingsString = "-acodec pcm_s16le -ar 44100";
      const settings = createSettingsFromString(settingsString);
      expect(settings).toEqual({
        custom: {
          id: "custom",
          label: "Custom",
          value: "-acodec pcm_s16le -ar 44100",
        },
      });
    });

    it("should use key if specified", () => {
      const settingsString = "-acodec pcm_s16le -ar 44100";
      const settings = createSettingsFromString(settingsString, "myKey");
      expect(settings).toEqual({
        myKey: {
          id: "myKey",
          label: "Custom",
          value: "-acodec pcm_s16le -ar 44100",
        },
      });
    });
  });

  describe("#settingsIsForFormat()", () => {
    it("should return false if no settings are specified", () => {
      const isForFormat = settingsIsForFormat(null, null);
      expect(isForFormat).toBe(false);
    });

    it("should return false if settings are not for the format", () => {
      const settings = {
        "bit-depth": {
          id: "wav-16",
          label: "16 bit",
          value: "-acodec pcm_s16le",
        },
        "sample-rate": {
          id: "wav-44.1",
          label: "44.1 kHz",
          value: "-ar 44100",
        },
      };

      const isForFormat = settingsIsForFormat(settings, "mp3");
      expect(isForFormat).toBe(false);
    });

    it("should return true if settings are for the format", () => {
      const settings = {
        "bit-depth": {
          id: "wav-16",
          label: "16 bit",
          value: "-acodec pcm_s16le",
        },
        "sample-rate": {
          id: "wav-44.1",
          label: "44.1 kHz",
          value: "-ar 44100",
        },
      };

      const isForFormat = settingsIsForFormat(settings, "wav");
      expect(isForFormat).toBe(true);
    });
  });

  describe("#createFFmegCommandArgs()", () => {
    it("should return an empty array if no file is specified", () => {
      const commandArgs = createFFmegCommandArgs(null, null, null);
      expect(commandArgs).toEqual([]);
    });

    it("should create a ffmpeg command from options", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      const format = {
        id: "mp3",
        label: "mp3",
        value: "mp3",
        ext: "mp3",
        mimetype: "audio/mp3",
      };
      const settings = {
        bitrate: { id: "cbr-4", label: "196 kbit/s", value: "-q:b 196k" },
      };

      const commandArgs = createFFmegCommandArgs(file, format, settings);

      expect(commandArgs).toEqual([
        "-i",
        "test.mp4",
        "-q:b",
        "196k",
        "test.mp3",
      ]);
    });
  });

  describe("#isCustomPreset()", () => {
    it("should return true if data has structure of custom preset", () => {
      const data: CustomPreset = {
        id: "custom",
        label: "Custom",
        value: "-acodec pcm_s16le -ar 44100",
        isCustomPreset: true,
        ext: "wav",
        settings: {
          presetSetting: {
            id: "preset",
            label: "Preset",
            value: "preset",
          },
        },
      };

      expect(isCustomPreset(data)).toBe(true);
    });

    it("should return false if data has no structure of custom preset", () => {
      const data = {
        id: "custom",
        label: "Custom",
        value: "-acodec pcm_s16le -ar 44100",
      };

      expect(isCustomPreset(data)).toBe(false);
    });

    it("should return false if data has no settings", () => {
      const data = {
        id: "custom",
        label: "Custom",
        value: "-acodec pcm_s16le -ar 44100",
        isCustomPreset: true,
        settings: {},
      };

      expect(isCustomPreset(data)).toBe(false);
    });
  });
});
