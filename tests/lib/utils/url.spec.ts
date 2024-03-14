import {
  setDataAsUrlParam,
  getDataFromUrlParam,
  getShareSettingsUrl,
} from "@/lib/utils/url";
import { describe } from "vitest";

describe("lib/utils", () => {
  describe("#setDataAsUrlParam", () => {
    it("should call pushState with stringified data", () => {
      const pushStateSpy = vi.spyOn(window.history, "pushState");
      setDataAsUrlParam("test", { id: "1", label: "test", value: "value" });

      expect(pushStateSpy).toHaveBeenCalledWith(
        {},
        "",
        "http://localhost:3000/?test=%7B%22id%22%3A%221%22%2C%22label%22%3A%22test%22%2C%22value%22%3A%22value%22%7D",
      );
    });

    it("should call replaceState with stringified data", () => {
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");
      setDataAsUrlParam(
        "test",
        { id: "1", label: "test", value: "value" },
        true,
      );

      expect(replaceStateSpy).toHaveBeenCalledWith(
        {},
        "",
        "http://localhost:3000/?test=%7B%22id%22%3A%221%22%2C%22label%22%3A%22test%22%2C%22value%22%3A%22value%22%7D",
      );
    });
  });

  describe("#getDataFromUrlParam", () => {
    it("should return the data from the url param", () => {
      window.history.pushState(
        {},
        "",
        "/?test=%7B%22id%22%3A%221%22%2C%22label%22%3A%22test%22%2C%22value%22%3A%22value%22%7D",
      );
      const data = getDataFromUrlParam("test");
      expect(data).toEqual({ id: "1", label: "test", value: "value" });
    });

    it("should return an null if the param is not in the url", () => {
      window.history.pushState({}, "", "/");
      const data = getDataFromUrlParam("test");
      expect(data).toEqual(null);
    });
  });

  describe("#getShareLink()", () => {
    it("should return link with the current format and settings", () => {
      const format = {
        id: "acc",
        label: "aac (m4a)",
        value: "acc",
        ext: "m4a",
        mimetype: "audio/mp4",
      };

      const settings = {
        bitrate: {
          id: "acc-vbr-1",
          label: "VBR 20-32 kbps/channel",
          value: "-vbr 1",
        },
        "sample-rate": { id: "acc-sr-96", label: "96 kHz", value: "-ar 96000" },
      };

      const url = getShareSettingsUrl(format, settings);

      expect(url).toEqual(
        "http://localhost:3000/?format=%7B%22id%22%3A%22acc%22%2C%22label%22%3A%22aac+%28m4a%29%22%2C%22value%22%3A%22acc%22%2C%22ext%22%3A%22m4a%22%2C%22mimetype%22%3A%22audio%2Fmp4%22%7D&settings=%7B%22bitrate%22%3A%7B%22id%22%3A%22acc-vbr-1%22%2C%22label%22%3A%22VBR+20-32+kbps%2Fchannel%22%2C%22value%22%3A%22-vbr+1%22%7D%2C%22sample-rate%22%3A%7B%22id%22%3A%22acc-sr-96%22%2C%22label%22%3A%2296+kHz%22%2C%22value%22%3A%22-ar+96000%22%7D%7D",
      );

      const format2 = new URL(url).searchParams.get("format");
      const settings2 = new URL(url).searchParams.get("settings");

      expect(JSON.parse(format2)).toEqual(format);
      expect(JSON.parse(settings2)).toEqual(settings);
    });
  });
});
