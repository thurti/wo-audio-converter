import { FFmpegConverter } from "@/lib/FFmpegConverter";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { describe } from "vitest";

const setLoggerSpy = vi.fn();
const loadSpy = vi.fn();
const FSSpy = vi.fn();
const runSpy = vi.fn();
const exitSpy = vi.fn();
const isLoadedSpy = vi.fn();

vi.mock("@ffmpeg/ffmpeg", () => {
  return {
    createFFmpeg: () => ({
      setLogger: setLoggerSpy,
      load: loadSpy,
      FS: FSSpy,
      run: runSpy,
      exit: exitSpy,
      isLoaded: isLoadedSpy,
    }),
    fetchFile: vi.fn(),
  };
});

const myFile = new File([""], "test.mp4", { type: "video/mp4" });

const progress = {
  set: vi.fn(),
} as any;

const logger = {
  update: vi.fn(),
} as any;
let converter;

describe("lib/FFmpegConverter", () => {
  beforeEach(() => {
    converter = new FFmpegConverter(myFile, progress, logger);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("#constructor()", () => {
    it("should create a new instance and set props", async () => {
      expect(converter).toBeInstanceOf(FFmpegConverter);
      expect(converter.file).toBe(myFile);
      expect(converter.progress).toBe(progress);
      expect(converter.logger).toBe(logger);
    });
  });

  describe("#init()", async () => {
    it("should initialize ffmpeg", async () => {
      fetchFile.mockResolvedValueOnce(new Uint8Array([1, 2, 3]));
      await converter.init();

      expect(setLoggerSpy).toHaveBeenCalled();
      expect(loadSpy).toHaveBeenCalled();
      expect(FSSpy).toHaveBeenCalledWith(
        "writeFile",
        "test.mp4",
        new Uint8Array([1, 2, 3])
      );
    });
  });

  describe("#isLoaded()", () => {
    it("should return false if ffmpeg is not loaded", async () => {
      expect(converter.isLoaded()).toBe(false);
    });

    it("should return true if ffmpeg is loaded", async () => {
      isLoadedSpy.mockReturnValueOnce(true);
      await converter.init();
      expect(converter.isLoaded()).toBe(true);
    });
  });

  describe("#convert()", async () => {
    it("should convert a file", async () => {
      isLoadedSpy.mockReturnValueOnce(true);
      fetchFile.mockResolvedValueOnce(new Uint8Array([1, 2, 3]));

      await converter.init();
      await converter.convert(
        { id: "mp3", label: "mp3", value: "mp3" },
        { bitrate: { id: "cbr-4", label: "196 kbit/s", value: "-q:b 196k" } }
      );

      expect(fetchFile).toHaveBeenCalledWith(myFile);

      expect(FSSpy).toHaveBeenNthCalledWith(
        1,
        "writeFile",
        "test.mp4",
        new Uint8Array([1, 2, 3])
      );

      expect(runSpy).toHaveBeenCalledWith(
        "-i",
        "test.mp4",
        "-q:b",
        "196k",
        "test.mp3"
      );

      expect(FSSpy).toHaveBeenNthCalledWith(2, "readFile", "test.mp3");
    });
  });

  describe("#cancel()", () => {
    it("should not run if ffmpeg is not loaded", async () => {
      await converter.cancel();
      expect(exitSpy).not.toHaveBeenCalled();
      expect(progress.set).not.toHaveBeenCalled();
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it("should destroy ffmpeg and call init again", async () => {
      isLoadedSpy.mockReturnValueOnce(true);
      await converter.init();
      await converter.cancel();
      expect(exitSpy).toHaveBeenCalled();
      expect(progress.set).toBeCalledWith(0);
      expect(loadSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("#destroy()", () => {
    it("should not run if ffmpeg is not loaded", async () => {
      converter.destroy();
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it("should destroy ffmpeg", async () => {
      isLoadedSpy.mockReturnValueOnce(true);
      await converter.init();
      converter.destroy();
      expect(exitSpy).toHaveBeenCalled();
    });
  });
});
