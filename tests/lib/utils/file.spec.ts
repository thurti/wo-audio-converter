import {
  isFileType,
  getOutputFilename,
  isMaxFileSizeMb,
  getFileExtension,
  saveFileAs,
  saveAllFiles,
  trackDownloadProgress,
  readJsonFile,
} from "@/lib/utils/file";
import { describe } from "vitest";

describe("lib/utils", () => {
  describe("#getOutputFilename()", () => {
    it("should return the output filename", () => {
      const filename = getOutputFilename("te.st asd.mp4", {
        id: "mp3",
        label: "mp3",
        value: "mp3",
        ext: "mp3",
        mimetype: "audio/mp3",
        isCustomPreset: false,
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
        isCustomPreset: false,
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
        { create: true },
      );
      expect(mockWritable.write).toHaveBeenNthCalledWith(1, files[0].data);
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        2,
        "test3.txt",
        { create: true },
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
        { create: true },
      );
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        1,
        "test1.txt",
        { create: true },
      );
      expect(mockDirHandle.getFileHandle).toHaveBeenNthCalledWith(
        2,
        "test2_1.txt",
        { create: true },
      );
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

  describe("#trackDownloadProgress()", async () => {
    it("should call progress and done callback with values", async () => {
      const readerMock = vi
        .fn()
        .mockResolvedValue({ done: true })
        .mockResolvedValueOnce({ done: false, value: new Uint8Array(50) });

      const response = {
        url: "http://example.com",
        headers: {
          get: () => "100",
        },
        body: {
          getReader: () => ({
            read: readerMock,
          }),
        },
      } as unknown as Response;

      const reportProgress = vi.fn();
      const reportDone = vi.fn();

      trackDownloadProgress(response, reportProgress, reportDone);

      // wait for the first read
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(reportProgress).toHaveBeenCalledWith(
        50,
        100,
        "http://example.com",
      );

      expect(reportDone).toHaveBeenCalledWith("http://example.com");
    });
  });

  describe("#readJsonFile()", () => {
    it("should read a json file", async () => {
      const file = new File([JSON.stringify({ test: "test" })], "test.json", {
        type: "application/json",
      });
      const data = await readJsonFile(file);
      expect(data).toEqual({ test: "test" });
    });

    it("should throw an error if the file is not a json file", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      try {
        await readJsonFile(file);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
