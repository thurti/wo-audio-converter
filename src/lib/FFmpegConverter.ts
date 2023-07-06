import { createFFmpeg, fetchFile, type FFmpeg } from "@ffmpeg/ffmpeg";
import { writable, type Writable } from "svelte/store";
import { getOutputFilename, createFFmegCommandArgs } from "./utils";
import type { SelectedSettings } from "@/store";
import type { ConfigFormatOption } from "@/config";

export class FFmpegConverter {
  file: File;
  progress: Writable<number>;
  logger: Writable<string>;

  private ffmpeg: FFmpeg;

  constructor(
    file: File,
    progress?: Writable<number>,
    logger?: Writable<string>
  ) {
    this.file = file;
    this.progress = progress ?? writable(0);
    this.logger = logger ?? writable("");
  }

  async init(): Promise<void> {
    this.progress.set(0);
    this.ffmpeg = createFFmpeg({
      corePath: import.meta.env.VITE_FFMPEG_CORE_PATH,
      progress: ({ ratio }) => {
        this.progress.set(ratio);
      },
    });

    this.ffmpeg.setLogger(({ type, message }) => {
      this.logger.update((logger) => `${logger}\n${type}: ${message}`);
    });

    await this.ffmpeg.load();
    this.ffmpeg.FS("writeFile", this.file.name, await fetchFile(this.file));
  }

  isLoaded(): boolean {
    return this.ffmpeg?.isLoaded() ?? false;
  }

  async convert(
    format: ConfigFormatOption,
    settings: SelectedSettings
  ): Promise<Uint8Array> {
    if (!this.ffmpeg?.isLoaded()) {
      console.warn("Convert: FFmpeg is not loaded. Run init() first.");
      return;
    }

    const filename = this.file.name;

    const outputFilename = getOutputFilename(filename, format);
    const commandArgs = createFFmegCommandArgs(this.file, format, settings);

    await this.ffmpeg.run(...commandArgs);
    return this.ffmpeg.FS("readFile", outputFilename);
  }

  async cancel(): Promise<void> {
    if (!this.ffmpeg?.isLoaded()) {
      console.warn("Cancel: FFmpeg is not loaded. Run init() first.");
      return;
    } else {
      this.ffmpeg.exit();
      return this.init();
    }
  }

  destroy(): void {
    if (!this.ffmpeg?.isLoaded()) {
      console.warn("Destroy: FFmpeg is not loaded. Run init() first.");
    } else {
      this.ffmpeg.exit();
    }
  }
}
