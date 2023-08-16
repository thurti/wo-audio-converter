import {
  isFileType,
  createFFmegCommandArgs,
  generateRandomId,
  getOutputFilename,
  getSettingsString,
  createSettingsFromString,
  isMaxFileSizeMb,
  registerServiceWorker,
  addUrlToCache,
  preloadFilesToCache,
  deleteCachesStartWith,
  isWorkerAllowed,
  getFileExtension,
  saveFileAs,
  saveAllFiles,
  settingsIsForFormat,
} from "@/lib/utils";
import { describe } from "vitest";

describe("lib/utils", () => {
  describe("#generateRandomId()", () => {
    it("should generate a random id", () => {
      const id = generateRandomId("test");
      expect(id).toMatch(/^test-.+$/);
    });
  });

  describe("#getOutputFilename()", () => {
    it("should return the output filename", () => {
      const filename = getOutputFilename("te.st asd.mp4", {
        id: "mp3",
        label: "mp3",
        value: "mp3",
        ext: "mp3",
        mimetype: "audio/mp3",
      });
      expect(filename).toEqual("te.st asd.mp3");
    });

    it("should return an filename with added 1 if the filename already exists", () => {
      const filename = getOutputFilename("test.mp3", {
        id: "mp3",
        label: "mp3",
        value: "mp3",
        ext: "mp3",
        mimetype: "audio/mp3",
      });
      expect(filename).toEqual("test_1.mp3");
    });
  });

  describe("#getFileExtension()", () => {
    it("should return the file extension", () => {
      const extension = getFileExtension("test.asd-egfd rasd1.mp3");
      expect(extension).toEqual("mp3");
    });
  });

  describe("#saveFileAs()", () => {
    it("should save a file as a new file", async () => {
      const mockWritable = {
        write: vi.fn().mockResolvedValue(true),
        close: vi.fn().mockResolvedValue(true),
      };
      const mockFileHandle = {
        createWritable: vi.fn().mockResolvedValue(mockWritable),
      };
      window.showSaveFilePicker = vi.fn().mockResolvedValue(mockFileHandle);
      const data = new Blob();
      await saveFileAs(new Blob(), "test.mp3", "audio/mp3");

      expect(window.showSaveFilePicker).toHaveBeenCalledWith({
        suggestedName: "test.mp3",
        types: [{ accept: { "audio/mp3": [".mp3"] } }],
      });

      expect(mockFileHandle.createWritable).toHaveBeenCalled();
      expect(mockWritable.write).toHaveBeenCalledWith(data);
      expect(mockWritable.close).toHaveBeenCalled();
    });
  });

  describe("#saveAllFiles()", () => {
    let mockWritable, mockFileHandle, mockDirHandle;

    beforeEach(() => {
      mockWritable = {
        write: vi.fn().mockResolvedValue(true),
        close: vi.fn().mockResolvedValue(true),
      };
      mockFileHandle = {
        createWritable: vi.fn().mockResolvedValue(mockWritable),
      };
      mockDirHandle = {
        keys: vi.fn().mockReturnValue(["test.txt", "test2.txt"]),
        getFileHandle: vi.fn().mockResolvedValue(mockFileHandle),
      };
      window.showDirectoryPicker = vi.fn().mockResolvedValue(mockDirHandle);
    });

    it("should save all files", async () => {
      const files = [
        { data: new Blob([], { type: "text/plain" }), filename: "test1.txt" },
        { data: new Blob([], { type: "text/plain" }), filename: "test3.txt" },
      ];

      await saveAllFiles(files, "myId");

      expect(window.showDirectoryPicker).toHaveBeenCalledWith({
        id: "myId",
        mode: "readwrite",
        startIn: "downloads",
      });

      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        1,
        "test1.txt",
        { create: true }
      );
      expect(mockWritable.write).toHaveBeenNthCalledWith(1, files[0].data);
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        2,
        "test3.txt",
        { create: true }
      );
      expect(mockWritable.write).toHaveBeenNthCalledWith(2, files[1].data);
      expect(mockWritable.close).toHaveBeenCalledTimes(2);
    });

    it("should rename file if already exists", async () => {
      const files = [
        { data: new Blob([], { type: "text/plain" }), filename: "test1.txt" },
        { data: new Blob([], { type: "text/plain" }), filename: "test2.txt" },
      ];
      await saveAllFiles(files, "myId");

      expect(mockDirHandle.getFileHandle).not.toHaveBeenCalledWith(
        "test2.txt",
        { create: true }
      );
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        1,
        "test1.txt",
        { create: true }
      );
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        2,
        "test2_1.txt",
        { create: true }
      );
    });
  });

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

  describe("#checkFileType()", () => {
    it("should return false if no file is specified", () => {
      const isSameType = isFileType(null, "video/*");
      expect(isSameType).toBe(false);
    });

    it("should return true if no type is specified", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      const isSameType = isFileType(file, null);
      expect(isSameType).toBe(true);
    });

    it("should return true if file type is the same", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      const isSameType = isFileType(file, "video/*");
      expect(isSameType).toBe(true);
    });

    it("should return false if file type is not the same", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      const isSameType = isFileType(file, "audio/*");
      expect(isSameType).toBe(false);
    });

    it("should handle multiple types in one string (like in the accept attribute)", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      const isSameType = isFileType(file, "audio/*, video/*");
      expect(isSameType).toBe(true);
    });
  });

  describe("#isMaxFileSize()", () => {
    it("should return false if no file is specified", () => {
      const isMaxSize = isMaxFileSizeMb(null, 10);
      expect(isMaxSize).toBe(false);
    });

    it("should return true if file size is smaller than max size", () => {
      const file = new File([new Uint8Array(5 * 1024 * 1024)], "test.mp4");
      const isMaxSize = isMaxFileSizeMb(file, 5);
      expect(isMaxSize).toBe(true);
    });

    it("should return false if file size is bigger than max size", () => {
      const file = new File([new Uint8Array(10 * 1024 * 1024)], "test.mp4");
      const isMaxSize = isMaxFileSizeMb(file, 5);
      expect(isMaxSize).toBe(false);
    });
  });

  describe("#registerServiceWorker()", () => {
    vi.stubGlobal("navigator", {
      serviceWorker: {
        register: () => Promise.resolve(),
      },
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should register the service worker", () => {
      const registerSpy = vi.spyOn(navigator.serviceWorker, "register");
      registerServiceWorker();
      expect(registerSpy).toHaveBeenCalled();
    });

    it("adds the version to the service worker registration", async () => {
      const registerSpy = vi.spyOn(navigator.serviceWorker, "register");
      await registerServiceWorker("1.0.0");
      expect(registerSpy).toHaveBeenCalledWith(
        "/sw.js?v=1.0.0",
        expect.anything()
      );
    });
  });

  describe("#addUrlToCache()", () => {
    const cache = {
      add: () => vi.fn(),
      match: () => vi.fn(),
    } as unknown as Cache;

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should check if the url is already in the cache and resolve", async () => {
      const matchSpy = vi.spyOn(cache, "match").mockResolvedValue(true);
      const addSpy = vi.spyOn(cache, "add");
      await addUrlToCache("test", cache);
      expect(matchSpy).toHaveBeenCalledWith("test");
      expect(addSpy).not.toHaveBeenCalled();
    });

    it("should add the url to the cache if it is not already in the cache", async () => {
      const matchSpy = vi.spyOn(cache, "match").mockResolvedValue(undefined);
      const addSpy = vi.spyOn(cache, "add").mockResolvedValue(true);
      await addUrlToCache("test", cache);
      expect(matchSpy).toHaveBeenCalledWith("test");
      expect(addSpy).toHaveBeenCalledWith("test");
    });
  });

  describe("#preloadFilesToCache()", () => {
    const cache = {
      add: () => vi.fn(),
      match: () => Promise.resolve(undefined),
    } as unknown as Cache;

    beforeAll(() => {
      vi.stubGlobal("caches", {
        open: () => Promise.resolve(cache),
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it("should add all files to the cache", async () => {
      const openSpy = vi.spyOn(caches, "open");
      const addSpy = vi.spyOn(cache, "add");

      await preloadFilesToCache(["test1", "test2"], "testCache");

      expect(openSpy).toHaveBeenCalledWith("testCache");
      expect(addSpy).toHaveBeenNthCalledWith(1, "test1");
      expect(addSpy).toHaveBeenNthCalledWith(2, "test2");
    });
  });

  describe("#deleteOldCaches()", () => {
    beforeAll(() => {
      vi.stubGlobal("caches", {
        keys: () =>
          Promise.resolve(["testCache1", "testCache2", "anotherCache"]),
        delete: () => Promise.resolve(),
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it("should delete all caches starting with a certain string", async () => {
      const deleteSpy = vi.spyOn(caches, "delete");

      await deleteCachesStartWith("testCache");

      expect(deleteSpy).toHaveBeenNthCalledWith(1, "testCache1");
      expect(deleteSpy).toHaveBeenNthCalledWith(2, "testCache2");
      expect(deleteSpy).not.toHaveBeenCalledWith("anotherCache");
    });
  });

  describe("#isWorkerAllowed()", () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.unstubAllGlobals();
    });

    it("should return false if cookies are not allowed", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: false,
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(false);
    });

    it("should return false if service workers are not supported", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: true,
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(false);
    });

    it("should return true if cookies are allowed and service workers are supported", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: true,
        serviceWorker: {},
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(true);
    });
  });
});
