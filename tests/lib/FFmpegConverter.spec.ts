import { FFmpegConverter } from "@/lib/FFmpegConverter";
import { fetchFile } from "@ffmpeg/util";
import { describe } from "vitest";

const loadSpy = vi.fn();
const execSpy = vi.fn();
const terminateSpy = vi.fn();
const onSpy = vi.fn();
const writeFileSpy = vi.fn();
const readFileSpy = vi.fn();

vi.mock("@ffmpeg/ffmpeg", () => {
  const FFmpeg = vi.fn(() => ({
    load: loadSpy,
    exec: execSpy,
    terminate: terminateSpy,
    on: onSpy,
    writeFile: writeFileSpy,
    readFile: readFileSpy,
    loaded: true,
  }));
  return { FFmpeg };
});

vi.mock("@ffmpeg/util", () => ({
  fetchFile: vi.fn(),
}));

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

      expect(onSpy).toHaveBeenCalledWith("progress", expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith("log", expect.any(Function));
      expect(loadSpy).toHaveBeenCalled();
      expect(writeFileSpy).toHaveBeenCalledWith(
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
      await converter.init();
      expect(converter.isLoaded()).toBe(true);
    });
  });

  describe("#convert()", async () => {
    it("should convert a file", async () => {
      fetchFile.mockResolvedValueOnce(new Uint8Array([1, 2, 3]));

      await converter.init();
      await converter.convert(
        { id: "mp3", label: "mp3", value: "mp3", ext: "mp3" },
        { bitrate: { id: "cbr-4", label: "196 kbit/s", value: "-q:b 196k" } }
      );

      expect(fetchFile).toHaveBeenCalledWith(myFile);

      expect(writeFileSpy).toHaveBeenNthCalledWith(
        1,
        "test.mp4",
        new Uint8Array([1, 2, 3])
      );

      expect(execSpy).toHaveBeenCalledWith([
        "-i",
        "test.mp4",
        "-q:b",
        "196k",
        "test.mp3",
      ]);

      expect(readFileSpy).toHaveBeenNthCalledWith(1, "test.mp3");
    });
  });

  describe("#cancel()", () => {
    it("should not run if ffmpeg is not loaded", async () => {
      await converter.cancel();
      expect(terminateSpy).not.toHaveBeenCalled();
      expect(progress.set).not.toHaveBeenCalled();
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it("should destroy ffmpeg and call init again", async () => {
      await converter.init();
      await converter.cancel();
      expect(terminateSpy).toHaveBeenCalled();
      expect(progress.set).toBeCalledWith(0);
      expect(loadSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("#destroy()", () => {
    it("should not run if ffmpeg is not loaded", async () => {
      converter.destroy();
      expect(terminateSpy).not.toHaveBeenCalled();
    });

    it("should destroy ffmpeg", async () => {
      await converter.init();
      converter.destroy();
      expect(terminateSpy).toHaveBeenCalled();
    });
  });
});
