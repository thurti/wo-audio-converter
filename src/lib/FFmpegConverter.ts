import { FFmpeg } from "@ffmpeg/ffmpeg";
import { writable, type Writable } from "svelte/store";
import { createFFmegCommandArgs } from "@/lib/utils/settings";
import { getOutputFilename } from "@/lib/utils/file";
import type { SelectedSettings } from "@/store";
import type { ConfigFormatOption } from "@/config";
import { fetchFile } from "@ffmpeg/util";

export class FFmpegConverter {
  file: File;
  progress: Writable<number>;
  logger: Writable<string>;

  private ffmpeg: FFmpeg | undefined;

  constructor(
    file: File,
    progress?: Writable<number>,
    logger?: Writable<string>,
  ) {
    this.file = file;
    this.progress = progress ?? writable(0);
    this.logger = logger ?? writable("");
  }

  async init(): Promise<void> {
    this.progress.set(0);
    this.ffmpeg = new FFmpeg();

    this.ffmpeg.on("progress", ({ progress }) => {
      this.progress.set(progress);
    });

    this.ffmpeg.on("log", ({ message }) => {
      this.logger.update((logger) => `${logger}\n ${message}`);
    });

    await this.ffmpeg.load({
      coreURL: import.meta.env.VITE_FFMPEG_CORE_PATH,
      wasmURL: import.meta.env.VITE_FFMPEG_WASM_PATH,
      workerURL: import.meta.env.VITE_FFMPEG_WORKER_PATH,
    });

    await this.ffmpeg.writeFile(this.file.name, await fetchFile(this.file));
  }

  isLoaded(): boolean {
    return this.ffmpeg?.loaded ?? false;
  }

  async convert(
    format: ConfigFormatOption,
    settings: SelectedSettings,
  ): Promise<Uint8Array | null> {
    if (!this.isLoaded()) {
      console.warn("Convert: FFmpeg is not loaded. Run init() first.");
      return null;
    }

    const filename = this.file.name;

    const outputFilename = getOutputFilename(filename, format);
    const commandArgs = createFFmegCommandArgs(this.file, format, settings);

    await this.ffmpeg?.exec(commandArgs);
    return (await this.ffmpeg?.readFile(outputFilename)) as Uint8Array;
  }

  async cancel(): Promise<void> {
    if (!this.isLoaded()) {
      console.warn("Cancel: FFmpeg is not loaded. Run init() first.");
      return;
    } else {
      await this.ffmpeg?.terminate();
      return this.init();
    }
  }

  async destroy(): Promise<void> {
    if (!this.isLoaded()) {
      console.warn("Destroy: FFmpeg is not loaded. Run init() first.");
    } else {
      await this.ffmpeg?.terminate();
    }
  }
}
