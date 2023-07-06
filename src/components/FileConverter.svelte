<script context="module" lang="ts">
  const elements = new Set<{ convert; cancel; download; getResult }>();

  export const convertAll = async () => {
    return Promise.all(
      Array.from(elements).map(async (el) => {
        return el.convert();
      })
    );
  };

  export const cancelAll = async () => {
    return Promise.all(
      Array.from(elements).map((el) => {
        return el.cancel();
      })
    );
  };

  export const downloadAll = async (useNative = false) => {
    if (useNative && "showDirectoryPicker" in window) {
      const results = Array.from(elements).map((el) => el.getResult());

      try {
        await saveAllFiles(results, "downloadAllDir");
      } catch (e) {
        console.warn(e);
      }
    } else {
      Array.from(elements).forEach((el) => {
        el.download();
      });
    }
  };
</script>

<script lang="ts">
  import { FFmpegConverter } from "@/lib/FFmpegConverter";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { get, writable, type Writable } from "svelte/store";
  import UiProgressBar from "./ui/UIProgressBar.svelte";
  import { getOutputFilename, saveAllFiles } from "@/lib/utils";
  import UiDownloadData from "./ui/UIDownloadData.svelte";
  import UiWaitingDots from "./ui/UIWaitingDots.svelte";
  import { fade } from "svelte/transition";
  import {
    conversionCount,
    filesReadyForDownload,
    isDownloadReady,
    type SelectedSettings,
  } from "@/store";
  import type { ConfigFormatOption } from "@/config";
  import UiButton from "./ui/UIButton.svelte";

  export let file: File;
  export let format: ConfigFormatOption;
  export let settings: SelectedSettings;
  export let logger: Writable<string>;
  export let showSparkle: boolean = true;

  let ffmpeg;
  let result: Uint8Array;
  let progress = writable<number>(0);
  let isLoading: boolean = false;
  let isConverting: boolean = false;
  let isError: boolean = false;
  let isCanceled: boolean = false;

  const emits = createEventDispatcher();

  $: outputFilename = getOutputFilename(file.name, format);

  const init = async (): Promise<boolean> => {
    if (ffmpeg.isLoaded()) {
      isLoading = false;
      return;
    }

    isLoading = true;

    try {
      await ffmpeg.init();
    } catch (error) {
      console.warn(error);
    } finally {
      isLoading = false;
    }
  };

  let waitTimeout;
  const waitWhileLoading = async () => {
    while (isLoading) {
      await new Promise((resolve) => (waitTimeout = setTimeout(resolve, 200)));
    }
  };

  const convert = async () => {
    isError = false;
    result = null;
    $filesReadyForDownload.delete(file);
    $filesReadyForDownload = get(filesReadyForDownload);

    await waitWhileLoading();

    try {
      isConverting = true;
      result = await ffmpeg.convert(format, settings);

      if (result.length === 0) {
        throw new Error("FFmpeg returned empty result");
      } else {
        filesReadyForDownload.set($filesReadyForDownload.add(file));
      }
    } catch (error) {
      if (!isCanceled) {
        isError = true;
        console.warn(error);
      }
    } finally {
      if (!isCanceled && !isError) {
        $conversionCount += 1;
      }
      isConverting = false;
    }
  };

  const cancel = async () => {
    await waitWhileLoading();

    isCanceled = true;
    await ffmpeg.cancel();
    isConverting = false;
    isError = false;
    isCanceled = false;
  };

  let downloadLink;

  const download = () => {
    if (downloadLink && result) {
      downloadLink.querySelector("button")?.click();
    }
  };

  const getResult = (): { data: Blob; filename: string } => ({
    data: new Blob([result], { type: format.mimetype }),
    filename: outputFilename,
  });

  const exports = {
    convert,
    cancel,
    download,
    getResult,
  };

  const onRemoveFile = () => {
    emits("remove", file);
  };

  onMount(async () => {
    ffmpeg = new FFmpegConverter(file, progress, logger);
    elements.add(exports);
    init();
  });

  onDestroy(async () => {
    clearTimeout(waitTimeout);
    isLoading = false;
    ffmpeg?.destroy();
    elements.delete(exports);
  });
</script>

<div class="w-1/3 shrink grow truncate">{file.name}</div>

<div class="w-1/3 shrink grow text-center">
  {#if result}
    <div bind:this={downloadLink}>
      <UiDownloadData
        data={result}
        type={format.mimetype}
        filename={outputFilename}
        useNative={true}
        small={true}>Download</UiDownloadData
      >
    </div>
  {:else}
    {#if isLoading}
      <p class="relative" in:fade={{ duration: 150 }}>
        loading file<UiWaitingDots show={true} />
      </p>
    {:else if isCanceled}
      <p class="relative" in:fade={{ duration: 150 }}>
        cancel<UiWaitingDots show={true} />
      </p>
    {:else if isConverting && !isCanceled}
      {#if $progress <= 0}
        <p class="relative" in:fade={{ duration: 150 }}>
          preparing<UiWaitingDots show={true} />
        </p>
      {:else}
        <div in:fade={{ duration: 150 }}>
          <UiProgressBar {showSparkle} value={$progress} />
        </div>
      {/if}
    {/if}

    {#if isError}
      <p class="text-center" in:fade={{ duration: 150 }}>
        There was an FFMPEG error. Check output in "Expert Stuff" console.
      </p>
    {/if}
  {/if}
</div>
{#if isConverting}
  <UiButton
    disabled={isCanceled}
    small={true}
    on:click={() => cancel()}
    title={`Cancel file conversion of ${file.name}`}>Cancel</UiButton
  >
{:else}
  <UiButton
    disabled={!result && (isLoading || isCanceled)}
    on:click={() => onRemoveFile()}
    small={true}
    title={`Remove file ${file.name}`}>Remove</UiButton
  >
{/if}
